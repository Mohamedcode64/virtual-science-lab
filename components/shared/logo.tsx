import Image from 'next/image';

interface LogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ src, alt, width = 48, height = 48, className = '' }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}

export function UniversityLogo({ width = 36, height = 36, className = '' }: Omit<LogoProps, 'src' | 'alt'>) {
  return (
    <Logo
      src="/logos/logo1.jpeg"
      alt="شعار جامعة الوادي الجديد"
      width={width}
      height={height}
      className={className}
    />
  );
}

export function FacultyLogo({ width = 36, height = 36, className = '' }: Omit<LogoProps, 'src' | 'alt'>) {
  return (
    <Logo
      src="/logos/logo2.jpeg"
      alt="شعار كلية التربية"
      width={width}
      height={height}
      className={className}
    />
  );
}

export function BrandingLogos({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/90 p-1 ${className}`} aria-label="شعار جامعة الوادي الجديد وكلية التربية">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
        <UniversityLogo width={34} height={34} />
      </span>
      <span className="h-6 w-px bg-neutral-200" aria-hidden="true" />
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
        <FacultyLogo width={34} height={34} />
      </span>
    </div>
  );
}
