import crypto from 'node:crypto';
import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { sourceRegistryService, DATASET_VERSION_STATUS, SOURCE_CATEGORIES } from './sourceRegistry.service.js';
import { normalizationService, NORMALIZATION_STATUS, MATCH_METHOD } from './normalization.service.js';
import { qualityService } from './quality.service.js';
import { quarantineService } from './quarantine.service.js';
import { importService } from './import.service.js';
import embeddingService from '../embedding.service.js';
import metricsService from '../metrics.service.js';
import { ValidationError } from '../../utils/errors.js';

export const ONET_SOURCE_KEY = 'ONET';
export const ONET_DEFAULT_NAME = 'O*NET Resource Center';
export const ONET_PROVIDER = 'U.S. Department of Labor / Employment and Training Administration (USDOL/ETA)';
export const ONET_OFFICIAL_URL = 'https://www.onetcenter.org/database.html';
export const ONET_LICENSE = 'CC BY 4.0 (O*NET is a trademark of USDOL/ETA)';

export class OnetConnectorService {
  /**
   * Ensures the official O*NET DataSource exists in the database.
   */
  async ensureOnetSource() {
    let source = await prisma.dataSource.findFirst({
      where: {
        OR: [
          { name: ONET_DEFAULT_NAME },
          { provider: ONET_PROVIDER },
        ],
      },
    });

    if (!source) {
      source = await sourceRegistryService.registerSource({
        name: ONET_DEFAULT_NAME,
        provider: ONET_PROVIDER,
        type: SOURCE_CATEGORIES.ROLE_TAXONOMY,
        description: 'Authoritative occupational and skills taxonomy published by the U.S. Department of Labor / ETA.',
        url: ONET_OFFICIAL_URL,
        license: ONET_LICENSE,
        metadata: {
          officialIdentifier: ONET_SOURCE_KEY,
          majorGroups: 'Standard Occupational Classification (SOC)',
          supportedVersions: ['28.0', '28.1', '28.2', '29.0', '29.1', '30.0', '30.1'],
          provenance: 'IMPORTED',
        },
      });
    }

    return source;
  }

