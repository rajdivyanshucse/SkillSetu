import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import requestId from './middleware/requestId.js';
import requestLogger from './middleware/requestLogger.js';
import globalRateLimiter from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import v1Router from './routes/index.js';
import { checkHealth, checkReadiness } from './controllers/health.controller.js';
import { sendSuccess } from './utils/apiResponse.js';

// Initialize Express application
const app = express();

// 1. Correlation / Request ID Middleware
app.use(requestId);

// 2. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 3. CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      env.clientUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ];

    if (env.isDevelopment || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Request-Id', 'X-Correlation-Id'],
};
app.use(cors(corsOptions));

// 4. Request Logging & Metrics
app.use(requestLogger);

// 5. Rate Limiting (Applied globally)
app.use(globalRateLimiter);

// 6. Body & Cookie Parsing Middleware
app.use(express.json({ limit: env.bodySizeLimit }));
app.use(express.urlencoded({ extended: true, limit: env.bodySizeLimit }));
app.use(cookieParser());

// 7. Root Health & Readiness Probes
app.get('/health', checkHealth);
app.get('/ready', checkReadiness);

// 8. Base Root Info Endpoint
app.get('/', (req, res) => {
  return sendSuccess(res, {
    message: 'Welcome to SkillSetu API',
    data: {
      platform: 'SkillSetu — Intelligent Workforce & Career Intelligence Platform',
      version: '1.0.0',
      apiDocs: `${env.apiPrefix}/health`,
    },
  });
});

// 9. Mount Versioned API Routes (/api/v1)
app.use(env.apiPrefix, v1Router);

// 10. 404 Route Not Found Handler
app.use(notFound);

// 11. Centralized Error Handler
app.use(errorHandler);

export default app;
