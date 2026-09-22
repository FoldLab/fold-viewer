import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FoldViewer, type FoldViewerSource } from '@foldlab/fold-viewer';
import './site.css';

function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4 4h24L17 17l-2 11-4-9-7-4Z" />
      <path d="m4 4 11 15 13-15M11 19l6-2" />
    </svg>
  );
}

function App() {
  const source = useMemo<FoldViewerSource>(
    () => ({
      kind: 'url',
      url: `${import.meta.env.BASE_URL}examples/crane.fold.json`,
    }),
    [],
  );
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <header className="site-header">
        <a href={import.meta.env.BASE_URL} className="brand">
          <Mark />
          <span>Fold Viewer</span>
          <span className="version">v0.1</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#viewer">Demo</a>
          <a href="https://github.com/FoldLab/fold-viewer#readme">Docs</a>
          <a href="https://github.com/FoldLab/fold-viewer">GitHub</a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">Open source · React + Three.js</span>
            <h1>
              Origami instructions,
              <br />
              <em>ready to embed.</em>
            </h1>
            <p>
              A flexible viewer for machine-readable Fold Spec lessons.
              Accessible text, authored motion, and a UI that adapts to your
              product.
            </p>
            <div className="hero-actions">
              <a href="#viewer" className="primary">
                Try the viewer
              </a>
              <code>npm i @foldlab/fold-viewer</code>
            </div>
          </div>
          <div className="principles">
            <span>Deterministic playback</span>
            <span>Host-owned styling</span>
            <span>Text stays first-class</span>
          </div>
        </section>
        <section
          className="viewer-section"
          id="viewer"
          aria-labelledby="viewer-title"
        >
          <div className="section-heading">
            <div>
              <span className="kicker">Interactive example</span>
              <h2 id="viewer-title">A complete crane lesson</h2>
            </div>
            <p>
              {loaded
                ? 'Loaded from a validated Fold Spec document.'
                : 'Loading the example document…'}
            </p>
          </div>
          <FoldViewer
            source={source}
            height="min(72vh, 680px)"
            defaultStepId="s39"
            onLoad={() => setLoaded(true)}
          />
        </section>
        <section className="install-section">
          <div>
            <span className="kicker">Small surface, strong foundation</span>
            <h2>Use the preset. Or compose your own.</h2>
            <p>
              The package includes one production-ready viewer and the same
              primitives it uses internally.
            </p>
          </div>
          <pre>
            <code>{`import { FoldViewer } from '@foldlab/fold-viewer';
import '@foldlab/fold-viewer/styles.css';

<FoldViewer
  source={{ kind: 'url', url: '/crane.fold.json' }}
  height={560}
  theme={{ accent: '#5b5bd6' }}
/>`}</code>
          </pre>
        </section>
        <section className="feature-grid" aria-label="Package features">
          <article>
            <strong>Exact motion</strong>
            <p>
              Samples authored hinge, rigid, and keyframed operations without
              adding undocumented easing.
            </p>
          </article>
          <article>
            <strong>Accessible by design</strong>
            <p>
              Keyboard controls, localized text, reduced-motion behavior, and
              readable fallback states.
            </p>
          </article>
          <article>
            <strong>Built to belong</strong>
            <p>
              Container-responsive layout, CSS variables, compound components,
              and no runtime design-system dependency.
            </p>
          </article>
        </section>
      </main>
      <footer>
        <span>FoldLab</span>
        <span>MIT licensed · Built for Fold Spec 1.0.0-draft.1</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
