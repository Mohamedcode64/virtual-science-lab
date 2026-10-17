'use client';

import { useState } from 'react';
import { ExperimentVideo } from '@/components/ui/experiment-video';
import { ExperimentCanvas, ExperimentWorkspace, LearningPanel, SceneLoading, useExperimentSound, useReducedMotionPreference, useWebGLSupport } from '@/components/experiments/shared/experience-ui';
import { CellScene } from './cell-scene';

export type CellType = 'animal' | 'plant';
export type OrganelleId = 'membrane' | 'cytoplasm' | 'nucleus' | 'mitochondria' | 'ribosomes' | 'reticulum' | 'golgi' | 'vacuole' | 'chloroplast';

const organelles: Array<{ id: OrganelleId; name: string; explanation: string }> = [
  { id: 'membrane', name: 'الغشاء الخلوي', explanation: 'يحيط بالخلية وينظم دخول المواد إليها وخروجها.' },
  { id: 'cytoplasm', name: 'السيتوبلازم', explanation: 'مادة هلامية توجد فيها العضيات وتحدث فيها تفاعلات كثيرة.' },
  { id: 'nucleus', name: 'النواة', explanation: 'تنظم أنشطة الخلية وتحتوي على معلوماتها الوراثية.' },
  { id: 'mitochondria', name: 'الميتوكوندريا', explanation: 'تطلق الطاقة التي تحتاج إليها الخلية.' },
  { id: 'ribosomes', name: 'الريبوسومات', explanation: 'تصنع البروتينات التي يحتاج إليها الجسم.' },
  { id: 'reticulum', name: 'الشبكة الإندوبلازمية', explanation: 'تساعد على صنع بعض المواد ونقلها داخل الخلية.' },
  { id: 'golgi', name: 'جهاز جولجي', explanation: 'يرتب بعض المواد ويجهزها للنقل إلى أجزاء الخلية.' },
  { id: 'vacuole', name: 'الفجوة', explanation: 'تخزن الماء ومواد أخرى، وتكون كبيرة عادة في الخلية النباتية.' },
  { id: 'chloroplast', name: 'البلاستيدة الخضراء', explanation: 'تحتوي على اليخضور وتساعد الخلية النباتية على صنع الغذاء بالضوء.' },
];

export function CellExperience() {
  const [cellType, setCellType] = useState<CellType>('animal');
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleId>('nucleus');
  const [resetVersion, setResetVersion] = useState(0);
  const webglAvailable = useWebGLSupport();
  const reducedMotion = useReducedMotionPreference();
  const { soundEnabled, setSoundEnabled, playSound } = useExperimentSound();
  const selected = organelles.find((item) => item.id === selectedOrganelle) ?? organelles[2];

  function resetExperiment() {
    setCellType('animal');
    setSelectedOrganelle('nucleus');
    setResetVersion((version) => version + 1);
    playSound();
  }

  function chooseOrganelle(id: OrganelleId) {
    setSelectedOrganelle(id);
    playSound();
  }

  function chooseCell(type: CellType) {
    setCellType(type);
    setSelectedOrganelle('nucleus');
    playSound();
  }

  return (
    <div className="space-y-6" dir="rtl" lang="ar">
      <ExperimentWorkspace
        category="الأحياء"
        stageTitle={cellType === 'plant' ? 'نموذج ثلاثي الأبعاد للخلية النباتية' : 'نموذج ثلاثي الأبعاد للخلية الحيوانية'}
        status={`الجزء المحدد: ${selected.name}`}
        statusText={selected.explanation}
        caption="اسحب لتدوير الخلية، واستخدم العجلة أو إيماءة القرص للتكبير، ثم اختر عضية من النموذج أو القائمة."
        onReset={resetExperiment}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((enabled) => !enabled)}
        controls={
          <>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-neutral-700">نوع الخلية</legend>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => chooseCell('animal')} aria-pressed={cellType === 'animal'} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold ${cellType === 'animal' ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-neutral-200 bg-white text-neutral-700'}`}>حيوانية</button>
                <button type="button" onClick={() => chooseCell('plant')} aria-pressed={cellType === 'plant'} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold ${cellType === 'plant' ? 'border-science-500 bg-science-50 text-science-800' : 'border-neutral-200 bg-white text-neutral-700'}`}>نباتية</button>
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-neutral-700">اختر عضية لفحصها</legend>
              <div className="grid grid-cols-2 gap-2">
                {organelles.map((organelle) => (
                  <button key={organelle.id} type="button" onClick={() => chooseOrganelle(organelle.id)} aria-pressed={selectedOrganelle === organelle.id} className={`min-h-11 rounded-xl border px-2 py-2 text-[11px] font-semibold leading-5 ${selectedOrganelle === organelle.id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                    {organelle.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="rounded-xl border border-science-100 bg-science-50/70 p-3 text-xs leading-6 text-neutral-800" role="status" aria-live="polite"><strong>{selected.name}:</strong> {selected.explanation}</p>
          </>
        }
      >
        {webglAvailable === null ? <SceneLoading label="الخلية" /> : webglAvailable ? (
          <ExperimentCanvas key={resetVersion} camera={{ position: [0, 1.2, 7.8], fov: 40 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'low-power' }}>
            <CellScene cellType={cellType} selectedOrganelle={selectedOrganelle} resetVersion={resetVersion} reducedMotion={reducedMotion} onSelectOrganelle={chooseOrganelle} />
          </ExperimentCanvas>
        ) : (
          <div className="flex h-full min-h-72 items-center justify-center p-6 text-center text-sm leading-7 text-neutral-700" role="status">يتطلب عرض نموذج الخلية التفاعلي متصفحاً يدعم WebGL.</div>
        )}
      </ExperimentWorkspace>

      <LearningPanel
        title="استكشف مكوّنات الخلية"
        introduction="تعمل أجزاء الخلية معاً للمحافظة على حياة الكائن. بدّل بين النموذجين وقارن العضيات، ثم اختر أي جزء لقراءة وظيفته."
        items={[
          { title: 'الغشاء والنواة', text: 'يحمي الغشاء الخلية، وتنظم النواة أنشطتها.' },
          { title: 'مصادر الطاقة', text: 'تساعد الميتوكوندريا الخلية على الحصول على الطاقة.' },
          { title: 'الخلية النباتية', text: 'تحتوي على جدار خلوي وفجوة كبيرة، وتوجد فيها بلاستيدات خضراء.' },
        ]}
        note="تختلف بعض الأجزاء بين الخلايا النباتية والحيوانية، لكن كليهما يحتوي على غشاء وسيتوبلازم ونواة."
      />
      <ExperimentVideo id="cell-video" title="Biology: Cell Structure I" description="فيديو مكمل من Nucleus Medical Media عن تركيب الخلايا والعضيات." youtubeUrl="https://www.youtube.com/watch?v=URUJD5NEXC8" />
    </div>
  );
}
