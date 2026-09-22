# shadcn registry

The registry contains editable compositions for both current shadcn bases:

- `fold-viewer-base` uses the Base UI component contracts.
- `fold-viewer-radix` uses the Radix UI component contracts.

Both install the rendering engine from `@foldlab/fold-viewer` and compose its
provider, viewport, instructions, and state hook using source-owned shadcn
controls. They intentionally remain separate because slider and toggle-group
controlled-value APIs differ between the bases.

During local development, build this repository and use the generated registry
JSON through the shadcn CLI. The permanent raw GitHub install URL will be added
only after the public repository is verified.
