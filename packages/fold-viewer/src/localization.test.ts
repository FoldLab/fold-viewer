import { describe, expect, it } from 'vitest';
import { localize } from './localization';

describe('localization', () => {
  it('falls back through requested subtags before the document default', () => {
    expect(localize({ pt: 'Olá', en: 'Hello' }, 'pt-BR', 'en')).toBe('Olá');
    expect(localize({ en: 'Hello' }, 'fr-CA', 'en')).toBe('Hello');
  });
});
