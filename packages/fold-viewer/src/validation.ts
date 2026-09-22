import Ajv2020, { type ErrorObject } from 'ajv/dist/2020.js';
import documentSchema from './schema/document.schema.json';
import type { FoldDocument, FoldViewerError } from './types';

export const MAX_DOCUMENT_BYTES = 32 * 1024 * 1024;
export const MAX_JSON_DEPTH = 64;

export class FoldDocumentError extends Error implements FoldViewerError {
  code: string;
  path?: string;

  constructor(code: string, message: string, path?: string) {
    super(message);
    this.name = 'FoldDocumentError';
    this.code = code;
    this.path = path;
  }
}

class StrictJsonParser {
  private index = 0;

  constructor(private readonly source: string) {}

  parse(): unknown {
    this.space();
    const value = this.value(0);
    this.space();
    if (this.index !== this.source.length)
      this.fail('Unexpected trailing content');
    return value;
  }

  private value(depth: number): unknown {
    if (depth > MAX_JSON_DEPTH)
      this.fail(`JSON nesting exceeds ${MAX_JSON_DEPTH}`);
    this.space();
    const char = this.source[this.index];
    if (
      this.source.startsWith('NaN', this.index) ||
      this.source.startsWith('Infinity', this.index) ||
      this.source.startsWith('-Infinity', this.index)
    ) {
      this.fail('Numbers must be finite');
    }
    if (char === '{') return this.object(depth + 1);
    if (char === '[') return this.array(depth + 1);
    if (char === '"') return this.string();
    if (char === '-' || (char >= '0' && char <= '9')) return this.number();
    if (this.source.startsWith('true', this.index))
      return this.literal('true', true);
    if (this.source.startsWith('false', this.index))
      return this.literal('false', false);
    if (this.source.startsWith('null', this.index))
      return this.literal('null', null);
    this.fail('Expected a JSON value');
  }

  private object(depth: number): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const keys = new Set<string>();
    this.index++;
    this.space();
    if (this.source[this.index] === '}') {
      this.index++;
      return result;
    }
    while (true) {
      if (this.source[this.index] !== '"')
        this.fail('Expected an object member name');
      const key = this.string();
      if (keys.has(key))
        this.fail(`Duplicate object member ${JSON.stringify(key)}`);
      keys.add(key);
      this.space();
      if (this.source[this.index++] !== ':')
        this.fail('Expected : after object member name');
      result[key] = this.value(depth);
      this.space();
      const next = this.source[this.index++];
      if (next === '}') return result;
      if (next !== ',') this.fail('Expected , or } in object');
      this.space();
    }
  }

  private array(depth: number): unknown[] {
    const result: unknown[] = [];
    this.index++;
    this.space();
    if (this.source[this.index] === ']') {
      this.index++;
      return result;
    }
    while (true) {
      result.push(this.value(depth));
      this.space();
      const next = this.source[this.index++];
      if (next === ']') return result;
      if (next !== ',') this.fail('Expected , or ] in array');
      this.space();
    }
  }

  private string(): string {
    const start = this.index++;
    while (this.index < this.source.length) {
      const char = this.source[this.index++];
      if (char === '"') {
        try {
          return JSON.parse(this.source.slice(start, this.index)) as string;
        } catch {
          this.fail('Invalid string escape');
        }
      }
      if (char === '\\') this.index++;
      else if (char.charCodeAt(0) < 0x20)
        this.fail('Unescaped control character in string');
    }
    this.fail('Unterminated string');
  }

  private number(): number {
    const rest = this.source.slice(this.index);
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(rest);
    if (!match) this.fail('Invalid number');
    this.index += match[0].length;
    const value = Number(match[0]);
    if (!Number.isFinite(value)) this.fail('Numbers must be finite');
    return value;
  }

  private literal<T>(token: string, value: T): T {
    this.index += token.length;
    return value;
  }
  private space(): void {
    while (/\s/.test(this.source[this.index] ?? '')) this.index++;
  }
  private fail(message: string): never {
    throw new FoldDocumentError(
      'invalid-json',
      `${message} at character ${this.index}`,
    );
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateSchema = ajv.compile<FoldDocument>(documentSchema);

function schemaMessage(
  errors: ErrorObject[] | null | undefined,
): FoldDocumentError {
  const first = errors?.[0];
  return new FoldDocumentError(
    'schema-validation',
    first
      ? `${first.instancePath || '/'} ${first.message ?? 'is invalid'}`
      : 'Document does not match the Fold Spec schema',
    first?.instancePath || '/',
  );
}

function ensureObjectBounds(
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): void {
  if (depth > MAX_JSON_DEPTH)
    throw new FoldDocumentError(
      'depth-limit',
      `Document nesting exceeds ${MAX_JSON_DEPTH}`,
    );
  if (typeof value === 'number' && !Number.isFinite(value))
    throw new FoldDocumentError(
      'non-finite-number',
      'Document contains a non-finite number',
    );
  if (!value || typeof value !== 'object') return;
  if (seen.has(value))
    throw new FoldDocumentError(
      'cyclic-document',
      'Document objects must not contain cycles',
    );
  seen.add(value);
  for (const child of Array.isArray(value) ? value : Object.values(value))
    ensureObjectBounds(child, depth + 1, seen);
  seen.delete(value);
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value))
      throw new FoldDocumentError(
        'duplicate-id',
        `Duplicate ${label} ID ${JSON.stringify(value)}`,
      );
    seen.add(value);
  }
}