  /**
   * Ingests an official O*NET dataset package or structured files into canonical taxonomy models.
   * @param {Object} input - { versionTag, occupations, skills, technologySkills, occupationSkills, alternateTitles, rawBuffer, format, force }
   */
  async importOnetDataset(input = {}, options = {}) {
    const startTime = Date.now();
    const source = await this.ensureOnetSource();

    const versionTag = (input.versionTag || options.versionTag || `onet-release-${Date.now()}`).trim();
    const format = (input.format || options.format || 'CSV').toUpperCase();

    // 1. Resolve or Create Dataset under O*NET Source
    let dataset = await prisma.dataset.findFirst({
      where: {
        sourceId: source.id,
        name: 'O*NET Occupational & Skills Taxonomy',
      },
    });

    if (!dataset) {
      dataset = await sourceRegistryService.registerDataset({
        sourceId: source.id,
        name: 'O*NET Occupational & Skills Taxonomy',
        category: SOURCE_CATEGORIES.ROLE_TAXONOMY,
        description: 'Comprehensive occupational definitions, required competencies, technology skills, and alternate titles.',
        metadata: {
          officialIdentifier: ONET_SOURCE_KEY,
          license: ONET_LICENSE,
        },
      });
    }

    // 2. Parse payload / compute SHA-256 checksum
    let occupations = [];
    let skills = [];
    let technologySkills = [];
    let occupationSkills = [];
    let alternateTitles = [];
    let rawContentHash = null;

    if (input.rawBuffer || typeof input.content === 'string') {
      const buf = input.rawBuffer || Buffer.from(input.content, 'utf-8');
      rawContentHash = crypto.createHash('sha256').update(buf).digest('hex');
    } else {
      const hashPayload = JSON.stringify({
        occ: input.occupations || [],
        skl: input.skills || [],
        tech: input.technologySkills || [],
        rel: input.occupationSkills || [],
        alt: input.alternateTitles || [],
      });
      rawContentHash = crypto.createHash('sha256').update(hashPayload).digest('hex');
    }

    // Parse CSV contents if provided as text/buffer strings
    occupations = await this._parseSection(input.occupations, format);
    skills = await this._parseSection(input.skills, format);
    technologySkills = await this._parseSection(input.technologySkills, format);
    occupationSkills = await this._parseSection(input.occupationSkills, format);
    alternateTitles = await this._parseSection(input.alternateTitles, format);

    const totalRecords = occupations.length + skills.length + technologySkills.length + occupationSkills.length;
    if (totalRecords === 0) {
      throw new ValidationError('O*NET import payload contains 0 valid records.');
    }

    // 3. Version Resolution & Idempotency Check
    let version = await prisma.datasetVersion.findFirst({
      where: {
        datasetId: dataset.id,
        versionTag,
      },
    });

    if (version) {
      if (version.status === DATASET_VERSION_STATUS.IMPORTED && !options.force) {
        if (version.fileHash && version.fileHash === rawContentHash) {
          logger.info(`[OnetConnector] Version ${versionTag} already imported with identical checksum ${rawContentHash}. Skipping.`, {
            datasetVersionId: version.id,
          });
          return {
            status: 'ALREADY_IMPORTED',
            message: 'O*NET dataset version has already been successfully imported with matching SHA-256 checksum.',
            datasetVersionId: version.id,
            versionTag: version.versionTag,
            fileHash: version.fileHash,
            recordCount: version.recordCount,
            qualityScore: version.qualityScore,
          };
        }
      }
    } else {
      version = await sourceRegistryService.createDatasetVersion({
        datasetId: dataset.id,
        versionTag,
        schemaVersion: options.schemaVersion || '30.0',
        format,
        fileHash: rawContentHash,
        recordCount: totalRecords,
        status: DATASET_VERSION_STATUS.PROCESSING,
        metadata: {
          source: ONET_SOURCE_KEY,
          license: ONET_LICENSE,
          ingestedAt: new Date().toISOString(),
          provenance: 'IMPORTED',
        },
      });
    }

    // 4. Create Ingestion Job Record for tracking
    const jobRecord = await prisma.ingestionJobRecord.create({
      data: {
        datasetVersionId: version.id,
        stage: 'NORMALIZING',
        status: 'PROCESSING',
        progressPercent: 10,
        startedAt: new Date(),
        metadata: {
          source: ONET_SOURCE_KEY,
          versionTag,
          recordCounts: {
            occupations: occupations.length,
            skills: skills.length,
            technologySkills: technologySkills.length,
            occupationSkills: occupationSkills.length,
            alternateTitles: alternateTitles.length,
          },
        },
      },
    });

    try {
      let acceptedCount = 0;
      let updatedCount = 0;
      let duplicateCount = 0;
      let quarantinedCount = 0;
      const newlyCreatedSkillIds = [];

      // Map alternate titles by onetsoc_code
      const altTitlesMap = new Map();
      for (const alt of alternateTitles) {
        const code = (alt.onetsoc_code || alt.code || alt.soc_code || '').trim();
        const title = (alt.alternate_title || alt.title || alt.reported_job_title || '').trim();
        if (code && title) {
          if (!altTitlesMap.has(code)) altTitlesMap.set(code, new Set());
          altTitlesMap.get(code).add(title);
        }
      }

      // 5. Ingest Occupations -> Roles
      const roleMapBySoc = new Map(); // socCode -> roleId

      for (const occ of occupations) {
        const socCode = (occ.onetsoc_code || occ.code || occ.soc_code || occ.id || '').trim();
        const title = (occ.title || occ.name || occ.occupation || '').trim();
        const description = (occ.description || occ.desc || '').trim() || null;

        if (!socCode || !title) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: socCode || 'UNKNOWN_SOC',
            reason: 'INVALID_REQUIRED_FIELD',
            validationErrors: [{ field: !socCode ? 'onetsoc_code' : 'title', message: 'Required occupation field missing' }],
            rawRecord: occ,
          });
          continue;
        }

