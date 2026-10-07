-- CreateTable
CREATE TABLE "data_sources" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'JOB_POSTINGS',
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "license" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "datasets" (
    "id" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'JOB_POSTINGS',
    "description" TEXT,
    "currentVersionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataset_versions" (
    "id" UUID NOT NULL,
    "datasetId" UUID NOT NULL,
    "versionTag" TEXT NOT NULL,
    "effectiveStartDate" TIMESTAMP(3),
    "effectiveEndDate" TIMESTAMP(3),
    "schemaVersion" TEXT NOT NULL DEFAULT '1.0',
    "format" TEXT NOT NULL DEFAULT 'JSON',
    "fileHash" TEXT,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "validRecordCount" INTEGER NOT NULL DEFAULT 0,
    "rejectedRecordCount" INTEGER NOT NULL DEFAULT 0,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "quarantinedCount" INTEGER NOT NULL DEFAULT 0,
    "qualityScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataset_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_job_records" (
    "id" UUID NOT NULL,
    "datasetVersionId" UUID NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'QUEUED',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "processedCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "quarantinedCount" INTEGER NOT NULL DEFAULT 0,
    "errorLog" JSONB,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingestion_job_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_records" (
    "id" UUID NOT NULL,
    "datasetVersionId" UUID NOT NULL,
    "ingestionJobId" UUID,
    "externalId" TEXT,
    "recordFingerprint" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "normalizedData" JSONB,
    "validationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "normalizationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "qualityScore" DOUBLE PRECISION,
    "duplicateOf" TEXT,
    "duplicateReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingestion_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_reports" (
    "id" UUID NOT NULL,
    "datasetVersionId" UUID NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "completenessScore" DOUBLE PRECISION NOT NULL,
    "validityScore" DOUBLE PRECISION NOT NULL,
    "consistencyScore" DOUBLE PRECISION NOT NULL,
    "uniquenessScore" DOUBLE PRECISION NOT NULL,
    "normalizationCoverage" DOUBLE PRECISION NOT NULL,
    "provenanceCompleteness" DOUBLE PRECISION NOT NULL,
    "freshnessScore" DOUBLE PRECISION,
    "totalRecords" INTEGER NOT NULL,
    "validRecords" INTEGER NOT NULL,
    "rejectedRecords" INTEGER NOT NULL,
    "duplicateRecords" INTEGER NOT NULL,
    "quarantinedRecords" INTEGER NOT NULL,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "fieldMetrics" JSONB,
    "issuesSummary" JSONB,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_quality_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarantined_records" (
    "id" UUID NOT NULL,
    "datasetVersionId" UUID NOT NULL,
    "ingestionJobId" UUID,
    "externalId" TEXT,
    "reason" TEXT NOT NULL,
    "validationErrors" JSONB NOT NULL,
    "rawRecord" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUARANTINED',
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quarantined_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_sources_name_key" ON "data_sources"("name");
CREATE INDEX "data_sources_type_idx" ON "data_sources"("type");
CREATE INDEX "data_sources_status_idx" ON "data_sources"("status");

-- CreateIndex
CREATE UNIQUE INDEX "datasets_sourceId_name_key" ON "datasets"("sourceId", "name");
CREATE INDEX "datasets_sourceId_idx" ON "datasets"("sourceId");
CREATE INDEX "datasets_category_idx" ON "datasets"("category");

-- CreateIndex
CREATE UNIQUE INDEX "dataset_versions_datasetId_versionTag_key" ON "dataset_versions"("datasetId", "versionTag");
CREATE INDEX "dataset_versions_datasetId_idx" ON "dataset_versions"("datasetId");
CREATE INDEX "dataset_versions_status_idx" ON "dataset_versions"("status");

-- CreateIndex
CREATE INDEX "ingestion_job_records_datasetVersionId_idx" ON "ingestion_job_records"("datasetVersionId");
CREATE INDEX "ingestion_job_records_status_idx" ON "ingestion_job_records"("status");
CREATE INDEX "ingestion_job_records_stage_idx" ON "ingestion_job_records"("stage");

-- CreateIndex
CREATE INDEX "ingestion_records_datasetVersionId_idx" ON "ingestion_records"("datasetVersionId");
CREATE INDEX "ingestion_records_ingestionJobId_idx" ON "ingestion_records"("ingestionJobId");
CREATE INDEX "ingestion_records_recordFingerprint_idx" ON "ingestion_records"("recordFingerprint");
CREATE INDEX "ingestion_records_validationStatus_idx" ON "ingestion_records"("validationStatus");

-- CreateIndex
CREATE INDEX "data_quality_reports_datasetVersionId_idx" ON "data_quality_reports"("datasetVersionId");
CREATE INDEX "data_quality_reports_evaluatedAt_idx" ON "data_quality_reports"("evaluatedAt");

-- CreateIndex
CREATE INDEX "quarantined_records_datasetVersionId_idx" ON "quarantined_records"("datasetVersionId");
CREATE INDEX "quarantined_records_ingestionJobId_idx" ON "quarantined_records"("ingestionJobId");
CREATE INDEX "quarantined_records_status_idx" ON "quarantined_records"("status");
CREATE INDEX "quarantined_records_reason_idx" ON "quarantined_records"("reason");

-- AddForeignKey
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset_versions" ADD CONSTRAINT "dataset_versions_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "datasets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_job_records" ADD CONSTRAINT "ingestion_job_records_datasetVersionId_fkey" FOREIGN KEY ("datasetVersionId") REFERENCES "dataset_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_records" ADD CONSTRAINT "ingestion_records_datasetVersionId_fkey" FOREIGN KEY ("datasetVersionId") REFERENCES "dataset_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_records" ADD CONSTRAINT "ingestion_records_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_job_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_reports" ADD CONSTRAINT "data_quality_reports_datasetVersionId_fkey" FOREIGN KEY ("datasetVersionId") REFERENCES "dataset_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarantined_records" ADD CONSTRAINT "quarantined_records_datasetVersionId_fkey" FOREIGN KEY ("datasetVersionId") REFERENCES "dataset_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarantined_records" ADD CONSTRAINT "quarantined_records_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_job_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
