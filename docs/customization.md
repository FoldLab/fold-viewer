# Customization

The ready-made viewer is deliberately a preset, not a mandatory product shell.

## Size and theme

`width` and `height` accept normal React CSS values. Theme props map to CSS
custom properties: `accent`, `background`, `panel`, `foreground`, `muted`, and
`radius`. For broader changes, target the documented `.fold-*` class names or
omit the default stylesheet.

## Composition

Wrap custom UI in `FoldViewerProvider`, then place `FoldViewport`,
`FoldInstructions`, `FoldControls`, and `FoldSettings` where they belong. Use
`useFoldViewer` when native controls need to be replaced by a host design
system. The two registry examples demonstrate this with shadcn Base UI and
Radix UI components.

## Controlled state

Provide `stepId` and/or `playing` with their callbacks when an application owns
those values. Leave them undefined to use internal state. Playback rate, view
mode, locale, and preferences can be supplied as initial integration policy.

Model colors, viewer theme colors, and future print overrides are separate
concepts; changing the UI accent never mutates the document's paper appearance.