        // Check for ambiguous titles (e.g. general placeholders)
        if (title.length < 3 || /^(test|temp|unknown|null)$/i.test(title)) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: socCode,
            reason: 'AMBIGUOUS_MAPPING',
            validationErrors: [{ field: 'title', message: `Ambiguous or placeholder occupation title: "${title}"` }],
            rawRecord: occ,
          });
          continue;
        }

        const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const roleAliases = Array.from(altTitlesMap.get(socCode) || []);

        // Reconcile against existing Role
        let role = await prisma.role.findFirst({
          where: {
            OR: [
              { normalizedName: normTitle },
              { name: title },
            ],
          },
        });

        if (role) {
          // Update existing role if necessary
          updatedCount++;
          roleMapBySoc.set(socCode, role.id);
        } else {
          // Create new canonical Role
          role = await prisma.role.create({
            data: {
              name: title,
              normalizedName: normTitle,
              category: this._classifyOnetMajorGroup(socCode, title),
              description,
              isActive: true,
            },
          });
          acceptedCount++;
          roleMapBySoc.set(socCode, role.id);
        }

        // Upsert ExternalTaxonomyMapping
        await prisma.externalTaxonomyMapping.upsert({
          where: {
            source_externalId_internalEntityType: {
              source: ONET_SOURCE_KEY,
              externalId: socCode,
              internalEntityType: 'ROLE',
            },
          },
          create: {
            source: ONET_SOURCE_KEY,
            datasetVersionId: version.id,
            entityType: 'ROLE',
            externalId: socCode,
            externalUri: `https://www.onetcenter.org/taxonomy/2019/soc/${socCode}`,
            internalEntityType: 'ROLE',
            internalEntityId: role.id,
            preferredLabel: title,
            altLabels: roleAliases,
            mappingConfidence: 1.0,
            mappingType: 'EXACT',
            sourceMetadata: {
              socCode,
              majorGroup: this._classifyOnetMajorGroup(socCode, title),
              provenance: 'IMPORTED',
            },
          },
          update: {
            datasetVersionId: version.id,
            preferredLabel: title,
            altLabels: roleAliases,
            updatedAt: new Date(),
          },
        });
      }

      // 6. Ingest Skills & Technology Skills -> Skills
      const skillMapById = new Map(); // elementId/techName -> skillId

      // 6A. Core O*NET Skills (e.g. 2.A.1.a, 2.B.3.a)
      for (const skl of skills) {
        const elementId = (skl.element_id || skl.code || skl.id || '').trim();
        const skillName = (skl.element_name || skl.name || skl.title || '').trim();
        const description = (skl.description || skl.desc || '').trim() || null;

        if (!elementId || !skillName) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: elementId || 'UNKNOWN_SKILL',
            reason: 'INVALID_REQUIRED_FIELD',
            validationErrors: [{ field: !elementId ? 'element_id' : 'element_name', message: 'Required skill field missing' }],
            rawRecord: skl,
          });
          continue;
        }

        const normSkill = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        let skill = await prisma.skill.findFirst({
          where: {
            OR: [
              { normalizedName: normSkill },
              { name: skillName },
            ],
          },
        });

        if (skill) {
          updatedCount++;
          skillMapById.set(elementId, skill.id);
        } else {
          skill = await prisma.skill.create({
            data: {
              name: skillName,
              normalizedName: normSkill,
              category: this._classifySkillCategory(elementId, skillName),
              description,
              isActive: true,
            },
          });
          acceptedCount++;
          newlyCreatedSkillIds.push(skill.id);
          skillMapById.set(elementId, skill.id);
        }

        // Upsert ExternalTaxonomyMapping
        await prisma.externalTaxonomyMapping.upsert({
          where: {
            source_externalId_internalEntityType: {
              source: ONET_SOURCE_KEY,
              externalId: elementId,
              internalEntityType: 'SKILL',
            },
          },
          create: {
            source: ONET_SOURCE_KEY,
            datasetVersionId: version.id,
            entityType: 'SKILL',
            externalId: elementId,
            externalUri: `https://www.onetcenter.org/taxonomy/2019/element/${elementId}`,
            internalEntityType: 'SKILL',
            internalEntityId: skill.id,
            preferredLabel: skillName,
            altLabels: [],
            mappingConfidence: 1.0,
            mappingType: 'EXACT',
            sourceMetadata: {
              elementId,
              semanticType: 'SKILL',
              provenance: 'IMPORTED',
            },
          },
          update: {
            datasetVersionId: version.id,
            preferredLabel: skillName,
            updatedAt: new Date(),
          },
        });
      }

      // 6B. Technology Skills (e.g. Python, Docker, PostgreSQL)
      const seenTechNames = new Set();
      for (const tech of technologySkills) {
        const rawName = (tech.example || tech.name || tech.technology || '').trim();
        const socCode = (tech.onetsoc_code || tech.code || '').trim();
        if (!rawName) continue;

        const cleanName = rawName.replace(/^["']|["']$/g, '').trim();
        const normTech = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        let skill = await prisma.skill.findFirst({
          where: {
            OR: [
              { normalizedName: normTech },
              { name: cleanName },
            ],
          },
        });

        if (skill) {
          if (!seenTechNames.has(normTech)) {
            updatedCount++;
            seenTechNames.add(normTech);
          }
          skillMapById.set(cleanName.toLowerCase(), skill.id);
        } else {
          skill = await prisma.skill.create({
            data: {
              name: cleanName,
              normalizedName: normTech,
              category: 'Technology & Software',
              description: `Technology tool or software skill indexed from O*NET database.`,
              isActive: true,
            },
          });
          acceptedCount++;
          newlyCreatedSkillIds.push(skill.id);
          seenTechNames.add(normTech);
          skillMapById.set(cleanName.toLowerCase(), skill.id);
        }

        // If tech skill is paired with a socCode, map RoleSkill
        if (socCode && roleMapBySoc.has(socCode)) {
          const roleId = roleMapBySoc.get(socCode);
          await this._upsertRoleSkill(roleId, skill.id, 'REQUIRED', 85);
        }

        // Upsert ExternalTaxonomyMapping
        const techExternalId = `TECH-${normTech}`;
        await prisma.externalTaxonomyMapping.upsert({
          where: {
            source_externalId_internalEntityType: {
              source: ONET_SOURCE_KEY,
              externalId: techExternalId,
              internalEntityType: 'SKILL',
            },
          },
          create: {
            source: ONET_SOURCE_KEY,
            datasetVersionId: version.id,
            entityType: 'TECHNOLOGY',
            externalId: techExternalId,
            externalUri: null,
            internalEntityType: 'SKILL',
            internalEntityId: skill.id,
            preferredLabel: cleanName,
            altLabels: [],
            mappingConfidence: 1.0,
            mappingType: 'EXACT',
            sourceMetadata: {
              commodityCode: tech.commodity_code || null,
              hotTechnology: tech.hot_technology === 'Y',
              provenance: 'IMPORTED',
            },
          },
          update: {
            datasetVersionId: version.id,
            preferredLabel: cleanName,
            updatedAt: new Date(),
          },
        });
      }

      // 7. Ingest Occupation-Skill Relationships -> RoleSkill
      for (const rel of occupationSkills) {
        const socCode = (rel.onetsoc_code || rel.soc_code || '').trim();
        const elementId = (rel.element_id || rel.skill_id || '').trim();
        const scaleId = (rel.scale_id || 'IM').toUpperCase();
        const dataValue = parseFloat(rel.data_value || rel.importance || rel.score || 0);

        if (!socCode || !elementId) continue;

        const roleId = roleMapBySoc.get(socCode);
        const skillId = skillMapById.get(elementId);

        if (roleId && skillId) {
          // Scale 1-5 mapped to 0-100
          const importanceScore = Math.min(100, Math.max(0, Math.round((dataValue / 5.0) * 100)));
          const reqType = scaleId === 'IM' && dataValue >= 3.5 ? 'REQUIRED' : 'PREFERRED';

          await this._upsertRoleSkill(roleId, skillId, reqType, importanceScore || 75);
        }
      }

      // 8. Trigger Embedding Reindex asynchronously for new canonical skills
      if (newlyCreatedSkillIds.length > 0) {
        setImmediate(async () => {
          try {
            logger.info(`[OnetConnector] Reindexing embeddings for ${newlyCreatedSkillIds.length} new canonical skills`);
            await embeddingService.reindexAllSkills();
          } catch (err) {
            logger.warn(`[OnetConnector] Async skill embedding reindex warning: ${err.message}`);
          }
        });
      }

      // 9. Generate Quality Report & Finalize
      const qualityReport = await qualityService.evaluateDatasetQuality(version.id);
      const durationMs = Date.now() - startTime;

      await prisma.ingestionJobRecord.update({
        where: { id: jobRecord.id },
        data: {
          stage: 'COMPLETED',
          status: 'COMPLETED',
          progressPercent: 100,
          processedCount: totalRecords,
          successCount: acceptedCount + updatedCount,
          failureCount: quarantinedCount,
          duplicateCount,
          quarantinedCount,
          completedAt: new Date(),
        },
      });

      await sourceRegistryService.updateDatasetVersion(version.id, {
        status: DATASET_VERSION_STATUS.IMPORTED,
        validRecordCount: acceptedCount + updatedCount,
        rejectedRecordCount: quarantinedCount,
        duplicateCount,
        quarantinedCount,
        qualityScore: qualityReport.overallScore,
      });

      metricsService.recordIngestionBatch({
        datasetsImported: 1,
        processed: totalRecords,
        accepted: acceptedCount,
        rejected: quarantinedCount,
        quarantined: quarantinedCount,
        duplicates: duplicateCount,
        normSuccess: acceptedCount + updatedCount,
        normFail: quarantinedCount,
        durationMs,
      });

      logger.info(`[OnetConnector] Completed O*NET import version ${versionTag} in ${durationMs}ms`, {
        versionTag,
        acceptedCount,
        updatedCount,
        quarantinedCount,
        qualityScore: qualityReport.overallScore,
      });

      return {
        status: 'SUCCESS',
        source: ONET_SOURCE_KEY,
        versionTag,
        datasetVersionId: version.id,
        fileHash: rawContentHash,
        totalRecords,
        acceptedCount,
        updatedCount,
        quarantinedCount,
        duplicateCount,
        qualityScore: qualityReport.overallScore,
        durationMs,
      };
    } catch (err) {
      logger.error(`[OnetConnector] Ingestion failed: ${err.message}`, { stack: err.stack });
      await prisma.ingestionJobRecord.update({
        where: { id: jobRecord.id },
        data: {
          stage: 'FAILED',
          status: 'FAILED',
          errorLog: { message: err.message, stack: err.stack },
          completedAt: new Date(),
        },
      });
      await sourceRegistryService.updateDatasetVersion(version.id, {
        status: DATASET_VERSION_STATUS.FAILED,
      });
      throw err;
    }
  }

  async _parseSection(content, format = 'CSV') {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    const parsed = await importService.parseContent(content, format);
    return parsed.records || [];
  }

  async _upsertRoleSkill(roleId, skillId, requirementType = 'REQUIRED', importance = 80) {
    const existing = await prisma.roleSkill.findFirst({
      where: { roleId, skillId },
    });
    if (existing) {
      return prisma.roleSkill.update({
        where: { id: existing.id },
        data: {
          requirementType,
          importance: Math.max(existing.importance, importance),
          updatedAt: new Date(),
        },
      });
    }
    return prisma.roleSkill.create({
      data: {
        roleId,
        skillId,
        requirementType,
        importance,
        targetProficiency: importance >= 80 ? 'ADVANCED' : 'INTERMEDIATE',
      },
    });
  }

  _classifyOnetMajorGroup(socCode, title) {
    if (socCode.startsWith('15-')) return 'Computer and Mathematical Occupations';
    if (socCode.startsWith('11-')) return 'Management Occupations';
    if (socCode.startsWith('13-')) return 'Business and Financial Operations';
    if (socCode.startsWith('17-')) return 'Architecture and Engineering';
    if (socCode.startsWith('19-')) return 'Life, Physical, and Social Science';
    return 'Software & Technology Occupations';
  }

  _classifySkillCategory(elementId, skillName) {
    if (elementId.startsWith('2.A.')) return 'Basic Skills & Competencies';
    if (elementId.startsWith('2.B.1')) return 'Complex Problem Solving';
    if (elementId.startsWith('2.B.3')) return 'Technical & Systems Skills';
    if (elementId.startsWith('2.B.')) return 'Cross-Functional Skills';
    return 'Professional & Technical Skills';
  }
}

export const onetConnectorService = new OnetConnectorService();
export default onetConnectorService;
