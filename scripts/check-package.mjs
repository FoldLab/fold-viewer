import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import { gzipSync } from 'node:zlib';

const workspace = new URL('..', import.meta.url).pathname;
const packageDirectory = join(workspace, 'packages/fold-viewer');
const temporary = mkdtempSync(join(tmpdir(), 'fold-viewer-pack-'));

try {
  const result = JSON.parse(
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
  const archive = join(temporary, result.filename);
  const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' })
    .trim()
    .split('\n');
  const safe = entries.every((entry) => {
    if (
      !entry.startsWith('package/') ||
      entry.includes('..') ||
      entry.startsWith('/') ||
      entry.includes('\\')
    )
      return false;
    return /^package\/(?:package\.json|README\.md|LICENSE|dist\/(?:index\.js(?:\.map)?|styles\.css|[A-Za-z][A-Za-z0-9./-]*\.d\.ts))$/.test(
      entry,
    );
  });
  if (!safe)
    throw new Error(
      `Package contains an unsafe or unlisted path:\n${entries.join('\n')}`,
    );

  const js = readFileSync(join(packageDirectory, 'dist/index.js'));
  const css = readFileSync(join(packageDirectory, 'dist/styles.css'));
  const jsGzip = gzipSync(js).byteLength;
  const cssGzip = gzipSync(css).byteLength;
  if (jsGzip > 200 * 1024)
    throw new Error(`JavaScript budget exceeded: ${jsGzip} gzip bytes`);
  if (cssGzip > 20 * 1024)
    throw new Error(`CSS budget exceeded: ${cssGzip} gzip bytes`);
  process.stdout.write(
    `Package allowlist passed (${entries.length} files; JS ${jsGzip} B gzip; CSS ${cssGzip} B gzip).\n`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
