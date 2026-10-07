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

export const ESCO_SOURCE_KEY = 'ESCO';
export const ESCO_DEFAULT_NAME = 'European Skills, Competences, Qualifications and Occupations (ESCO)';
export const ESCO_PROVIDER = 'European Commission / DG Employment, Social Affairs and Inclusion';
export const ESCO_OFFICIAL_URL = 'https://esco.ec.europa.eu/';
export const ESCO_LICENSE = 'ODbL / CC BY 4.0 (European Commission Open Data)';

export class EscoConnectorService {
  /**
   * Ensures the official ESCO DataSource exists in the database.
   */
  async ensureEscoSource() {
    let source = await prisma.dataSource.findFirst({
      where: {
        OR: [
          { name: ESCO_DEFAULT_NAME },
          { provider: ESCO_PROVIDER },
        ],
      },
    });

    if (!source) {
      source = await sourceRegistryService.registerSource({
        name: ESCO_DEFAULT_NAME,
        provider: ESCO_PROVIDER,
        type: SOURCE_CATEGORIES.SKILL_TAXONOMY,
        description: 'Multilingual classification of European Skills, Competences, Qualifications and Occupations.',
        url: ESCO_OFFICIAL_URL,
        license: ESCO_LICENSE,
        metadata: {
          officialIdentifier: ESCO_SOURCE_KEY,
          classificationStandard: 'ISCO-08',
          supportedVersions: ['v1.0.8', 'v1.1.0', 'v1.1.1', 'v1.2.0'],
          provenance: 'IMPORTED',
        },
      });
    }

    return source;
  }

