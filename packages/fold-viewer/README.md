# @foldlab/fold-viewer

Composable React components for viewing `fold-spec` `1.0.0-draft.1` documents.

```bash
npm install @foldlab/fold-viewer react react-dom three
```

```tsx
import { FoldViewer } from '@foldlab/fold-viewer';
import '@foldlab/fold-viewer/styles.css';

export function Lesson() {
  return (
    <FoldViewer
      source={{ kind: 'url', url: '/lessons/crane.fold.json' }}
      height={560}
    />
  );
}
```

The package also exports provider, viewport, instruction, control, and settings
primitives for applications that need to own the viewer layout. The default
stylesheet is optional and can be themed with CSS custom properties.

See the [repository README](https://github.com/FoldLab/fold-viewer#readme) for
installation, examples, capability boundaries, and customization guidance.
