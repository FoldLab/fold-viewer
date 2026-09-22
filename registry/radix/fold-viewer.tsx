'use client';

import type { CSSProperties } from 'react';
import {
  FoldInstructions,
  FoldViewerProvider,
  FoldViewport,
  useFoldViewer,
  type FoldViewerSource,
} from '@foldlab/fold-viewer';
import '@foldlab/fold-viewer/styles.css';
import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function FoldViewer({
  source,
  className,
  height = 560,
}: {
  source: FoldViewerSource;
  className?: string;
  height?: CSSProperties['height'];
}) {
  return (
    <FoldViewerProvider source={source}>
      <div className={className} style={{ height }}>
        <div className="relative h-[calc(100%-4rem)] overflow-hidden rounded-t-xl border bg-muted/30">
          <FoldViewport />
          <FoldInstructions className="max-w-sm" />
        </div>
        <ViewerControls />
      </div>
    </FoldViewerProvider>
  );
}

function ViewerControls() {
  const viewer = useFoldViewer();
  const count = viewer.document?.instructions.steps.length ?? 0;
  return (
    <div className="flex h-16 items-center gap-2 rounded-b-xl border border-t-0 bg-background p-3">
      <Button
        variant="outline"
        size="icon"
        onClick={viewer.previous}
        disabled={viewer.stepIndex === 0}
        aria-label="Previous step"
      >
        <SkipBackIcon />
      </Button>
      <Button
        onClick={viewer.togglePlayback}
        disabled={!viewer.canRenderAnimation}
      >
        {viewer.playing ? <PauseIcon /> : <PlayIcon />}
        {viewer.playing ? 'Pause' : 'Play'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={viewer.next}
        disabled={viewer.stepIndex >= count - 1}
        aria-label="Next step"
      >
        <SkipForwardIcon />
      </Button>
      <Slider
        className="mx-2 flex-1"
        min={0}
        max={1}
        step={0.001}
        value={[viewer.progress]}
        onValueChange={(value) => viewer.seek(value[0])}
        disabled={!viewer.canRenderAnimation}
        aria-label="Step progress"
      />
      <ToggleGroup
        type="single"
        value={viewer.viewMode}
        onValueChange={(value) =>
          value && viewer.setViewMode(value as 'animation' | 'text')
        }
        variant="outline"
      >
        <ToggleGroupItem value="animation">Animation</ToggleGroupItem>
        <ToggleGroupItem value="text">Text</ToggleGroupItem>
      </ToggleGroup>
      <Button
        variant="outline"
        size="icon"
        onClick={viewer.reset}
        aria-label="Reset step"
      >
        <RotateCcwIcon />
      </Button>
    </div>
  );
}
