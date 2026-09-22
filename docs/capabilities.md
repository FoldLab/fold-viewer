# Capabilities and limits

| Fold Spec content                   | V0.1 behavior                                        |
| ----------------------------------- | ---------------------------------------------------- |
| `planned`                           | Metadata/text state; no canvas claim                 |
| `instructions`                      | Localized text-only lesson                           |
| `partial`                           | Resolved prefix animates; later steps remain text    |
| `resolved`                          | Supported operations animate                         |
| Hinge operation                     | Rodrigues rotation around the authored directed axis |
| Rigid operation                     | Authored rotation, translation, and sinusoidal lift  |
| Sampled operation                   | Linear interpolation between authored keys           |
| `layerHint`                         | Conservative render priority                         |
| Full local `layers`                 | Geometry shown with an explicit limitation           |
| Required unknown playback extension | Animation disabled with a diagnostic                 |
| Text-required unknown extension     | Affected text should not be treated as supported     |
| `.foldlab` archive                  | Not accepted in V0.1                                 |
| Narration/assets/patterns           | Preserved by input but not presented                 |

The viewer validates structure and relevant references. It does not prove that
a model can be folded, that faces never collide, or that authored accessibility
guidance has been manually verified.
