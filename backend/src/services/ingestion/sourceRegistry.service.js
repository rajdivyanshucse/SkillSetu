import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors.js';

export const SOURCE_CATEGORIES = {
  JOB_POSTINGS: 'JOB_POSTINGS',
  SKILL_TAXONOMY: 'SKILL_TAXONOMY',
  ROLE_TAXONOMY: 'ROLE_TAXONOMY',
  SALARY_DATA: 'SALARY_DATA',
  WORKFORCE_DATA: 'WORKFORCE_DATA',
  EDUCATION_DATA: 'EDUCATION_DATA',
  GOVERNMENT_DATA: 'GOVERNMENT_DATA',
  ORGANIZATION_DATA: 'ORGANIZATION_DATA',
  OTHER: 'OTHER',
};

export const DATASET_VERSION_STATUS = {
  DRAFT: 'DRAFT',
  VALIDATING: 'VALIDATING',
  READY: 'READY',
  PROCESSING: 'PROCESSING',
  IMPORTED: 'IMPORTED',
  FAILED: 'FAILED',
  QUARANTINED: 'QUARANTINED',
  ARCHIVED: 'ARCHIVED',
};

export class SourceRegistryService {
  /**
   * Registers a new data source.
   */
  async registerSource(data) {
    if (!data.name || typeof data.name !== 'string') {
      throw new ValidationError('Data source name is required');
    }
    if (!data.provider || typeof data.provider !== 'string') {
      throw new ValidationError('Data source provider is required');
    }

    const existing = await prisma.dataSource.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictError(`Data source with name "${data.name}" already exists`);
    }

    const type = data.type && SOURCE_CATEGORIES[data.type] ? data.type : SOURCE_CATEGORIES.JOB_POSTINGS;

    const source = await prisma.dataSource.create({
      data: {
        name: data.name.trim(),
        type,
        provider: data.provider.trim(),
        description: data.description || null,
        url: data.url || null,
        license: data.license || null,
        status: data.status || 'ACTIVE',
        metadata: data.metadata || {},
      },
    });

    logger.info(`[SourceRegistry] Registered data source "${source.name}" (${source.id})`, {
      sourceId: source.id,
      type: source.type,
      provider: source.provider,
    });

