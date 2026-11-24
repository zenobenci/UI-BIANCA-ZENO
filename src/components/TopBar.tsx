import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title: string;
  onBack: () => void;
}

export function TopBar({ title, onBack }: TopBarProps) {
  return (
    <header className="shrink-0 bg-white border-b-2 border-black px-3 py-2 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[40px] px-2.5 py-1.5 border border-black bg-white text-black text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:bg-black hover:text-white active:bg-neutral-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Indietro</span>
      </button>
      <h1 className="text-sm font-bold text-black truncate text-right">{title}</h1>
    </header>
  );
}
