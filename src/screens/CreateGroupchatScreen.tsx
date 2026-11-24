import { FormEvent, useState } from 'react';
import { Check } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Utente } from '../types';

interface CreateGroupchatScreenProps {
  utenti: Utente[];
  onBack: () => void;
  onCreateGroup: (nomeGruppo: string, membriIds: string[]) => void;
}

export function CreateGroupchatScreen({
  utenti,
  onBack,
  onCreateGroup,
}: CreateGroupchatScreenProps) {
  const [nomeGruppo, setNomeGruppo] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const membri = selectedIds.length > 0 ? selectedIds : [utenti[0].id];
    onCreateGroup(
      nomeGruppo.trim() || `Gruppo Cucina (${membri.length + 1})`,
      membri
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Create groupchat" onBack={onBack} />

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="group-name"
              className="block text-xs font-bold uppercase tracking-wider"
            >
              Nome gruppo
            </label>
            <input
              id="group-name"
              type="text"
              value={nomeGruppo}
              onChange={(e) => setNomeGruppo(e.target.value)}
              placeholder="Es. Amici della Carbonara"
              className="w-full h-[40px] px-3 border border-black bg-white text-xs text-black"
            />
          </div>

          <section aria-label="Aggiungi membri" className="space-y-2">
            <div className="flex items-center justify-between border-b border-black pb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Aggiungi membri
              </h2>
              <span className="text-[11px] font-mono-wf">
                {selectedIds.length} selezionati
              </span>
            </div>

            <div className="space-y-2">
              {utenti.map((utente) => {
                const isSelected = selectedIds.includes(utente.id);
                return (
                  <button
                    key={utente.id}
                    type="button"
                    onClick={() => toggleMember(utente.id)}
                    className={`w-full text-left border-2 border-black p-2.5 flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-100'
                        : 'bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <WireframeMedia
                        variant="avatar"
                        label={utente.avatarLabel}
                        className="w-10 h-10"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-black truncate">
                          {utente.nome}
                        </p>
                        <p className="text-[11px] text-neutral-600 truncate">
                          {utente.username} · {utente.citta}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 border-2 border-black flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-black text-white' : 'bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="shrink-0 p-3 border-t-2 border-black bg-white">
          <button
            type="submit"
            className="w-full min-h-[44px] px-4 py-2 border-2 border-black bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
          >
            Crea groupchat
          </button>
        </div>
      </form>
    </div>
  );
}
