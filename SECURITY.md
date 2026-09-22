# Security policy

Please report suspected vulnerabilities privately through GitHub Security
Advisories for `FoldLab/fold-viewer`. Do not include secrets or private lesson
files in a public issue.

The viewer treats input as untrusted. V0.1 limits JSON to 32 MiB, rejects
invalid UTF-8, BOMs, duplicate members, excessive nesting, non-finite numbers,
schema failures, and incompatible semantic references. It fetches only the URL
explicitly passed as the viewer source and never follows asset or metadata URLs.

Only the current minor release receives security fixes while the project is
pre-1.0. This policy will be revisited before a stable release.
