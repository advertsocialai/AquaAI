/**
 * Merges Vitest (frontend) + coverage.py (backend) coverage into a single
 * src/data/coverageReport.json that the /internal/coverage dashboard renders.
 *
 * Run after generating coverage:
 *   npx vitest run --coverage
 *   (cd backend && python3 -m pytest --cov=app.core.auth --cov=app.schemas.auth --cov-report=json)
 *   node scripts/collect-coverage.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const round = (n) => Math.round((n ?? 0) * 10) / 10;

function frontend() {
  const p = path.join(root, 'coverage/coverage-summary.json');
  if (!existsSync(p)) return null;
  const data = JSON.parse(readFileSync(p, 'utf8'));
  const t = data.total;
  const files = Object.entries(data)
    .filter(([f]) => f !== 'total' && f.includes('/src/') && !f.includes('/components/ui/') && !f.includes('/test/'))
    .map(([f, v]) => ({ name: f.split('/src/')[1], pct: round(v.statements.pct) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 30);
  return {
    name: 'Frontend', tool: 'Vitest + v8',
    totals: { statements: round(t.statements.pct), branches: round(t.branches.pct), functions: round(t.functions.pct), lines: round(t.lines.pct) },
    files,
  };
}

function backend() {
  const p = path.join(root, 'backend/coverage.json');
  if (!existsSync(p)) return null;
  const data = JSON.parse(readFileSync(p, 'utf8'));
  const t = data.totals;
  const files = Object.entries(data.files).map(([f, v]) => ({ name: f, pct: round(v.summary.percent_covered) }))
    .sort((a, b) => a.pct - b.pct);
  return {
    name: 'Backend', tool: 'pytest + coverage.py',
    totals: { statements: round(t.percent_covered), branches: round(t.percent_covered_display ?? t.percent_covered), functions: round(t.percent_covered), lines: round(t.percent_covered) },
    files,
  };
}

const report = { generatedAt: new Date().toISOString(), frameworks: [frontend(), backend()].filter(Boolean) };
writeFileSync(path.join(root, 'src/data/coverageReport.json'), JSON.stringify(report, null, 2) + '\n');
console.log('Wrote src/data/coverageReport.json —', report.frameworks.map((f) => `${f.name} ${f.totals.lines}%`).join(', '));
