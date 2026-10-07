import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: Number.parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT & Auth Configuration
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'skillsetu_jwt_access_fallback_secret_key_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'skillsetu_jwt_refresh_fallback_secret_key_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Token Expirations (Minutes)
  emailVerificationExpiresMinutes: Number.parseInt(process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES || '1440', 10),
  passwordResetExpiresMinutes: Number.parseInt(process.env.PASSWORD_RESET_EXPIRES_MINUTES || '60', 10),
  authCookieSecure: process.env.AUTH_COOKIE_SECURE === 'true',

  // Rate Limiting
  rateLimit: {
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  authRateLimit: {
    windowMs: Number.parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: Number.parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
  },
  bodySizeLimit: process.env.BODY_SIZE_LIMIT || '1mb',

  // AI Service Configuration (FastAPI)
  aiService: {
    url: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001',
    apiKey: process.env.AI_SERVICE_API_KEY || 'sk-skillsetu-ai-dev-secret-key',
    timeoutMs: Number.parseInt(process.env.AI_TIMEOUT_MS || '5000', 10),
  },

  // Semantic & Embedding Configuration (Phase 34)
  embedding: {
    mode: process.env.EMBEDDING_MODE || 'MULTILINGUAL',
    model: process.env.EMBEDDING_MODEL || 'paraphrase-multilingual-MiniLM-L12-v2',
    englishModel: 'all-MiniLM-L6-v2',
    multilingualModel: 'paraphrase-multilingual-MiniLM-L12-v2',
    dimension: Number.parseInt(process.env.EMBEDDING_DIMENSION || '384', 10),
    supportedLanguages: ['en', 'hi', 'de', 'fr', 'es', 'pa'],
    testedLanguages: ['en', 'hi', 'de', 'fr', 'es'],
  },
};

// Runtime validation
if (Number.isNaN(env.port)) {
  console.warn('[Config] Invalid PORT specified in environment. Defaulting to 5000.');
  env.port = 5000;
}

// Production configuration integrity assertion
if (env.isProduction) {
  const missingCritical = [];
  if (!process.env.DATABASE_URL) missingCritical.push('DATABASE_URL');
  if (!process.env.JWT_ACCESS_SECRET) missingCritical.push('JWT_ACCESS_SECRET');
  if (!process.env.JWT_REFRESH_SECRET) missingCritical.push('JWT_REFRESH_SECRET');

  if (missingCritical.length > 0) {
    console.error(`[Config CRITICAL] Missing required environment variables in production: ${missingCritical.join(', ')}`);
  }
}

export default env;
