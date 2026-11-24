import { Image as ImageIcon, Play } from 'lucide-react';

interface WireframeMediaProps {
  label?: string;
  variant?: 'photo' | 'video' | 'avatar';
  className?: string;
}

export function WireframeMedia({
  label,
  variant = 'photo',
  className = '',
}: WireframeMediaProps) {
  if (variant === 'avatar') {
    return (
      <div
        className={`relative bg-neutral-200 border border-black flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full stroke-neutral-400"
        >
          <line x1="0" y1="0" x2="100" y2="100" strokeWidth="1.5" />
          <line x1="100" y1="0" x2="0" y2="100" strokeWidth="1.5" />
        </svg>
        <span className="relative z-10 text-[11px] font-bold bg-white/90 px-1 border border-black text-black">
          {label || 'X'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-neutral-200 border border-black flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full stroke-neutral-400"
      >
        <line x1="0" y1="0" x2="100" y2="100" strokeWidth="1.2" />
        <line x1="100" y1="0" x2="0" y2="100" strokeWidth="1.2" />
      </svg>
      <div className="relative z-10 flex items-center gap-1.5 bg-white/95 border border-black px-2 py-1 text-[11px] font-mono-wf text-black">
        {variant === 'video' ? (
          <Play className="w-3.5 h-3.5 fill-black text-black" />
        ) : (
          <ImageIcon className="w-3.5 h-3.5 text-black" />
        )}
        <span>{label || (variant === 'video' ? 'VIDEO' : 'FOTO')}</span>
      </div>
    </div>
  );
}
