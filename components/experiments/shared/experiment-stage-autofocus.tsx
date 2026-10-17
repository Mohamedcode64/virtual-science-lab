'use client';

import { useEffect } from 'react';

export function ExperimentStageAutofocus({ slug }: { slug: string }) {
  useEffect(() => {
    let attempts = 0;
    let timer = 0;
    let cancelled = false;

    const focusStage = () => {
      if (cancelled) return;
      const routeContent = document.querySelector<HTMLElement>(`[data-experiment-content="${slug}"]`);
      const stage = routeContent?.querySelector<HTMLElement>('#experiment-stage');

      if (stage) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.requestAnimationFrame(() => {
          if (!cancelled) stage.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
        return;
      }

      attempts += 1;
      if (attempts < 100) timer = window.setTimeout(focusStage, 80);
    };

    timer = window.setTimeout(focusStage, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slug]);

  return null;
}
