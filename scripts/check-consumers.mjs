import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

const workspace = new URL('..', import.meta.url).pathname;
const packageDirectory = join(workspace, 'packages/fold-viewer');
const temporary = mkdtempSync(join(tmpdir(), 'fold-viewer-consumers-'));

try {
  const packed = JSON.parse(
    execFileSync(
      'npm',
      [
        'pack',
        packageDirectory,
        '--pack-destination',
        temporary,
        '--json',
        '--ignore-scripts',
      ],
      { encoding: 'utf8' },
    ),
  )[0];
  const archive = join(temporary, packed.filename);

  for (const reactVersion of ['18.3.1', '19.1.1']) {
    const consumer = join(temporary, `react-${reactVersion}`);
    mkdirSync(consumer);
    writeFileSync(
      join(consumer, 'package.json'),
      JSON.stringify({
        name: `fold-viewer-react-${reactVersion}`,
        private: true,
        type: 'module',
      }),
    );
    execFileSync(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        archive,
        `react@${reactVersion}`,
        `react-dom@${reactVersion}`,
        'three@0.180.0',
      ],
      { cwd: consumer, stdio: 'pipe' },
    );
    execFileSync(
      'node',
      [
        '--input-type=module',
        '--eval',
        "const api = await import('@foldlab/fold-viewer'); if (!api.FoldViewer || !api.FoldViewerProvider || !api.parseFoldDocument) process.exit(1);",
      ],
      { cwd: consumer, stdio: 'pipe' },
    );
    process.stdout.write(`React ${reactVersion} tarball import passed.\n`);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
