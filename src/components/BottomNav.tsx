import { Map, MessageSquare, User } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const tabs: { id: TabId; label: string; Icon: typeof Map }[] = [
    { id: 'mappa', label: 'Mappa', Icon: Map },
    { id: 'profilo', label: 'Profilo', Icon: User },
    { id: 'messaggi', label: 'Messaggi', Icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Navigazione principale"
      className="shrink-0 bg-white border-t-2 border-black grid grid-cols-3 h-[58px]"
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 border-r last:border-r-0 border-black text-xs font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-black text-white font-bold'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:text-black'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={isActive ? 2.4 : 1.8} />
            <span className="leading-none tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
