-- CreateTable: recommendations
CREATE TABLE IF NOT EXISTS "recommendations" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "organizationId" UUID,
    "type" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "confidence" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dataQuality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "recommendedAction" TEXT,
    "evidence" JSONB,
    "sourceSignals" JSONB,
    "dismissReason" TEXT,
    "dismissNotes" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: recommendation_feedback
CREATE TABLE IF NOT EXISTS "recommendation_feedback" (
    "id" UUID NOT NULL,
    "recommendationId" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_feedback_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "recommendations_userId_idx" ON "recommendations"("userId");
CREATE INDEX IF NOT EXISTS "recommendations_organizationId_idx" ON "recommendations"("organizationId");
CREATE INDEX IF NOT EXISTS "recommendations_type_idx" ON "recommendations"("type");
CREATE INDEX IF NOT EXISTS "recommendations_status_idx" ON "recommendations"("status");
CREATE INDEX IF NOT EXISTS "recommendations_priority_idx" ON "recommendations"("priority");
CREATE INDEX IF NOT EXISTS "recommendations_generatedAt_idx" ON "recommendations"("generatedAt");

CREATE INDEX IF NOT EXISTS "recommendation_feedback_recommendationId_idx" ON "recommendation_feedback"("recommendationId");
CREATE INDEX IF NOT EXISTS "recommendation_feedback_userId_idx" ON "recommendation_feedback"("userId");
CREATE INDEX IF NOT EXISTS "recommendation_feedback_action_idx" ON "recommendation_feedback"("action");

-- Foreign Keys
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recommendation_feedback" ADD CONSTRAINT "recommendation_feedback_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
