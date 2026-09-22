# Roadmap

Fold Viewer's vision is to make Fold Spec lessons easy to embed in any React
product while preserving deterministic motion, accessible instructions, and
the host application's control over layout and branding.

This roadmap records direction, not delivery dates. Each feature must remain
within the matching Fold Spec contract and ship with fixtures and tests.

## 0.1 — Foundation

- React preset and provider/viewport/instructions/controls primitives.
- Strict, bounded JSON loading from document objects, `File`/`Blob`, and
  explicit URLs.
- Fold Spec `1.0.0-draft.1` schema plus viewer semantic validation.
- Deterministic hinge, rigid, and sampled operation playback.
- Duration-weighted runs, seeking, reverse ranges, and remeshing boundaries.
- Multiple sheets, authored cameras, and distinct front/back colors.
- Text fallback for planned, instructions-only, unresolved, unsupported, and
  WebGL-unavailable states.
- Playback, step, speed, mode, reset, contrast, background, motion, and tactile
  controls.
- Container-responsive default UI, theme tokens, keyboard interaction, and
  reduced-motion/forced-colors support.
- Demo application, package checks, and editable Base UI/Radix UI shadcn
  compositions.

## 0.2 — Packages and assets

- Safe `.foldlab` archive loading with path normalization, entry allowlists,
  size limits, and hash verification.
- Bundled paper/background assets and explicit remote-resource opt-in.
- Bounded image and audio decoding.
- Drag-and-drop input and richer loading diagnostics.
- Worker-backed parsing, validation, and geometry preparation.

## 0.3 — Rendering depth

- Authored patterns, textures, and paper appearance.
- Persistent crease rendering with material-space mapping.
- Full local layer-relation resolution instead of conservative `layerHint`
  rendering.
- Explicit X-ray and outline modes.
- Paper rims, improved lighting, shadows, and thumbnail rendering.
- Performance budgets and renderer caching for large lessons.

## 0.4 — Presentation and media

- Static final-display guidance and optional authored flourishes.
- Presentation rigs and stage/background composition.
- Authored paper-response effects that do not alter canonical geometry.
- Narration playback with independent timing and transcripts.
- Opt-in remote media policy and application-supplied asset resolvers.
- Locale selection and broader translation UX.

## 0.5 — Output and ecosystem

- Print/PDF diagrams and deterministic static captures.
- Template, scene, and library document support.
- Documented extension registration and capability negotiation.
- Visual regression snapshots and reusable conformance harnesses.
- A Web Component wrapper and framework-neutral rendering core.

## 1.0 — Stable contract

- Stable public API and compatibility policy.
- Complete declared Fold Spec viewer conformance for the supported version.
- Interoperability testing with independent producers.
- Published browser/device support matrix based on real test evidence.
- Manual review with representative assistive technologies, documented without
  turning review into an accessibility certification claim.

## Explicit non-goals

- Accepting arbitrary final meshes in place of missing authored motion.
- A complete symbolic origami solver.
- Collision, force, material, or physical-foldability certification.
- Automatic conversion of every historical origami format.
- Claiming accessibility certification from automated checks.