  /**
   * Ingests an official ESCO dataset release package or structured files into canonical taxonomy models.
   * @param {Object} input - { versionTag, occupations, skills, occupationSkillRelations, rawBuffer, format, force }
   */
  async importEscoDataset(input = {}, options = {}) {
    const startTime = Date.now();
    const source = await this.ensureEscoSource();

    const versionTag = (input.versionTag || options.versionTag || `esco-v1.2-${Date.now()}`).trim();
    const format = (input.format || options.format || 'CSV').toUpperCase();

    // 1. Resolve or Create Dataset under ESCO Source
    let dataset = await prisma.dataset.findFirst({
      where: {
        sourceId: source.id,
        name: 'ESCO Multilingual Skills & Occupations Taxonomy',
      },
    });

    if (!dataset) {
      dataset = await sourceRegistryService.registerDataset({
        sourceId: source.id,
        name: 'ESCO Multilingual Skills & Occupations Taxonomy',
        category: SOURCE_CATEGORIES.SKILL_TAXONOMY,
        description: 'Standardized European taxonomy connecting occupations, essential competencies, transversal skills, and multilingual concepts.',
        metadata: {
          officialIdentifier: ESCO_SOURCE_KEY,
          license: ESCO_LICENSE,
        },
      });
    }

    // 2. Parse payload / compute SHA-256 checksum
    let occupations = [];
    let skills = [];
    let occupationSkillRelations = [];
    let rawContentHash = null;

    if (input.rawBuffer || typeof input.content === 'string') {
      const buf = input.rawBuffer || Buffer.from(input.content, 'utf-8');
      rawContentHash = crypto.createHash('sha256').update(buf).digest('hex');
    } else {
      const hashPayload = JSON.stringify({
        occ: input.occupations || [],
        skl: input.skills || [],
        rel: input.occupationSkillRelations || [],
      });
      rawContentHash = crypto.createHash('sha256').update(hashPayload).digest('hex');
    }

    occupations = await this._parseSection(input.occupations, format);
    skills = await this._parseSection(input.skills, format);
    occupationSkillRelations = await this._parseSection(input.occupationSkillRelations, format);

    const totalRecords = occupations.length + skills.length + occupationSkillRelations.length;
    if (totalRecords === 0) {
      throw new ValidationError('ESCO import payload contains 0 valid records.');
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
          logger.info(`[EscoConnector] Version ${versionTag} already imported with identical checksum ${rawContentHash}. Skipping.`, {
            datasetVersionId: version.id,
          });
          return {
            status: 'ALREADY_IMPORTED',
            message: 'ESCO dataset version has already been successfully imported with matching SHA-256 checksum.',
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
        schemaVersion: options.schemaVersion || 'v1.2',
        format,
        fileHash: rawContentHash,
        recordCount: totalRecords,
        status: DATASET_VERSION_STATUS.PROCESSING,
        metadata: {
          source: ESCO_SOURCE_KEY,
          license: ESCO_LICENSE,
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
          source: ESCO_SOURCE_KEY,
          versionTag,
          recordCounts: {
            occupations: occupations.length,
            skills: skills.length,
            occupationSkillRelations: occupationSkillRelations.length,
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

      // 5. Ingest Occupations -> Roles
      const roleMapByUri = new Map(); // conceptUri -> roleId

      for (const occ of occupations) {
        const conceptUri = (occ.conceptUri || occ.concepturi || occ.uri || occ.id || '').trim();
        const preferredLabel = (occ.preferredLabel || occ.preferredlabel || occ.title || occ.name || '').trim();
        const description = (occ.description || occ.desc || '').trim() || null;
        const iscoGroup = (occ.iscoGroup || occ.iscogroup || occ.code || '').trim();

        if (!conceptUri || !preferredLabel) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: conceptUri || 'UNKNOWN_URI',
            reason: 'INVALID_REQUIRED_FIELD',
            validationErrors: [{ field: !conceptUri ? 'conceptUri' : 'preferredLabel', message: 'Required occupation concept field missing' }],
            rawRecord: occ,
          });
          continue;
        }

        // Parse alt labels (handling newline or pipe separated values)
        let altLabels = [];
        const rawAltLabels = occ.altLabels || occ.altlabels;
        if (Array.isArray(rawAltLabels)) {
          altLabels = rawAltLabels;
        } else if (typeof rawAltLabels === 'string') {
          altLabels = rawAltLabels.split(/[\r\n|;]+/).map((s) => s.trim()).filter(Boolean);
        }

        const normTitle = preferredLabel.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // Reconcile against existing Role
        let role = await prisma.role.findFirst({
          where: {
            OR: [
              { normalizedName: normTitle },
              { name: preferredLabel },
            ],
          },
        });

        if (role) {
          updatedCount++;
          roleMapByUri.set(conceptUri, role.id);
        } else {
          role = await prisma.role.create({
            data: {
              name: preferredLabel,
              normalizedName: normTitle,
              category: this._classifyIscoGroup(iscoGroup, preferredLabel),
              description,
              isActive: true,
            },
          });
          acceptedCount++;
          roleMapByUri.set(conceptUri, role.id);
        }

        // Upsert ExternalTaxonomyMapping preserving conceptUri
        await prisma.externalTaxonomyMapping.upsert({
          where: {
            source_externalId_internalEntityType: {
              source: ESCO_SOURCE_KEY,
              externalId: conceptUri,
              internalEntityType: 'ROLE',
            },
          },
          create: {
            source: ESCO_SOURCE_KEY,
            datasetVersionId: version.id,
            entityType: 'ROLE',
            externalId: conceptUri,
            externalUri: conceptUri,
            internalEntityType: 'ROLE',
            internalEntityId: role.id,
            preferredLabel,
            altLabels,
            mappingConfidence: 1.0,
            mappingType: 'EXACT',
            sourceMetadata: {
              conceptUri,
              iscoGroup,
              localizedLabels: occ.localizedLabels || occ.localizedlabels || {},
              provenance: 'IMPORTED',
            },
          },
          update: {
            datasetVersionId: version.id,
            preferredLabel,
            altLabels,
            updatedAt: new Date(),
          },
        });
      }

      // 6. Ingest Skills -> Skills
      const skillMapByUri = new Map(); // conceptUri -> skillId

      for (const skl of skills) {
        const conceptUri = (skl.conceptUri || skl.concepturi || skl.uri || skl.id || '').trim();
        const preferredLabel = (skl.preferredLabel || skl.preferredlabel || skl.name || skl.title || '').trim();
        const skillType = (skl.skillType || skl.skilltype || skl.type || 'skill/competence').trim();
        const reuseLevel = (skl.reuseLevel || skl.reuselevel || '').trim();
        const description = (skl.description || skl.desc || '').trim() || null;

        if (!conceptUri || !preferredLabel) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: conceptUri || 'UNKNOWN_SKILL_URI',
            reason: 'INVALID_REQUIRED_FIELD',
            validationErrors: [{ field: !conceptUri ? 'conceptUri' : 'preferredLabel', message: 'Required skill concept field missing' }],
            rawRecord: skl,
          });
          continue;
        }

