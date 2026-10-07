import env from '../config/env.js';

// Keys that must be sanitized from any log metadata
const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'password_hash',
  'token',
  'accesstoken',
  'refreshtoken',
  'refreshtokenhash',
  'authorization',
  'x-ai-service-key',
  'apikey',
  'secret',
  'jwtsecret',
  'resumetext',
  'rawtext',
  'jobdescription',
  'embedding',
  'embeddings',
  'vector',
]);

/**
 * Recursively sanitizes sensitive fields in log payloads.
 */
export const sanitizeLogData = (data, depth = 0) => {
  if (depth > 5 || data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item, depth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
};

const currentLogLevelNumber = () => {
  const levelStr = (process.env.LOG_LEVEL || (env.isDevelopment ? 'DEBUG' : 'INFO')).toUpperCase();
  return LOG_LEVELS[levelStr] || LOG_LEVELS.INFO;
};

/**
 * Structured Application Logger
 */
class Logger {
  constructor() {
    this.service = 'skillsetu-backend';
    this.environment = env.nodeEnv;
  }

  _formatLog(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: this.environment,
      message,
      ...(meta && typeof meta === 'object' ? sanitizeLogData(meta) : { meta }),
    };
  }

  _write(level, message, meta) {
    const logObj = this._formatLog(level, message, meta);
    const jsonStr = JSON.stringify(logObj);

    if (level === 'ERROR') {
      console.error(jsonStr);
    } else if (level === 'WARN') {
      console.warn(jsonStr);
    } else {
      console.log(jsonStr);
    }
  }

  debug(message, meta = {}) {
    if (currentLogLevelNumber() <= LOG_LEVELS.DEBUG) {
      this._write('DEBUG', message, meta);
    }
  }

  info(message, meta = {}) {
    if (currentLogLevelNumber() <= LOG_LEVELS.INFO) {
      this._write('INFO', message, meta);
    }
  }

  warn(message, meta = {}) {
    if (currentLogLevelNumber() <= LOG_LEVELS.WARN) {
      this._write('WARN', message, meta);
    }
  }

  error(message, meta = {}) {
    if (currentLogLevelNumber() <= LOG_LEVELS.ERROR) {
      this._write('ERROR', message, meta);
    }
  }

  audit(action, meta = {}) {
    this._write('INFO', `[AUDIT] ${action}`, {
      isAudit: true,
      action,
      ...meta,
    });
  }
}

export const logger = new Logger();
export default logger;