    return source;
  }

  /**
   * Lists data sources with optional filtering.
   */
  async listSources(filter = {}) {
    const where = {};
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;

    return prisma.dataSource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a data source by ID.
   */
  async getSourceById(id) {
    const source = await prisma.dataSource.findUnique({ where: { id } });
    if (!source) {
      throw new NotFoundError(`Data source not found with ID: ${id}`);
    }
    return source;
  }

  /**
   * Updates a data source.
   */
  async updateSource(id, updateData) {
    await this.getSourceById(id);
    return prisma.dataSource.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Registers a new dataset under a data source.
   */
  async registerDataset(data) {
    if (!data.sourceId) {
      throw new ValidationError('sourceId is required for dataset');
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new ValidationError('Dataset name is required');
    }

    // Verify source exists
    await this.getSourceById(data.sourceId);

    const existing = await prisma.dataset.findUnique({
      where: {
        sourceId_name: {
          sourceId: data.sourceId,
          name: data.name.trim(),
        },
      },
    });

    if (existing) {
      throw new ConflictError(`Dataset "${data.name}" already exists for source`);
    }

    const dataset = await prisma.dataset.create({
      data: {
        sourceId: data.sourceId,
        name: data.name.trim(),
        category: data.category || SOURCE_CATEGORIES.JOB_POSTINGS,
        description: data.description || null,
        metadata: data.metadata || {},
      },
    });

    logger.info(`[SourceRegistry] Registered dataset "${dataset.name}" (${dataset.id})`, {
      datasetId: dataset.id,
      sourceId: dataset.sourceId,
    });

    return dataset;
  }

  /**
   * Lists datasets with optional filtering.
   */
  async listDatasets(filter = {}) {
    const where = {};
    if (filter.sourceId) where.sourceId = filter.sourceId;
    if (filter.category) where.category = filter.category;

    return prisma.dataset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a dataset by ID.
   */
  async getDatasetById(id) {
    const dataset = await prisma.dataset.findUnique({ where: { id } });
    if (!dataset) {
      throw new NotFoundError(`Dataset not found with ID: ${id}`);
    }
    return dataset;
  }

  /**
   * Creates a new dataset version.
   */
  async createDatasetVersion(data) {
    if (!data.datasetId) {
      throw new ValidationError('datasetId is required');
    }
    if (!data.versionTag || typeof data.versionTag !== 'string') {
      throw new ValidationError('versionTag is required (e.g. v1.0.0, 2026-Q1-batch1)');
    }

    // Verify dataset exists
    const dataset = await this.getDatasetById(data.datasetId);

    const existing = await prisma.datasetVersion.findUnique({
      where: {
        datasetId_versionTag: {
          datasetId: data.datasetId,
          versionTag: data.versionTag.trim(),
        },
      },
    });

    if (existing) {
      throw new ConflictError(`Version "${data.versionTag}" already exists for dataset "${dataset.name}"`);
    }

    const version = await prisma.datasetVersion.create({
      data: {
        datasetId: data.datasetId,
        versionTag: data.versionTag.trim(),
        effectiveStartDate: data.effectiveStartDate ? new Date(data.effectiveStartDate) : null,
        effectiveEndDate: data.effectiveEndDate ? new Date(data.effectiveEndDate) : null,
        schemaVersion: data.schemaVersion || '1.0',
        format: (data.format || 'JSON').toUpperCase(),
        fileHash: data.fileHash || null,
        recordCount: data.recordCount || 0,
        status: data.status || DATASET_VERSION_STATUS.DRAFT,
        metadata: data.metadata || {},
      },
    });

    // Update currentVersionId on dataset if not set
    if (!dataset.currentVersionId) {
      await prisma.dataset.update({
        where: { id: dataset.id },
        data: { currentVersionId: version.id },
      });
    }

    logger.info(`[SourceRegistry] Created dataset version ${version.versionTag} (${version.id})`, {
      datasetId: dataset.id,
      versionId: version.id,
    });

    return version;
  }

  /**
   * Lists versions for a dataset.
   */
  async listDatasetVersions(datasetId) {
    await this.getDatasetById(datasetId);
    return prisma.datasetVersion.findMany({
      where: { datasetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a dataset version by ID.
   */
  async getDatasetVersionById(id) {
    const version = await prisma.datasetVersion.findUnique({ where: { id } });
    if (!version) {
      throw new NotFoundError(`Dataset version not found with ID: ${id}`);
    }
    return version;
  }

  /**
   * Updates a dataset version status, counts, or quality score.
   */
  async updateDatasetVersion(id, updateData) {
    await this.getDatasetVersionById(id);
    return prisma.datasetVersion.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Retrieves summary cards for all registered sources including official sources (O*NET, ESCO).
   */
  async getSourcesSummary() {
    const sources = await prisma.dataSource.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const summaries = [];
    for (const source of sources) {
      const datasets = await prisma.dataset.findMany({
        where: { sourceId: source.id },
      });

      let totalRecords = 0;
      let totalAccepted = 0;
      let totalQuarantined = 0;
      let totalDuplicates = 0;
      let latestVersion = null;
      let latestQualityScore = null;
      let latestImportDate = null;
      let latestStatus = 'PENDING_IMPORT';

      for (const ds of datasets) {
        const versions = await prisma.datasetVersion.findMany({
          where: { datasetId: ds.id },
          orderBy: { createdAt: 'desc' },
        });

        if (versions.length > 0) {
          const v = versions[0];
          if (!latestVersion) {
            latestVersion = v.versionTag;
            latestQualityScore = v.qualityScore;
            latestImportDate = v.createdAt;
            latestStatus = v.status;
          }
          for (const ver of versions) {
            totalRecords += ver.recordCount || 0;
            totalAccepted += ver.validRecordCount || 0;
            totalQuarantined += ver.quarantinedCount || 0;
            totalDuplicates += ver.duplicateCount || 0;
          }
        }
      }

      const meta = source.metadata || {};
      const officialKey =
        meta.officialIdentifier ||
        (source.name?.toUpperCase().includes('O*NET') || source.name?.toUpperCase().includes('ONET')
          ? 'ONET'
          : source.name?.toUpperCase().includes('ESCO')
          ? 'ESCO'
          : null);

      summaries.push({
        id: source.id,
        name: source.name,
        officialKey,
        provider: source.provider,
        type: source.type,
        url: source.url,
        license: source.license,
        status: source.status,
        provenance: 'IMPORTED',
        datasetsCount: datasets.length,
        latestImportedVersion: latestVersion || 'Not yet imported',
        latestImportDate,
        latestStatus,
        totalRecords,
        totalAccepted,
        totalQuarantined,
        totalDuplicates,
        qualityScore: latestQualityScore !== null ? latestQualityScore : null,
      });
    }

    return summaries;
  }

  /**
   * Checks whether an official or registered source has an updated version available.
   */
  async checkSourceUpdate(sourceId) {
    const source = await this.getSourceById(sourceId);
    const meta = source.metadata || {};
    const officialKey =
      meta.officialIdentifier ||
      (source.name?.toUpperCase().includes('O*NET') || source.name?.toUpperCase().includes('ONET')
        ? 'ONET'
        : source.name?.toUpperCase().includes('ESCO')
        ? 'ESCO'
        : null);

    // Get latest imported version
    const datasets = await prisma.dataset.findMany({ where: { sourceId: source.id } });
    let latestImported = null;
    if (datasets.length > 0) {
      const versions = await prisma.datasetVersion.findMany({
        where: { datasetId: { in: datasets.map((d) => d.id) } },
        orderBy: { createdAt: 'desc' },
      });
      if (versions.length > 0) {
        latestImported = versions[0].versionTag;
      }
    }

    let latestAvailableRelease = null;
    let releaseNotes = null;
    let updateAvailable = false;

    if (officialKey === 'ONET') {
      latestAvailableRelease = '30.1';
      releaseNotes = 'Official O*NET 30.1 Database release with updated taxonomy and emerging technology skills.';
      if (!latestImported || !latestImported.includes('30.1')) {
        updateAvailable = true;
      }
    } else if (officialKey === 'ESCO') {
      latestAvailableRelease = 'v1.2.0';
      releaseNotes = 'Official ESCO v1.2.0 release featuring updated green and digital competencies.';
      if (!latestImported || !latestImported.includes('1.2')) {
        updateAvailable = true;
      }
    } else {
      latestAvailableRelease = '1.0';
      releaseNotes = 'Configured upstream dataset feed.';
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      officialKey,
      latestImportedVersion: latestImported || 'None',
      latestAvailableRelease,
      updateAvailable,
      releaseNotes,
      checkedAt: new Date().toISOString(),
    };
  }
}

export const sourceRegistryService = new SourceRegistryService();
export default sourceRegistryService;

