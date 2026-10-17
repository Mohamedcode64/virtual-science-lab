'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSectionEntrance } from '@/components/experiments/shared/experience-ui';

interface ExperimentVideoProps {
  id?: string;
  title?: string;
  description?: string;
  youtubeUrl?: string;
  thumbnail?: string;
}

function getYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    let videoId = '';
    if (host === 'youtu.be') videoId = url.pathname.split('/').filter(Boolean)[0] ?? '';
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      videoId = url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).at(-1) ?? '';
    }
    if (!/^[\w-]{11}$/.test(videoId)) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}?controls=1&playsinline=1&rel=0`;
  } catch {
    return null;
  }
}

export function ExperimentVideo({ id = 'ph-video', title = 'فيديو شرح التجربة', description = 'شرح مرئي مبسط يدعم التجربة التفاعلية.', youtubeUrl, thumbnail }: ExperimentVideoProps) {
  const sectionRef = useSectionEntrance<HTMLElement>();
  const [embedFailed, setEmbedFailed] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  const showEmbed = Boolean(embedUrl && !embedFailed);

  return (
    <section ref={sectionRef} id={id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-labelledby={`${id}-title`}>
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 id={`${id}-title`} className="font-bold text-neutral-900">{title}</h2>
        <p className="mt-1 text-xs leading-6 text-neutral-600">{description}</p>
      </div>
      <div className="relative aspect-video overflow-hidden bg-neutral-950">
        {showEmbed ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl!}
            title={title}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={() => setEmbedFailed(true)}
          />
        ) : thumbnail ? (
          <div className="absolute inset-0">
            <Image src={thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover opacity-55" unoptimized />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/45 px-6 text-center text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/10" aria-hidden="true"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="m8 5 12 7-12 7V5Z" /></svg></span>
              <span className="font-semibold">{title}</span>
              <span className="text-xs text-white/75">الفيديو التعليمي غير متاح الآن.</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#132a3a,#164b57)] px-6 text-center text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-teal-200" aria-hidden="true"><svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8" /></svg></span>
            <span className="font-semibold">{title}</span>
            <span className="max-w-sm text-xs leading-6 text-white/75">يتعذر تشغيل المشاهدة المضمنة. استخدم رابط الفيديو لمشاهدته في YouTube.</span>
          </div>
        )}
      </div>
      {youtubeUrl && (
        <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-5 py-3">
          <p className="text-xs text-neutral-500">يمكن تشغيل الصوت وضبطه والبحث داخل الفيديو من مشغل YouTube.</p>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-offset-2">
            فتح على YouTube
          </a>
        </div>
      )}
    </section>
  );
}
