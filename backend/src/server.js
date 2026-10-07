import http from 'node:http';
import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import prisma from './config/db.js';

// Create HTTP server instance
const server = http.createServer(app);

// Start HTTP Server
server.listen(env.port, () => {
  const line = '═'.repeat(60);
  logger.info(`SkillSetu API Server Started Successfully on port ${env.port}`, {
    environment: env.nodeEnv,
    port: env.port,
    apiPrefix: env.apiPrefix,
    clientUrl: env.clientUrl,
  });
  console.log(`\n${line}`);
  console.log(`  🚀 SkillSetu API Server Started Successfully`);
  console.log(`${line}`);
  console.log(`  • Environment : ${env.nodeEnv}`);
  console.log(`  • Local URL   : http://localhost:${env.port}`);
  console.log(`  • API Prefix  : ${env.apiPrefix}`);
  console.log(`  • Health Check: http://localhost:${env.port}${env.apiPrefix}/health`);
  console.log(`  • Client URL  : ${env.clientUrl}`);
  console.log(`${line}\n`);
});

// Graceful Shutdown Handler
let isShuttingDown = false;

export const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.warn(`[Server] Received ${signal}. Starting graceful shutdown...`, { signal });
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  // Force close timeout if cleanup hangs
  const forceTimer = setTimeout(() => {
    logger.error('[Server] Forceful shutdown initiated due to timeout');
    console.error('[Server] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
  forceTimer.unref();

  server.close(async () => {
    logger.info('[Server] HTTP connection listener closed.');
    try {
      if (prisma?.$disconnect) {
        await prisma.$disconnect();
        logger.info('[Server] PostgreSQL connection closed.');
      }
    } catch (dbErr) {
      logger.error(`[Server] Error closing database connection: ${dbErr.message}`);
    }

    clearTimeout(forceTimer);
    logger.info('[Server] Graceful shutdown completed cleanly.');
    process.exit(0);
  });
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejections & uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.error('[Unhandled Rejection]', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : null,
  });
  console.error('[Unhandled Rejection at]:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error(`[Uncaught Exception] ${error.message}`, {
    stack: error.stack,
  });
  console.error('[Uncaught Exception]:', error);
  // Exit cleanly after logging critical unrecoverable exception
  process.exit(1);
});

export default server;
