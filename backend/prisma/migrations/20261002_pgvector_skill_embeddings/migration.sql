-- PostgreSQL pgvector Migration for SkillSetu Semantic Intelligence (Phase 24)

-- 1. Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create skill_embeddings storage table
CREATE TABLE IF NOT EXISTS "skill_embeddings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skillId" UUID NOT NULL,
    "model" VARCHAR(100) NOT NULL DEFAULT 'all-MiniLM-L6-v2',
    "dimension" INTEGER NOT NULL DEFAULT 384,
    "embedding" vector(384),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_embeddings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "skill_embeddings_skillId_model_key" UNIQUE ("skillId", "model"),
    CONSTRAINT "skill_embeddings_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Create indices on foreign keys and model identifiers
CREATE INDEX IF NOT EXISTS "skill_embeddings_skillId_idx" ON "skill_embeddings"("skillId");
CREATE INDEX IF NOT EXISTS "skill_embeddings_model_idx" ON "skill_embeddings"("model");

-- 4. Vector index decision:
-- For the standard skill taxonomy (< 10,000 skills), exact cosine distance (<=>) provides sub-millisecond query latency with 100% recall.
-- When taxonomy exceeds 10,000 skills, the following HNSW index may be activated:
-- CREATE INDEX IF NOT EXISTS "skill_embeddings_embedding_cosine_idx" ON "skill_embeddings" USING hnsw ("embedding" vector_cosine_ops);
