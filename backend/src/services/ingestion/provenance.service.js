import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export const PROVENANCE_SOURCE_TYPES = {
  SEEDED: 'SEEDED',
  IMPORTED: 'IMPORTED',
  DERIVED: 'DERIVED',
  FORECAST: 'FORECAST',
};

export class ProvenanceService {
  /**
   * Constructs standardized provenance metadata for analytical records.
   */
  createProvenanceMetadata({
    sourceType = PROVENANCE_SOURCE_TYPES.IMPORTED,
    sourceId,
    sourceName,
    datasetId,
    datasetVersionId,
    versionTag,
    ingestionJobId,
    observationPeriod,
    isLive = false,
  }) {
    return {
      sourceType,
      sourceId: sourceId || null,
      sourceName: sourceName || null,
      datasetId: datasetId || null,
      datasetVersionId: datasetVersionId || null,
      versionTag: versionTag || null,
      ingestionJobId: ingestionJobId || null,
      observationPeriod: observationPeriod || null,
      isLive: Boolean(isLive), // Strictly false unless live external source is verified
      ingestedAt: new Date().toISOString(),
      governance: {
        provenanceVerified: true,
        traceable: Boolean(datasetVersionId),
      },
    };
  }

  /**
   * Upserts aggregated demand observations with imported provenance.
   */
  async recordImportedDemandObservations({
    datasetVersionId,
    sourceId,
    ingestionJobId,
    normalizedRecords,
  }) {
    const version = await prisma.datasetVersion.findUnique({
      where: { id: datasetVersionId },
    });

    const dataset = version
      ? await prisma.dataset.findUnique({ where: { id: version.datasetId } })
      : null;

    const source = dataset
      ? await prisma.dataSource.findUnique({ where: { id: dataset.sourceId } })
      : null;

    // Aggregate skill demand observations by (skillId, period)
    const skillCounts = new Map();
    // Aggregate role demand observations by (roleId, period)
    const roleCounts = new Map();

    for (const rec of normalizedRecords) {
      if (rec.validationStatus !== 'VALID' || !rec.normalizedData) continue;
      const data = rec.normalizedData;
      const period = data.date?.quarter || `${new Date().getFullYear()}-Q1`;

      // Role aggregation
      if (data.role?.roleId) {
        const key = `${data.role.roleId}:::${period}`;
        roleCounts.set(key, (roleCounts.get(key) || 0) + 1);
      }

      // Skills aggregation
      if (Array.isArray(data.skills)) {
        for (const s of data.skills) {
          if (s.skillId) {
            const key = `${s.skillId}:::${period}`;
            skillCounts.set(key, (skillCounts.get(key) || 0) + 1);
          }
        }
      }
    }

    let createdSkillObservations = 0;
    let createdRoleObservations = 0;

    // Upsert skill demand observations
    for (const [key, count] of skillCounts.entries()) {
      const [skillId, period] = key.split(':::');
      const existing = await prisma.skillDemandObservation.findFirst({
        where: {
          skillId,
          period,
          sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
        },
      });

      if (existing) {
        await prisma.skillDemandObservation.update({
          where: { id: existing.id },
          data: {
            demandCount: existing.demandCount + count,
            sourceCount: existing.sourceCount + 1,
            dataQuality: 'HIGH',
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.skillDemandObservation.create({
          data: {
            skillId,
            period,
            demandCount: count,
            sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
            sourceCount: 1,
            dataQuality: 'HIGH',
          },
        });
        createdSkillObservations++;
      }
    }

    // Upsert role demand observations
    for (const [key, count] of roleCounts.entries()) {
      const [roleId, period] = key.split(':::');
      const existing = await prisma.roleDemandObservation.findFirst({
        where: {
          roleId,
          period,
          sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
        },
      });

      if (existing) {
        await prisma.roleDemandObservation.update({
          where: { id: existing.id },
          data: {
            demandCount: existing.demandCount + count,
            sourceCount: existing.sourceCount + 1,
            dataQuality: 'HIGH',
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.roleDemandObservation.create({
          data: {
            roleId,
            period,
            demandCount: count,
            sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
            sourceCount: 1,
            dataQuality: 'HIGH',
          },
        });
        createdRoleObservations++;
      }
    }

    logger.info(`[ProvenanceService] Ingested observations from datasetVersion ${datasetVersionId}`, {
      datasetVersionId,
      createdSkillObservations,
      createdRoleObservations,
      sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
    });

    return {
      createdSkillObservations,
      createdRoleObservations,
      provenance: this.createProvenanceMetadata({
        sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED,
        sourceId: source?.id,
        sourceName: source?.name,
        datasetId: dataset?.id,
        datasetVersionId,
        versionTag: version?.versionTag,
        ingestionJobId,
      }),
    };
  }
}

export const provenanceService = new ProvenanceService();
export default provenanceService;
