# Architecture

The package separates input, canonical geometry, rendering, and React UI so
each layer can evolve without making the others host-framework specific.

1. The loader applies byte limits, fatal UTF-8 decoding, duplicate-member and
   depth checks, the versioned JSON Schema, and semantic references.
2. The external store owns selected step, progress, playback, view mode, and
   preferences. React subscribes through `useSyncExternalStore`.
3. The geometry sampler keeps canonical coordinates in `Float64Array` values
   and computes operation results directly from authored start/key positions.
4. The Three.js adapter expands indexed faces into non-indexed triangles for
   flat normals and uploads `Float32` buffers. A double-sided shader selects
   front/back appearance using `gl_FrontFacing`.
5. React components provide layout, instructions, controls, fallback states,
   and host integration. Three.js updates occur outside React reconciliation.

Rendering is invalidation-driven: it runs for geometry, camera, preference,
resize, or inspection changes, not as a permanent frame loop. Every WebGL
resource and event listener is disposed when the viewport changes or unmounts.

`layerHint` is applied conservatively along its authored axis. Full local
`layers` relations remain unsupported and are never described as resolved.
