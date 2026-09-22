import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getStepDuration, sampleDocument, sampleOperation } from './geometry';
import { parseFoldDocument } from './validation';

const document = parseFoldDocument(
  readFileSync(
    join(process.cwd(), 'tests/fixtures/valid/hinge.fold.json'),
    'utf8',
  ),
);

describe('geometry sampling', () => {
  it('uses exact start positions at operation progress zero', () => {
    const operation = document.geometry!.operations[0];
    const mesh = document.geometry!.meshes[0];
    expect([...sampleOperation(operation, mesh, 0)]).toEqual(
      operation.kind === 'sampled'
        ? operation.keys[0].positionsMm.flat()
        : operation.startPositionsMm.flat(),
    );
  });

  it('rotates only vertices incident to moving hinge faces', () => {
    const operation = document.geometry!.operations[0];
    const mesh = document.geometry!.meshes[0];
    if (operation.kind !== 'hinge')
      throw new Error('Fixture operation changed');
    const start = sampleOperation(operation, mesh, 0);
    const end = sampleOperation(operation, mesh, 1);
    const fixed = new Set(
      mesh.faces
        .filter((face) => !operation.movingFaces.includes(face.id))
        .flatMap((face) => face.vertices),
    );
    const moving = new Set(
      mesh.faces
        .filter((face) => operation.movingFaces.includes(face.id))
        .flatMap((face) => face.vertices),
    );
    expect(
      [...moving].some(
        (index) => Math.abs(end[index * 3] - start[index * 3]) > 1,
      ),
    ).toBe(true);
    for (const index of [...fixed].filter((value) => !moving.has(value))) {
      expect([...end.slice(index * 3, index * 3 + 3)]).toEqual([
        ...start.slice(index * 3, index * 3 + 3),
      ]);
    }
  });

  it('samples prior exact boundaries when entering the next step', () => {
    const end = sampleDocument(document, 1, 1)[0];
    const next = sampleDocument(document, 2, 0)[0];
    expect([...next.positions]).toEqual([...end.positions]);
  });

  it('weights step time by authored operation duration and run range', () => {
    expect(getStepDuration(document, 1)).toBe(
      document.geometry!.operations[0].durationMs,
    );
  });
});
