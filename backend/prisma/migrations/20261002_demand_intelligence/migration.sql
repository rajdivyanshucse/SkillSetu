-- CreateTable: skill_demand_observations
CREATE TABLE IF NOT EXISTS "skill_demand_observations" (
    "id" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "roleId" UUID,
    "location" TEXT,
    "experienceLevel" TEXT,
    "period" TEXT NOT NULL,
    "demandCount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sourceType" TEXT NOT NULL DEFAULT 'SEEDED',
    "sourceCount" INTEGER NOT NULL DEFAULT 1,
    "dataQuality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_demand_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: role_demand_observations
CREATE TABLE IF NOT EXISTS "role_demand_observations" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "location" TEXT,
    "experienceLevel" TEXT,
    "period" TEXT NOT NULL,
    "demandCount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sourceType" TEXT NOT NULL DEFAULT 'SEEDED',
    "sourceCount" INTEGER NOT NULL DEFAULT 1,
    "dataQuality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_demand_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: demand_forecasts
CREATE TABLE IF NOT EXISTS "demand_forecasts" (
    "id" UUID NOT NULL,
    "skillId" UUID,
    "roleId" UUID,
    "forecastPeriod" TEXT NOT NULL,
    "predictedDemand" DOUBLE PRECISION NOT NULL,
    "lowerBound" DOUBLE PRECISION,
    "upperBound" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "confidenceLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "model" TEXT NOT NULL DEFAULT 'LINEAR_TREND',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demand_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: demand_trend_snapshots
CREATE TABLE IF NOT EXISTS "demand_trend_snapshots" (
    "id" UUID NOT NULL,
    "skillId" UUID,
    "roleId" UUID,
    "currentDemand" DOUBLE PRECISION NOT NULL,
    "previousDemand" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION NOT NULL,
    "trendCategory" TEXT NOT NULL,
    "volatility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidence" TEXT NOT NULL DEFAULT 'MEDIUM',
    "period" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demand_trend_snapshots_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "skill_demand_observations_skillId_idx" ON "skill_demand_observations"("skillId");
CREATE INDEX IF NOT EXISTS "skill_demand_observations_roleId_idx" ON "skill_demand_observations"("roleId");
CREATE INDEX IF NOT EXISTS "skill_demand_observations_period_idx" ON "skill_demand_observations"("period");
CREATE INDEX IF NOT EXISTS "skill_demand_observations_skillId_period_idx" ON "skill_demand_observations"("skillId", "period");
CREATE INDEX IF NOT EXISTS "skill_demand_observations_sourceType_idx" ON "skill_demand_observations"("sourceType");

CREATE INDEX IF NOT EXISTS "role_demand_observations_roleId_idx" ON "role_demand_observations"("roleId");
CREATE INDEX IF NOT EXISTS "role_demand_observations_period_idx" ON "role_demand_observations"("period");
CREATE INDEX IF NOT EXISTS "role_demand_observations_roleId_period_idx" ON "role_demand_observations"("roleId", "period");
CREATE INDEX IF NOT EXISTS "role_demand_observations_sourceType_idx" ON "role_demand_observations"("sourceType");

CREATE INDEX IF NOT EXISTS "demand_forecasts_skillId_idx" ON "demand_forecasts"("skillId");
CREATE INDEX IF NOT EXISTS "demand_forecasts_roleId_idx" ON "demand_forecasts"("roleId");
CREATE INDEX IF NOT EXISTS "demand_forecasts_forecastPeriod_idx" ON "demand_forecasts"("forecastPeriod");
CREATE INDEX IF NOT EXISTS "demand_forecasts_skillId_forecastPeriod_idx" ON "demand_forecasts"("skillId", "forecastPeriod");
CREATE INDEX IF NOT EXISTS "demand_forecasts_roleId_forecastPeriod_idx" ON "demand_forecasts"("roleId", "forecastPeriod");

CREATE INDEX IF NOT EXISTS "demand_trend_snapshots_skillId_idx" ON "demand_trend_snapshots"("skillId");
CREATE INDEX IF NOT EXISTS "demand_trend_snapshots_roleId_idx" ON "demand_trend_snapshots"("roleId");
CREATE INDEX IF NOT EXISTS "demand_trend_snapshots_period_idx" ON "demand_trend_snapshots"("period");
CREATE INDEX IF NOT EXISTS "demand_trend_snapshots_trendCategory_idx" ON "demand_trend_snapshots"("trendCategory");

-- Foreign Keys
ALTER TABLE "skill_demand_observations" ADD CONSTRAINT "skill_demand_observations_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_demand_observations" ADD CONSTRAINT "skill_demand_observations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "role_demand_observations" ADD CONSTRAINT "role_demand_observations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "demand_forecasts" ADD CONSTRAINT "demand_forecasts_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "demand_forecasts" ADD CONSTRAINT "demand_forecasts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "demand_trend_snapshots" ADD CONSTRAINT "demand_trend_snapshots_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "demand_trend_snapshots" ADD CONSTRAINT "demand_trend_snapshots_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