        // Ambiguous check (e.g. 1-character labels or placeholder phrases)
        if (preferredLabel.length < 2 || /^(unspecified|generic|other|n\/a)$/i.test(preferredLabel)) {
          quarantinedCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId: version.id,
            ingestionJobId: jobRecord.id,
            externalId: conceptUri,
            reason: 'AMBIGUOUS_MAPPING',
            validationErrors: [{ field: 'preferredLabel', message: `Ambiguous ESCO label: "${preferredLabel}"` }],
            rawRecord: skl,
          });
          continue;
        }

        let altLabels = [];
        const rawAltLabels = skl.altLabels || skl.altlabels;
        if (Array.isArray(rawAltLabels)) {
          altLabels = rawAltLabels;
        } else if (typeof rawAltLabels === 'string') {
          altLabels = rawAltLabels.split(/[\r\n|;]+/).map((s) => s.trim()).filter(Boolean);
        }

        const normSkill = preferredLabel.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        let skill = await prisma.skill.findFirst({
          where: {
            OR: [
              { normalizedName: normSkill },
              { name: preferredLabel },
            ],
          },
        });

        if (skill) {
          updatedCount++;
          skillMapByUri.set(conceptUri, skill.id);
        } else {
          skill = await prisma.skill.create({
            data: {
              name: preferredLabel,
              normalizedName: normSkill,
              category: this._classifyEscoCategory(skillType, reuseLevel),
              description,
              isActive: true,
            },
          });
          acceptedCount++;
          newlyCreatedSkillIds.push(skill.id);
          skillMapByUri.set(conceptUri, skill.id);
        }

        // Upsert ExternalTaxonomyMapping preserving conceptUri & multilingual metadata
        await prisma.externalTaxonomyMapping.upsert({
          where: {
            source_externalId_internalEntityType: {
              source: ESCO_SOURCE_KEY,
              externalId: conceptUri,
              internalEntityType: 'SKILL',
            },
          },
          create: {
            source: ESCO_SOURCE_KEY,
            datasetVersionId: version.id,
            entityType: skillType.includes('knowledge') ? 'KNOWLEDGE' : 'COMPETENCE',
            externalId: conceptUri,
            externalUri: conceptUri,
            internalEntityType: 'SKILL',
            internalEntityId: skill.id,
            preferredLabel,
            altLabels,
            mappingConfidence: 1.0,
            mappingType: 'EXACT',
            sourceMetadata: {
              conceptUri,
              skillType,
              reuseLevel,
              localizedLabels: skl.localizedLabels || skl.localizedlabels || {},
              provenance: 'IMPORTED',
            },
          },
          update: {
            datasetVersionId: version.id,
            preferredLabel,
            altLabels,
            updatedAt: new Date(),
          },
        });
      }

      // 7. Ingest Occupation-Skill Relations -> RoleSkill
      for (const rel of occupationSkillRelations) {
        const occUri = (rel.occupationUri || rel.occupationuri || rel.occupation_uri || rel.occupation || '').trim();
        const sklUri = (rel.skillUri || rel.skilluri || rel.skill_uri || rel.skill || '').trim();
        const relationType = (rel.relationType || rel.relationtype || rel.relation_type || 'essential').toLowerCase();

        if (!occUri || !sklUri) continue;

        const roleId = roleMapByUri.get(occUri);
        const skillId = skillMapByUri.get(sklUri);

        if (roleId && skillId) {
          const reqType = relationType === 'essential' ? 'REQUIRED' : 'PREFERRED';
          const importance = relationType === 'essential' ? 90 : 70;

          await this._upsertRoleSkill(roleId, skillId, reqType, importance);
        }
      }

      // 8. Trigger Embedding Reindex asynchronously for new canonical skills
      if (newlyCreatedSkillIds.length > 0) {
        setImmediate(async () => {
          try {
            logger.info(`[EscoConnector] Reindexing embeddings for ${newlyCreatedSkillIds.length} new canonical skills`);
            await embeddingService.reindexAllSkills();
          } catch (err) {
            logger.warn(`[EscoConnector] Async skill embedding reindex warning: ${err.message}`);
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

      logger.info(`[EscoConnector] Completed ESCO import version ${versionTag} in ${durationMs}ms`, {
        versionTag,
        acceptedCount,
        updatedCount,
        quarantinedCount,
        qualityScore: qualityReport.overallScore,
      });

      return {
        status: 'SUCCESS',
        source: ESCO_SOURCE_KEY,
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
      logger.error(`[EscoConnector] Ingestion failed: ${err.message}`, { stack: err.stack });
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

  _classifyIscoGroup(iscoGroup, title) {
    if (iscoGroup.startsWith('25') || /developer|software|programmer|engineer/i.test(title)) {
      return 'Information and Communications Technology';
    }
    if (iscoGroup.startsWith('21')) return 'Science and Engineering';
    if (iscoGroup.startsWith('12')) return 'Business and Administration';
    return 'Professional Occupations';
  }

  _classifyEscoCategory(skillType, reuseLevel) {
    if (reuseLevel === 'cross-sector' || reuseLevel === 'transversal') {
      return 'Transversal & Cross-Sector Competencies';
    }
    if (skillType.includes('knowledge')) {
      return 'Domain Knowledge & Theories';
    }
    return 'Technical & Applied Skills';
  }
}

export const escoConnectorService = new EscoConnectorService();
export default escoConnectorService;
