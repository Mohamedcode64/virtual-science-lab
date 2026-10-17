'use client';

import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { ScientificIntro } from './scientific-intro';

export function HomeExperienceGate({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const completeIntro = useCallback(() => setIntroComplete(true), []);

  if (!introComplete) return <ScientificIntro onComplete={completeIntro} />;
  return children;
}