export function validateFoldDocument(value: unknown): FoldDocument {
  ensureObjectBounds(value);
  if (!validateSchema(value)) throw schemaMessage(validateSchema.errors);
  const document = value as FoldDocument;
  assertUnique(
    document.sheets.map((item) => item.id),
    'sheet',
  );
  assertUnique(
    document.instructions.steps.map((item) => item.id),
    'step',
  );
  const localeCandidates = [document.defaultLocale];
  if (
    !localeCandidates.every(
      (locale) => document.metadata.title[locale] !== undefined,
    )
  ) {
    throw new FoldDocumentError(
      'missing-default-locale',
      'metadata.title must contain the document defaultLocale',
    );
  }
  if (document.geometry) {
    assertUnique(
      document.geometry.meshes.map((item) => item.id),
      'mesh',
    );
    assertUnique(
      document.geometry.operations.map((item) => item.id),
      'operation',
    );
    const sheets = new Set(document.sheets.map((item) => item.id));
    const meshes = new Map(
      document.geometry.meshes.map((item) => [item.id, item]),
    );
    const operations = new Map(
      document.geometry.operations.map((item) => [item.id, item]),
    );
    for (const mesh of meshes.values()) {
      if (!sheets.has(mesh.sheet))
        throw new FoldDocumentError(
          'missing-sheet',
          `Mesh ${mesh.id} references unknown sheet ${mesh.sheet}`,
        );
      for (const face of mesh.faces)
        for (const index of face.vertices) {
          if (index >= mesh.vertices.length)
            throw new FoldDocumentError(
              'invalid-face',
              `Face ${face.id} references missing vertex ${index}`,
            );
        }
    }
    for (const operation of operations.values()) {
      const mesh = meshes.get(operation.mesh);
      if (!mesh || mesh.sheet !== operation.sheet)
        throw new FoldDocumentError(
          'missing-mesh',
          `Operation ${operation.id} references an incompatible mesh`,
        );
      const counts =
        operation.kind === 'sampled'
          ? operation.keys.map((key) => key.positionsMm.length)
          : [operation.startPositionsMm.length];
      if (counts.some((count) => count !== mesh.vertices.length))
        throw new FoldDocumentError(
          'position-count',
          `Operation ${operation.id} position count does not match its mesh`,
        );
    }
    for (const step of document.instructions.steps)
      for (const run of step.runs) {
        if (!operations.has(run.operation))
          throw new FoldDocumentError(
            'missing-operation',
            `Step ${step.id} references unknown operation ${run.operation}`,
          );
      }
  }
  return document;
}

export function parseFoldDocument(text: string): FoldDocument {
  if (text.charCodeAt(0) === 0xfeff)
    throw new FoldDocumentError('bom-not-allowed', 'UTF-8 BOM is not allowed');
  return validateFoldDocument(new StrictJsonParser(text).parse());
}

export async function loadFoldDocument(
  source: import('./types').FoldViewerSource,
  signal?: AbortSignal,
): Promise<FoldDocument> {
  if (source.kind === 'document') return validateFoldDocument(source.document);
  let bytes: ArrayBuffer;
  if (source.kind === 'file') {
    if (source.file.size > MAX_DOCUMENT_BYTES)
      throw new FoldDocumentError(
        'size-limit',
        'Document exceeds the 32 MiB limit',
      );
    bytes = await source.file.arrayBuffer();
  } else {
    const response = await fetch(source.url, {
      ...source.fetchOptions,
      signal,
    });
    if (!response.ok)
      throw new FoldDocumentError(
        'fetch-failed',
        `Could not load document (${response.status})`,
      );
    const length = Number(response.headers.get('content-length'));
    if (Number.isFinite(length) && length > MAX_DOCUMENT_BYTES)
      throw new FoldDocumentError(
        'size-limit',
        'Document exceeds the 32 MiB limit',
      );
    bytes = await response.arrayBuffer();
  }
  if (bytes.byteLength > MAX_DOCUMENT_BYTES)
    throw new FoldDocumentError(
      'size-limit',
      'Document exceeds the 32 MiB limit',
    );
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new FoldDocumentError('invalid-utf8', 'Document is not valid UTF-8');
  }
  return parseFoldDocument(text);
}

export function toViewerError(error: unknown): FoldViewerError {
  if (error instanceof FoldDocumentError)
    return { code: error.code, message: error.message, path: error.path };
  return {
    code: 'unknown',
    message:
      error instanceof Error ? error.message : 'An unknown error occurred',
  };
}
