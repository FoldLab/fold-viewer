import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FoldViewer } from './FoldViewer';
import { parseFoldDocument } from './validation';

const document = parseFoldDocument(
  readFileSync(
    join(process.cwd(), 'tests/fixtures/valid/hinge.fold.json'),
    'utf8',
  ),
);

describe('FoldViewer', () => {
  it('loads an object source and keeps text synchronized with step controls', async () => {
    const onStepChange = vi.fn();
    render(
      <FoldViewer
        source={{ kind: 'document', document }}
        viewMode="text"
        onStepChange={onStepChange}
      />,
    );
    expect(
      await screen.findByRole('heading', {
        name: 'Place the square',
        level: 3,
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {
          name: 'Match the left and right edges',
          level: 3,
        }),
      ).toBeInTheDocument(),
    );
    expect(onStepChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'fold-center' }),
      1,
    );
  });

  it('exposes reduced-motion and tactile preferences', async () => {
    render(
      <FoldViewer source={{ kind: 'document', document }} viewMode="text" />,
    );
    await screen.findByRole('heading', { name: 'Place the square', level: 3 });
    fireEvent.click(screen.getByLabelText('Viewer settings'));
    fireEvent.click(screen.getByLabelText('Show tactile details'));
    expect(screen.getByText(/Four edges form a square/)).toBeInTheDocument();
  });
});
