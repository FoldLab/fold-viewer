import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFoldDocument, validateFoldDocument } from './validation';

const fixture = (path: string) =>
  readFileSync(join(process.cwd(), 'tests/fixtures', path), 'utf8');

describe('strict Fold Spec input', () => {
  it('accepts the pinned resolved fixture', () => {
    const document = parseFoldDocument(fixture('valid/hinge.fold.json'));
    expect(document.id).toBe('hinge-demo');
    expect(document.specVersion).toBe('1.0.0-draft.1');
  });

  it('rejects duplicate members before schema validation', () => {
    expect(() =>
      parseFoldDocument(fixture('invalid/duplicate-member.fold.json')),
    ).toThrow(/Duplicate object member/);
  });

  it('rejects non-finite numeric input', () => {
    expect(() =>
      parseFoldDocument(fixture('invalid/nonfinite-number.fold.json')),
    ).toThrow(/finite/);
  });

  it('rejects incompatible document objects', () => {
    const document = JSON.parse(fixture('valid/hinge.fold.json'));
    document.geometry.operations[0].mesh = 'missing';
    expect(() => validateFoldDocument(document)).toThrow(/incompatible mesh/);
  });
});
