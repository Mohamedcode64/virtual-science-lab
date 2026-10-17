'use client';

import { useMemo, useState } from 'react';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';
import { MagnetismScene } from './magnetism-scene';

type TestObject = 'iron' | 'plastic' | 'magnet';

const objectOptions: Array<{ id: TestObject; label: string }> = [
  { id: 'iron', label: 'قطعة حديد' },
  { id: 'plastic', label: 'كرة بلاستيكية' },
  { id: 'magnet', label: 'مغناطيس اختبار' },
];

export function MagnetismExperience() {
  const [testObject, setTestObject] = useState<TestObject>('iron');
  const [magnetActive, setMagnetActive] = useState(false);
  const [samePoles, setSamePoles] = useState(false);
  const [distance, setDistance] = useState(8);
  const [resetVersion, setResetVersion] = useState(0);
  const webglAvailable = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();
  const result = useMemo(() => {
    if (testObject === 'iron') return 'تنجذب قطعة الحديد إلى المغناطيس، ويضعف أثر الجذب كلما زادت المسافة.';
    if (testObject === 'plastic') return 'لا تنجذب الكرة البلاستيكية؛ فالمغناطيس لا يجذب كل المواد.';
    return samePoles
      ? 'القطبان الشماليان المتقابلان متشابهان، لذلك يتنافر المغناطيسان.'
      : 'القطب الشمالي والجنوبي المتقابلان مختلفان، لذلك يتجاذب المغناطيسان.';
  }, [samePoles, testObject]);

  function resetExperiment() {
    setTestObject('iron');
    setMagnetActive(false);
    setSamePoles(false);
    setDistance(8);
    setResetVersion((version) => version + 1);
    playSound();
  }

  function selectObject(value: TestObject) {
    setTestObject(value);
    setMagnetActive(false);
    playSound();
  }

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الفيزياء"
        stageTitle="قوى المغناطيس في مساحة ثلاثية الأبعاد"
        status={testObject === 'magnet' ? samePoles ? 'تنافر بين قطبين متشابهين' : 'تجاذب بين قطبين مختلفين' : testObject === 'iron' ? 'الحديد ينجذب إلى المغناطيس' : 'البلاستيك لا ينجذب'}
        statusText={result}
        caption="حرّك المشهد بإصبعك أو الفأرة، وغيّر العينة والمسافة ولاحظ خطوط المجال واتجاه الحركة."
        onReset={resetExperiment}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
        controls={
          <>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-neutral-700">اختر العينة</legend>
              <p className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-neutral-600"><span><i className="ml-1 inline-block h-2 w-2 rounded-full bg-[#c45b4a]" aria-hidden="true" />الشمالي N</span><span><i className="ml-1 inline-block h-2 w-2 rounded-full bg-[#366c9e]" aria-hidden="true" />الجنوبي S</span></p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {objectOptions.map((option) => (
                  <button key={option.id} type="button" onClick={() => selectObject(option.id)} aria-pressed={testObject === option.id} className={`min-h-11 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors ${testObject === option.id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={() => { setMagnetActive((active) => !active); playSound(); }}
              aria-pressed={magnetActive}
              disabled={testObject !== 'iron'}
              className="btn-primary min-h-12 w-full justify-center px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {magnetActive ? 'إيقاف المغناطيس' : 'جذب الكرة'}
            </button>
            {testObject !== 'iron' && <p className="text-xs leading-5 text-neutral-500">اختر قطعة الحديد لتجربة جذب الكرة.</p>}
            <button type="button" onClick={() => { setSamePoles((current) => !current); playSound(); }} aria-pressed={samePoles} className="btn-secondary min-h-11 w-full justify-center px-3 py-2 text-xs">
              {samePoles ? 'اجعل القطبين مختلفين' : 'قلب قطب مغناطيس الاختبار'}
            </button>
            <label htmlFor="magnet-distance" className="block rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <span className="flex items-center justify-between gap-2 text-xs font-semibold text-neutral-700"><span>المسافة بين العينة والمغناطيس</span><span className="font-mono" dir="ltr">{distance} cm</span></span>
              <input id="magnet-distance" className="mt-3 w-full accent-teal-700" type="range" min="3" max="20" step="1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} aria-valuetext={`${distance} سنتيمترات`} />
              <span className="mt-1 flex justify-between text-[10px] text-neutral-500"><span>قريبة</span><span>بعيدة</span></span>
            </label>
            <p className="rounded-xl border border-science-100 bg-science-50/70 p-3 text-xs leading-6 text-science-900" role="status" aria-live="polite">الملاحظة: {result}</p>
          </>
        }
      >
        {webglAvailable === null ? <SceneLoading label="المغناطيس" /> : webglAvailable ? (
          <ExperimentCanvas camera={{ position: [0, 1.1, 8.5], fov: 42 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'low-power' }}>
            <MagnetismScene testObject={testObject} magnetActive={magnetActive} distance={distance} samePoles={samePoles} reducedMotion={reducedMotion} resetVersion={resetVersion} onObjectSelect={selectObject} onPolarityToggle={() => setSamePoles((current) => !current)} />
          </ExperimentCanvas>
        ) : (
          <div className="flex h-full min-h-72 items-center justify-center p-6 text-center text-sm leading-7 text-neutral-700" role="status">يتطلب عرض نموذج المغناطيس التفاعلي متصفحاً يدعم WebGL.</div>
        )}
      </ExperimentWorkspace>

      <LearningPanel
        title="ما الذي يجذب المغناطيس؟"
        introduction="اختبر عينات مختلفة، ثم قرّب المغناطيس وأبعده. يظهر النموذج حركة تقريبية للجسم وخطوط المجال حول المغناطيس."
        items={[
          { title: 'المواد المغناطيسية', text: 'يجذب المغناطيس الحديد وبعض المعادن مثل الفولاذ.' },
          { title: 'الأقطاب', text: 'الأقطاب المختلفة تتجاذب، والأقطاب المتشابهة تتنافر.' },
          { title: 'المسافة', text: 'يضعف أثر المغناطيس عندما نزيد المسافة بينه وبين الجسم.' },
        ]}
        note="حركة الأجسام وخطوط المجال في النموذج تقريب تعليمي لتوضيح الفكرة."
      />
      <ExperimentVideo id="magnetism-video" title="All About Magnets" description="فيديو تعليمي مكمل عن المغناطيس وخصائصه." youtubeUrl="https://youtu.be/S-XNaiwHWqQ?si=FwEDkrqaWi-XbFDB" />
    </div>
  );
}
