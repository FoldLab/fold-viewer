# Fold Viewer

A composable React viewer for machine-readable origami lessons written in
[Fold Spec](https://github.com/FoldLab/fold-spec).

Fold Viewer turns authored geometry and instructions into an embeddable,
accessible learning surface. It preserves the document's operation order,
material sides, localized text, and explicit capability limits while leaving
layout and branding under the host application's control.

> **Project status:** `0.1.0` is an initial implementation for Fold Spec
> `1.0.0-draft.1`. The package and public API are pre-1.0 and may change.

## Install

```bash
npm install @foldlab/fold-viewer react react-dom three
```

The scoped package has not been claimed on npm yet. Until the first verified
release, use this workspace or a Git dependency; do not assume the name already
resolves from the public registry.

## Quick start

```tsx
import { FoldViewer } from '@foldlab/fold-viewer';
import '@foldlab/fold-viewer/styles.css';

export function Lesson() {
  return (
    <FoldViewer
      source={{ kind: 'url', url: '/lessons/crane.fold.json' }}
      height={560}
      theme={{ accent: '#5b5bd6', radius: '18px' }}
      onStepChange={(step) => console.log(step.id)}
    />
  );
}
```

Sources may be a validated in-memory document, a browser `File`/`Blob`, or an
explicit URL. URL metadata inside a document is never fetched automatically.
The default CSS is optional: import it for the ready-made design, replace it,
or compose the primitives into your own design system.

## Composable API

```tsx
import {
  FoldViewerProvider,
  FoldViewport,
  FoldInstructions,
  FoldControls,
} from '@foldlab/fold-viewer';

<FoldViewerProvider source={source}>
  <FoldViewport />
  <aside>
    <FoldInstructions />
  </aside>
  <FoldControls />
</FoldViewerProvider>;
```

`useFoldViewer()` exposes the current snapshot and actions. The step and
playing state support controlled and uncontrolled use. `FoldViewer` also
accepts a ref implementing `FoldViewerHandle` for integrations that need an
imperative play, pause, seek, step, or reset action.

## Customization

- Set any CSS-compatible `width` and `height` on `FoldViewer`.
- Override `theme` tokens or the `--fold-*` CSS custom properties.
- Pass normal `className`, `style`, and DOM attributes to the root.
- Use the provider and compound components to own the entire layout.
- Install an editable shadcn composition from [`registry/`](registry/README.md).

The component responds to its container rather than only the viewport, so it
can live in cards, split panes, dialogs, and full-page experiences.

## V0.1 capability boundary

The viewer supports strict JSON input for exactly `1.0.0-draft.1`, localized
text, authored cameras, multiple sheets, front/back colors, and deterministic
hinge, rigid, and linear sampled operations. Step runs use authored physical
duration for progress weighting. Partial documents animate only their resolved
prefix; planned or instruction-only content stays text-first.

V0.1 intentionally does not implement `.foldlab` archives, external assets,
textures and patterns, narration, full local layer resolution, decorative final
presentation, print output, authoring source compilation, collision simulation,
or a symbolic fold solver. See [ROADMAP.md](ROADMAP.md) and
[docs/capabilities.md](docs/capabilities.md).

Structural checks and automated accessibility checks are not claims of physical
foldability, assistive-technology certification, or conformance beyond the
explicitly tested behavior.

## Development

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
npm run check
npm run test:e2e
```

The schema and selected fixtures are snapshots of `FoldLab/fold-spec` commit
`f3fdeae`. Their hashes and update procedure are recorded in
[`tests/fixtures/PROVENANCE.md`](tests/fixtures/PROVENANCE.md).

## Project docs

- [Architecture](docs/architecture.md)
- [Capabilities and limitations](docs/capabilities.md)
- [Customization](docs/customization.md)
- [Roadmap](ROADMAP.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

MIT licensed.
