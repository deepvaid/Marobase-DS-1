import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { baselineRelativePath, caseFileName, loadManifest } from '../../scripts/visual/manifest';

type ComparisonResult = {
  id: string;
  component: string;
  baseline: string;
  capture: string;
  diff: string;
  diffPercent: number;
  status: 'PASS' | 'FAIL';
  reason?: string;
};

const rootDir = path.resolve(process.cwd());
const baselineDir = path.join(rootDir, 'artifacts/figma-baselines');
const captureDir = path.join(rootDir, 'artifacts/storybook-captures');
const diffDir = path.join(rootDir, 'artifacts/visual-diffs');
const reportMd = path.join(rootDir, 'artifacts/visual-diff-report.md');
const reportJson = path.join(rootDir, 'artifacts/visual-diff-report.json');

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parsePng(buffer: Buffer): PNG {
  return PNG.sync.read(buffer);
}

async function main() {
  await mkdir(diffDir, { recursive: true });
  const manifest = await loadManifest(rootDir);
  const thresholdPercent = manifest.tolerancePercent ?? 0.5;

  const results: ComparisonResult[] = [];

  for (const visualCase of manifest.cases) {
    const baselineFile = path.join(baselineDir, baselineRelativePath(visualCase));
    const captureFile = path.join(captureDir, caseFileName(visualCase));
    const diffFile = path.join(diffDir, caseFileName(visualCase));

    if (!(await exists(baselineFile))) {
      results.push({
        id: visualCase.id,
        component: visualCase.component,
        baseline: baselineFile,
        capture: captureFile,
        diff: diffFile,
        diffPercent: 100,
        status: 'FAIL',
        reason: 'Missing Figma baseline image'
      });
      continue;
    }

    if (!(await exists(captureFile))) {
      results.push({
        id: visualCase.id,
        component: visualCase.component,
        baseline: baselineFile,
        capture: captureFile,
        diff: diffFile,
        diffPercent: 100,
        status: 'FAIL',
        reason: 'Missing Storybook capture image'
      });
      continue;
    }

    const baseline = parsePng(await readFile(baselineFile));
    const capture = parsePng(await readFile(captureFile));

    if (baseline.width !== capture.width || baseline.height !== capture.height) {
      results.push({
        id: visualCase.id,
        component: visualCase.component,
        baseline: baselineFile,
        capture: captureFile,
        diff: diffFile,
        diffPercent: 100,
        status: 'FAIL',
        reason: `Image dimensions differ (baseline ${baseline.width}x${baseline.height}, capture ${capture.width}x${capture.height})`
      });
      continue;
    }

    const diffPng = new PNG({ width: baseline.width, height: baseline.height });
    const diffPixels = pixelmatch(
      baseline.data,
      capture.data,
      diffPng.data,
      baseline.width,
      baseline.height,
      { threshold: 0.1 }
    );

    const totalPixels = baseline.width * baseline.height;
    const diffPercent = (diffPixels / totalPixels) * 100;

    await writeFile(diffFile, PNG.sync.write(diffPng));

    results.push({
      id: visualCase.id,
      component: visualCase.component,
      baseline: baselineFile,
      capture: captureFile,
      diff: diffFile,
      diffPercent,
      status: diffPercent <= thresholdPercent ? 'PASS' : 'FAIL'
    });
  }

  const failed = results.filter((item) => item.status === 'FAIL');
  const passed = results.length - failed.length;

  const markdown = [
    '# Visual Diff Report',
    '',
    `- Total cases: **${results.length}**`,
    `- Passed: **${passed}**`,
    `- Failed: **${failed.length}**`,
    `- Threshold: **${thresholdPercent}%**`,
    '',
    '| Case ID | Component | Diff % | Status | Notes |',
    '| --- | --- | ---: | --- | --- |',
    ...results.map((item) => `| ${item.id} | ${item.component} | ${item.diffPercent.toFixed(4)} | ${item.status} | ${item.reason ?? ''} |`),
    ''
  ].join('\n');

  const jsonPayload = {
    generatedAt: new Date().toISOString(),
    thresholdPercent,
    total: results.length,
    passed,
    failed: failed.length,
    results
  };

  await writeFile(reportMd, markdown, 'utf8');
  await writeFile(reportJson, JSON.stringify(jsonPayload, null, 2), 'utf8');

  if (failed.length > 0) {
    console.error(`Visual parity failed: ${failed.length} / ${results.length} cases exceed ${thresholdPercent}% diff.`);
    process.exit(1);
  }

  console.log(`Visual parity passed: ${passed}/${results.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
