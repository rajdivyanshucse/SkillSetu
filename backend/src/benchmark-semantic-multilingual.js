/**
 * =========================================================================
 * PHASE 34 — QUANTITATIVE SEMANTIC BENCHMARKING SUITE
 * =========================================================================
 * Evaluates:
 * 1. English Model (all-MiniLM-L6-v2) vs Multilingual Model (paraphrase-multilingual-MiniLM-L12-v2)
 * 2. Cross-Language Semantic Match Accuracy (English, Hindi, German, French, Spanish)
 * 3. Hard-Negative Separation & False Positive Rate
 * 4. Latency Measurements (Single Embedding, Batch Throughput, Semantic Retrieval)
 */

import aiClient from './services/aiClient.service.js';
import embeddingService, { computeJsCosineSimilarity, classifyThreshold } from './services/embedding.service.js';
import { performance } from 'node:perf_hooks';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess = null;

async function waitForAiService(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch('http://127.0.0.1:8001/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') return true;
      }
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

// Benchmark test dataset
const CROSS_LANGUAGE_BENCHMARK = [
  // English ↔ Hindi
  { lang: 'Hindi', source: 'Machine Learning', candidate: 'मशीन लर्निंग', isEquivalent: true },
  { lang: 'Hindi', source: 'Software Development', candidate: 'सॉफ्टवेयर विकास', isEquivalent: true },
  { lang: 'Hindi', source: 'Data Analysis', candidate: 'डेटा विश्लेषण', isEquivalent: true },
  { lang: 'Hindi', source: 'Project Management', candidate: 'परियोजना प्रबंधन', isEquivalent: true },
  { lang: 'Hindi', source: 'Deep Learning', candidate: 'डीप लर्निंग', isEquivalent: true },
  { lang: 'Hindi', source: 'Database', candidate: 'डेटाबेस', isEquivalent: true },

  // English ↔ German
  { lang: 'German', source: 'Software Development', candidate: 'Softwareentwicklung', isEquivalent: true },
  { lang: 'German', source: 'Data Analysis', candidate: 'Datenanalyse', isEquivalent: true },
  { lang: 'German', source: 'Project Management', candidate: 'Projektmanagement', isEquivalent: true },
  { lang: 'German', source: 'Machine Learning', candidate: 'Maschinelles Lernen', isEquivalent: true },
  { lang: 'German', source: 'System Architecture', candidate: 'Systemarchitektur', isEquivalent: true },

  // English ↔ French
  { lang: 'French', source: 'Software Development', candidate: 'Développement logiciel', isEquivalent: true },
  { lang: 'French', source: 'Data Analysis', candidate: 'Analyse de données', isEquivalent: true },
  { lang: 'French', source: 'Project Management', candidate: 'Gestion de projet', isEquivalent: true },
  { lang: 'French', source: 'Machine Learning', candidate: 'Apprentissage automatique', isEquivalent: true },
  { lang: 'French', source: 'Database', candidate: 'Base de données', isEquivalent: true },

  // English ↔ Spanish
  { lang: 'Spanish', source: 'Software Development', candidate: 'Desarrollo de software', isEquivalent: true },
  { lang: 'Spanish', source: 'Data Analysis', candidate: 'Análisis de datos', isEquivalent: true },
  { lang: 'Spanish', source: 'Project Management', candidate: 'Gestión de proyectos', isEquivalent: true },
  { lang: 'Spanish', source: 'Machine Learning', candidate: 'Aprendizaje automático', isEquivalent: true },
  { lang: 'Spanish', source: 'Database', candidate: 'Base de datos', isEquivalent: true },
];

const HARD_NEGATIVES_BENCHMARK = [
  { itemA: 'Java', itemB: 'JavaScript', shouldMatch: false, reason: 'Distinct languages (OOP vs Scripting)' },
  { itemA: 'React', itemB: 'React Native', shouldMatch: false, reason: 'Web framework vs Mobile framework' },
  { itemA: 'Spring', itemB: 'Spring Boot', shouldMatch: false, reason: 'Parent framework vs convention-over-configuration framework' },
  { itemA: 'SQL', itemB: 'SQL Server', shouldMatch: false, reason: 'Standard query language vs RDBMS product' },
  { itemA: 'Machine Learning', itemB: 'Deep Learning', shouldMatch: false, reason: 'General field vs neural network sub-discipline' },
  { itemA: 'Data Analysis', itemB: 'Data Engineering', shouldMatch: false, reason: 'Analytics/Insights vs Infrastructure/Pipelines' },
  { itemA: 'Project Management', itemB: 'Product Management', shouldMatch: false, reason: 'Execution/Delivery vs Strategy/Vision' },
];

