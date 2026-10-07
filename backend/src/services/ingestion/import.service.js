import crypto from 'node:crypto';
import logger from '../../utils/logger.js';
import { ValidationError } from '../../utils/errors.js';

export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class ImportService {
  /**
   * Parses an input buffer or string based on the format (JSON or CSV).
   * @param {Buffer|string} content - Raw file content
   * @param {string} format - 'JSON' or 'CSV'
   * @returns {Object} { records: Array, fileHash: string, recordCount: number }
   */
  async parseContent(content, format = 'JSON') {
    if (!content) {
      throw new ValidationError('File content cannot be empty');
    }

    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8');

    if (buffer.length > MAX_IMPORT_FILE_SIZE) {
      throw new ValidationError(`File size (${Math.round(buffer.length / 1024)}KB) exceeds 5MB limit`);
    }

    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const text = buffer.toString('utf-8').trim();

    if (!text) {
      throw new ValidationError('File content is empty');
    }

    const normFormat = (format || 'JSON').toUpperCase();

    let records = [];
    if (normFormat === 'JSON') {
      records = this._parseJson(text);
    } else if (normFormat === 'CSV') {
      records = this._parseCsv(text);
    } else {
      throw new ValidationError(`Unsupported import format: "${format}". Supported formats are JSON, CSV`);
    }

    if (!Array.isArray(records) || records.length === 0) {
      throw new ValidationError('Parsed file contains zero valid records');
    }

    return {
      records,
      fileHash,
      recordCount: records.length,
    };
  }

  /**
   * Safely parses JSON array or newline-delimited JSON.
   */
  _parseJson(text) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        // If it's a wrapper object like { data: [...] } or { jobs: [...] }
        if (Array.isArray(parsed.data)) return parsed.data;
        if (Array.isArray(parsed.jobs)) return parsed.jobs;
        if (Array.isArray(parsed.records)) return parsed.records;
        return [parsed];
      }
      throw new ValidationError('JSON root must be an array or object containing records');
    } catch (err) {
      if (err instanceof ValidationError) throw err;

      // Try newline-delimited JSON
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const records = [];
      for (let i = 0; i < lines.length; i++) {
        try {
          const item = JSON.parse(lines[i]);
          if (typeof item === 'object' && item !== null) records.push(item);
        } catch {
          throw new ValidationError(`Malformed JSON at line ${i + 1}: ${err.message}`);
        }
      }
      if (records.length > 0) return records;

      throw new ValidationError(`Malformed JSON content: ${err.message}`);
    }
  }

  /**
   * Safely parses CSV content with header mapping and quoted field handling (RFC 4180 compliant).
   */
  _parseCsv(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let quoteChar = null;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === quoteChar) {
          if (nextChar === quoteChar) {
            currentField += quoteChar;
            i++; // skip escaped quote
          } else {
            inQuotes = false;
            quoteChar = null;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"' || char === "'") {
          inQuotes = true;
          quoteChar = char;
        } else if (char === ',') {
          currentRow.push(currentField);
          currentField = '';
        } else if (char === '\r') {
          if (nextChar === '\n') i++;
          currentRow.push(currentField);
          if (currentRow.some((f) => f.trim().length > 0)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        } else if (char === '\n') {
          currentRow.push(currentField);
          if (currentRow.some((f) => f.trim().length > 0)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
    }

    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
    }

    if (rows.length < 2) {
      throw new ValidationError('CSV must contain a header row and at least one data row');
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const records = [];

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      const record = {};
      headers.forEach((header, idx) => {
        let val = values[idx] !== undefined ? values[idx].trim() : '';

        // Handle skills list in CSV if comma or pipe separated
        if (['skills', 'requiredskills', 'skillset'].includes(header) && val) {
          record.skills = val.split(/[;|]/).map((s) => s.trim()).filter(Boolean);
        } else {
          record[header] = val;
        }
      });

      records.push(record);
    }

    return records;
  }
}

export const importService = new ImportService();
export default importService;
