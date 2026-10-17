'use client';

import { useState } from 'react';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';
import { PollinationScene } from './pollination-scene';

type FlowerPart = 'anther' | 'stigma';

export function PollinationExperience() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedPart, setSelectedPart] = useState<FlowerPart>('anther');
  const [runVersion, setRunVersion] = useState(0);
  const [resetVersion, setResetVersion] = useState(0);
  const webglAvailable = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();

  function startPollination() {
    setRunVersion((version) => version + 1);
    setIsComplete(false);
    setIsRunning(true);
    playSound();
  }

  function resetExperiment() {
    setIsRunning(false);
    setIsComplete(false);
    setSelectedPart('anther');
    setRunVersion((version) => version + 1);
    setResetVersion((version) => version + 1);
    playSound();
  }

  function completePollination() {
    setIsRunning(false);
    setIsComplete(true);
    playSound(true);
  }

  const statusText = isRunning
    ? 'تجمع النحلة حبوب اللقاح من المتك وتحملها إلى ميسم الزهرة الثانية.'
    : isComplete
      ? 'وصلت حبوب اللقاح إلى الميسم. اكتمل انتقالها في هذا النموذج.'
      : 'ابدأ حركة النحلة، ثم لاحظ انتقال حبوب اللقاح من المتك إلى الميسم.';

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الأحياء"
        stageTitle="رحلة حبوب اللقاح بين زهرتين"
        status={isRunning ? 'النحلة تنقل حبوب اللقاح' : isComplete ? 'اكتمل التلقيح' : 'النحلة جاهزة للزيارة'}
        statusText={statusText}
        caption="ابدأ التلقيح وشاهد النحلة ثلاثية الأبعاد وهي تنقل حبوب اللقاح من المتك إلى الميسم."
        onReset={resetExperiment}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
        controls={
          <>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setSelectedPart('anther')} aria-pressed={selectedPart === 'anther'} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold ${selectedPart === 'anther' ? 'border-accent-400 bg-accent-50 text-accent-800' : 'border-neutral-200 bg-white text-neutral-700'}`}>المتك وحبوب اللقاح</button>
              <button type="button" onClick={() => setSelectedPart('stigma')} aria-pressed={selectedPart === 'stigma'} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold ${selectedPart === 'stigma' ? 'border-science-400 bg-science-50 text-science-800' : 'border-neutral-200 bg-white text-neutral-700'}`}>الميسم</button>
            </div>
            <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs leading-6 text-neutral-700" role="status" aria-live="polite">
              {selectedPart === 'anther' ? 'المتك جزء من السداة، وتتكون فيه حبوب اللقاح.' : 'الميسم جزء من المدقة، وتستقر عليه حبوب اللقاح.'}
            </p>
            <button type="button" onClick={startPollination} disabled={isRunning} className="btn-primary min-h-11 w-full justify-center px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60">
              {isRunning ? 'جاري انتقال حبوب اللقاح...' : isComplete ? 'ابدأ دورة جديدة' : 'ابدأ عملية التلقيح'}
            </button>
          </>
        }
      >
        {webglAvailable === null ? <SceneLoading label="التلقيح في النبات" /> : webglAvailable ? (
          <ExperimentCanvas camera={{ position: [0, 1.05, 9.5], fov: 39 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'low-power' }}>
            <PollinationScene active={isRunning} runVersion={runVersion} resetVersion={resetVersion} selectedPart={selectedPart} reducedMotion={reducedMotion} onSelectPart={setSelectedPart} onComplete={completePollination} />
          </ExperimentCanvas>
        ) : (
          <div className="flex h-full min-h-72 items-center justify-center p-6 text-center text-sm leading-7 text-neutral-700" role="status">يتطلب عرض نموذج الزهرة والنحلة التفاعلي متصفحاً يدعم WebGL.</div>
        )}
      </ExperimentWorkspace>

      <LearningPanel
        title="كيف تنتقل حبوب اللقاح؟"
        introduction="تزور النحلة الزهرة بحثاً عن الرحيق. تلتصق بعض حبوب اللقاح بجسمها، ثم تنتقل إلى ميسم زهرة أخرى."
        items={[
          { title: 'المتك', text: 'يحمل المتك حبوب اللقاح التي تنتجها الزهرة.' },
          { title: 'الملقّح', text: 'تساعد النحلة في حمل حبوب اللقاح بين الأزهار.' },
          { title: 'الميسم', text: 'تستقبل قمة المدقة حبوب اللقاح، فتبدأ عملية التلقيح.' },
        ]}
        note={isComplete ? 'النتيجة: وصلت حبوب اللقاح إلى الميسم، وهي خطوة تساعد النبات على تكوين البذور.' : 'تابع المسار من المتك إلى الميسم، ثم أعد التجربة لمشاهدة الحركة مرة أخرى.'}
      />
      <ExperimentVideo id="pollination-video" title="Pollination in a Minute" description="فيديو مكمل يشرح التلقيح في النبات في دقيقة." youtubeUrl="https://youtu.be/DEF5GnVJGsA?si=xZqosDrIJ8YSocR" />
    </div>
  );
}