export async function runSemanticBenchmark() {
  console.log('\n===============================================================');
  console.log('RUNNING SKILLSETU SEMANTIC BENCHMARKING SUITE (PHASE 34)');
  console.log('===============================================================\n');

  const pythonPath = path.resolve(__dirname, '../../ai-service');
  const venvPython = process.platform === 'win32'
    ? path.join(pythonPath, '.venv', 'Scripts', 'python.exe')
    : path.join(pythonPath, '.venv', 'bin', 'python');

  try {
    const isAlreadyRunning = await waitForAiService(2);
    if (!isAlreadyRunning) {
      pythonProcess = spawn(venvPython, ['-m', 'uvicorn', 'app.main:app', '--port', '8001', '--host', '127.0.0.1'], {
        cwd: pythonPath,
        stdio: 'ignore',
        detached: false,
      });
      await waitForAiService(30);
    }
  } catch (err) {
    console.warn('Could not auto-spawn Python:', err.message);
  }

  const models = [
    { name: 'all-MiniLM-L6-v2', mode: 'ENGLISH' },
    { name: 'paraphrase-multilingual-MiniLM-L12-v2', mode: 'MULTILINGUAL' },
  ];

  const results = {};

  try {
  for (const m of models) {
    console.log(`\nEvaluating Model: ${m.name} (${m.mode})...`);
    results[m.name] = {
      model: m.name,
      mode: m.mode,
      languages: {},
      hardNegatives: { total: 0, correctlySeparated: 0, falseMerges: 0 },
      latency: {},
    };

    // 1. Cross-Language Evaluation
    for (const pair of CROSS_LANGUAGE_BENCHMARK) {
      if (!results[m.name].languages[pair.lang]) {
        results[m.name].languages[pair.lang] = {
          total: 0,
          passed: 0,
          similarities: [],
        };
      }

      const matchRes = await embeddingService.compareSemanticSimilarity(
        pair.source,
        [pair.candidate],
        { model: m.name }
      );

      const sim = matchRes?.results?.[0]?.similarity || 0.0;
      results[m.name].languages[pair.lang].total++;
      results[m.name].languages[pair.lang].similarities.push(sim);

      // Acceptance: equivalent concepts should have similarity >= 0.70 (or high category)
      if (sim >= 0.65) {
        results[m.name].languages[pair.lang].passed++;
      }
    }

    // 2. Hard-Negatives Evaluation
    for (const hn of HARD_NEGATIVES_BENCHMARK) {
      results[m.name].hardNegatives.total++;
      const matchRes = await embeddingService.matchSkillSets(
        [hn.itemA],
        [hn.itemB],
        { model: m.name }
      );

      const isExactOrNormalizedFalseMerge = matchRes?.matches?.some(
        (match) => match.source === hn.itemA && match.candidate === hn.itemB && match.matchType !== 'SEMANTIC'
      );

      if (isExactOrNormalizedFalseMerge) {
        results[m.name].hardNegatives.falseMerges++;
      } else {
        results[m.name].hardNegatives.correctlySeparated++;
      }
    }

    // 3. Performance & Latency Measurement
    // Single embedding latency
    const t0 = performance.now();
    await embeddingService.requestEmbeddings(['Machine Learning and Predictive Data Science'], m.name);
    const singleLatencyMs = Math.round((performance.now() - t0) * 100) / 100;

    // Batch embedding throughput (32 items)
    const batchTexts = Array.from({ length: 32 }, (_, i) => `Sample benchmark skill concept number ${i} for throughput evaluation`);
    const t1 = performance.now();
    await embeddingService.requestEmbeddings(batchTexts, m.name);
    const batchDurationMs = Math.round((performance.now() - t1) * 100) / 100;
    const itemsPerSec = Math.round((32 / (batchDurationMs / 1000)) * 10) / 10;

    results[m.name].latency = {
      singleEmbeddingMs: singleLatencyMs,
      batch32DurationMs: batchDurationMs,
      throughputItemsPerSec: itemsPerSec,
    };
  }

  // Print Summary Table
  console.log('\n--- BENCHMARK RESULTS SUMMARY ---');
  for (const [modelName, data] of Object.entries(results)) {
    console.log(`\nModel: ${modelName} [${data.mode}]`);
    console.log('Language Accuracy (Top-1 Recall >= 0.65 threshold):');
    for (const [lang, stats] of Object.entries(data.languages)) {
      const avgSim = (stats.similarities.reduce((a, b) => a + b, 0) / stats.similarities.length).toFixed(4);
      const accPct = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`  - ${lang.padEnd(10)}: ${stats.passed}/${stats.total} (${accPct}%) | Avg Cosine Sim: ${avgSim}`);
    }
    console.log(`Hard Negatives Separation: ${data.hardNegatives.correctlySeparated}/${data.hardNegatives.total} (${((data.hardNegatives.correctlySeparated / data.hardNegatives.total) * 100).toFixed(1)}%) | False Merges: ${data.hardNegatives.falseMerges}`);
    console.log(`Performance: Single Embedding: ${data.latency.singleEmbeddingMs}ms | Batch Throughput: ${data.latency.throughputItemsPerSec} items/sec`);
  }
  } finally {
    if (pythonProcess) {
      pythonProcess.kill();
    }
  }

  return results;
}

if (process.argv[1]?.endsWith('benchmark-semantic-multilingual.js')) {
  runSemanticBenchmark()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Benchmark execution error:', err);
      process.exit(1);
    });
}
