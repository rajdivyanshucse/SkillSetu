import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export class QualityService {
  /**
   * Evaluates quality metrics for a dataset version and generates a DataQualityReport.
   */
  async evaluateDatasetQuality(datasetVersionId, evaluationContext = {}) {
    const version = await prisma.datasetVersion.findUnique({
      where: { id: datasetVersionId },
    });

    if (!version) {
      throw new Error(`Dataset version not found with ID: ${datasetVersionId}`);
    }

    const records = await prisma.ingestionRecord.findMany({
      where: { datasetVersionId },
    });

    const quarantined = await prisma.quarantinedRecord.findMany({
      where: { datasetVersionId },
    });

    const taxonomyMappings = await prisma.externalTaxonomyMapping.findMany({
      where: { datasetVersionId },
    });

    const totalRecords = records.length > 0 ? records.length + quarantined.length : taxonomyMappings.length + quarantined.length;

    if (totalRecords === 0) {
      const emptyReport = await prisma.dataQualityReport.create({
        data: {
          datasetVersionId,
          overallScore: 0.0,
          completenessScore: 0.0,
          validityScore: 0.0,
          consistencyScore: 0.0,
          uniquenessScore: 1.0,
          normalizationCoverage: 0.0,
          provenanceCompleteness: 0.5,
          freshnessScore: 1.0,
          totalRecords: 0,
          validRecords: 0,
          rejectedRecords: 0,
          duplicateRecords: 0,
          quarantinedRecords: 0,
          warningCount: 0,
          errorCount: 0,
          fieldMetrics: {},
          issuesSummary: { message: 'Dataset version has no records.' },
        },
      });
      return emptyReport;
    }

    // Special handling for official taxonomy dataset packages (O*NET / ESCO)
    if (records.length === 0 && taxonomyMappings.length > 0) {
      const validCount = taxonomyMappings.length;
      const errorCount = quarantined.length;
      const validityScore = Math.round((validCount / totalRecords) * 100) / 100;
      const completenessScore = 1.0;
      const consistencyScore = 1.0;
      const uniquenessScore = 1.0;
      const normalizationCoverage = 1.0;
      const provenanceCompleteness = 1.0;
      const freshnessScore = 0.95;

      const overallScore = Math.round(
        (validityScore * 0.35 +
          completenessScore * 0.20 +
          consistencyScore * 0.15 +
          uniquenessScore * 0.10 +
          normalizationCoverage * 0.10 +
          provenanceCompleteness * 0.10) *
          100
      ) / 100;

      const report = await prisma.dataQualityReport.create({
        data: {
          datasetVersionId,
          overallScore,
          completenessScore,
          validityScore,
          consistencyScore,
          uniquenessScore,
          normalizationCoverage,
          provenanceCompleteness,
          freshnessScore,
          totalRecords,
          validRecords: validCount,
          rejectedRecords: quarantined.length,
          duplicateRecords: 0,
          quarantinedRecords: quarantined.length,
          warningCount: 0,
          errorCount,
          fieldMetrics: {
            taxonomyMappingsCount: taxonomyMappings.length,
            quarantinedCount: quarantined.length,
          },
          issuesSummary: {
            quarantinedIssues: quarantined.map((q) => ({ reason: q.reason, externalId: q.externalId })),
          },
        },
      });

      await prisma.datasetVersion.update({
        where: { id: datasetVersionId },
        data: {
          qualityScore: overallScore,
          validRecordCount: validCount,
          rejectedRecordCount: quarantined.length,
          duplicateCount: 0,
          quarantinedCount: quarantined.length,
        },
      });

      logger.info(`[QualityService] Evaluated quality for taxonomy datasetVersion ${datasetVersionId}: score ${overallScore}`, {
        datasetVersionId,
        overallScore,
        validRecords: validCount,
        quarantined: quarantined.length,
      });

      return report;
    }

    let validCount = 0;
    let duplicateCount = 0;
    let errorCount = quarantined.length;
    let warningCount = 0;

    let totalCompletenessPoints = 0;
    let totalConsistencyPoints = 0;
    let totalNormalizationPoints = 0;

    const fieldCompleteness = {
      title: 0,
      skills: 0,
      organization: 0,
      location: 0,
      experience: 0,
      compensation: 0,
      date: 0,
    };

    records.forEach((rec) => {
      if (rec.validationStatus === 'VALID') validCount++;
      if (rec.validationStatus === 'DUPLICATE' || rec.duplicateOf) duplicateCount++;

      const raw = rec.rawData || {};
      const norm = rec.normalizedData || {};

      // Check field presence
      if (raw.title || raw.role || raw.jobTitle) fieldCompleteness.title++;
      if (raw.skills?.length || raw.requiredSkills?.length) fieldCompleteness.skills++;
      if (raw.organization || raw.company) fieldCompleteness.organization++;
      if (raw.location || raw.workLocation) fieldCompleteness.location++;
      if (raw.experience || raw.experienceRequired) fieldCompleteness.experience++;
      if (raw.salary || raw.compensation || raw.ctc) fieldCompleteness.compensation++;
      if (raw.postedDate || raw.date || raw.createdAt) fieldCompleteness.date++;

      // Completeness per record (out of 7 core fields)
      let recordFields = 0;
      if (raw.title || raw.role) recordFields++;
      if (raw.skills?.length) recordFields++;
      if (raw.organization) recordFields++;
      if (raw.location) recordFields++;
      if (raw.experience) recordFields++;
      if (raw.salary) recordFields++;
      if (raw.postedDate || raw.date) recordFields++;
      totalCompletenessPoints += recordFields / 7;

      // Consistency: check if valid bounds were preserved
      let recordConsistency = 1.0;
      if (norm.experience?.isStructured && norm.experience.minYears > norm.experience.maxYears) {
        recordConsistency -= 0.5;
      }
      if (norm.compensation?.isNumeric && norm.compensation.minSalary > norm.compensation.maxSalary) {
        recordConsistency -= 0.5;
      }
      totalConsistencyPoints += Math.max(0, recordConsistency);

      // Normalization coverage: role matched and skill percentage resolved
      let normScore = 0;
      if (norm.role?.status === 'NORMALIZED') normScore += 0.5;
      if (norm.skillCoverage !== undefined) normScore += norm.skillCoverage * 0.5;
      totalNormalizationPoints += normScore;
    });

    const completenessScore = Math.round((totalCompletenessPoints / (records.length || 1)) * 100) / 100;
    const validityScore = Math.round((validCount / totalRecords) * 100) / 100;
    const consistencyScore = Math.round((totalConsistencyPoints / (records.length || 1)) * 100) / 100;
    const uniquenessScore = Math.round(((totalRecords - duplicateCount) / totalRecords) * 100) / 100;
    const normalizationCoverage = Math.round((totalNormalizationPoints / (records.length || 1)) * 100) / 100;

    // Provenance completeness check
    let provenanceScore = 0.5;
    if (version.schemaVersion) provenanceScore += 0.1;
    if (version.format) provenanceScore += 0.1;
    if (version.fileHash) provenanceScore += 0.1;
    if (version.versionTag) provenanceScore += 0.2;
    const provenanceCompleteness = Math.min(1.0, provenanceScore);

    const freshnessScore = 0.95; // Deterministic standard default for current import batches

    // Deterministic overall quality formula
    const overallScore = Math.round(
      (completenessScore * 0.20 +
        validityScore * 0.25 +
        consistencyScore * 0.15 +
        uniquenessScore * 0.15 +
        normalizationCoverage * 0.15 +
        provenanceCompleteness * 0.10) *
        100
    ) / 100;

    const report = await prisma.dataQualityReport.create({
      data: {
        datasetVersionId,
        overallScore,
        completenessScore,
        validityScore,
        consistencyScore,
        uniquenessScore,
        normalizationCoverage,
        provenanceCompleteness,
        freshnessScore,
        totalRecords,
        validRecords: validCount,
        rejectedRecords: quarantined.length,
        duplicateRecords: duplicateCount,
        quarantinedRecords: quarantined.length,
        warningCount,
        errorCount,
        fieldMetrics: {
          titleCompleteness: Math.round((fieldCompleteness.title / (records.length || 1)) * 100),
          skillsCompleteness: Math.round((fieldCompleteness.skills / (records.length || 1)) * 100),
          organizationCompleteness: Math.round((fieldCompleteness.organization / (records.length || 1)) * 100),
          locationCompleteness: Math.round((fieldCompleteness.location / (records.length || 1)) * 100),
          experienceCompleteness: Math.round((fieldCompleteness.experience / (records.length || 1)) * 100),
          compensationCompleteness: Math.round((fieldCompleteness.compensation / (records.length || 1)) * 100),
          dateCompleteness: Math.round((fieldCompleteness.date / (records.length || 1)) * 100),
        },
        issuesSummary: {
          quarantinedIssues: quarantined.map((q) => ({ reason: q.reason, externalId: q.externalId })),
          duplicateCount,
        },
      },
    });

    // Update quality score in datasetVersion
    await prisma.datasetVersion.update({
      where: { id: datasetVersionId },
      data: {
        qualityScore: overallScore,
        validRecordCount: validCount,
        rejectedRecordCount: quarantined.length,
        duplicateCount,
        quarantinedCount: quarantined.length,
      },
    });

    logger.info(`[QualityService] Evaluated quality for datasetVersion ${datasetVersionId}: score ${overallScore}`, {
      datasetVersionId,
      overallScore,
      validRecords: validCount,
      quarantined: quarantined.length,
    });

    return report;
  }
}

export const qualityService = new QualityService();
export default qualityService;
