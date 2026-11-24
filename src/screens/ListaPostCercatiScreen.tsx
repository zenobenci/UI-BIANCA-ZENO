import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta, Utente } from '../types';

interface ListaPostCercatiScreenProps {
  initialQuery: string;
  ricette: Ricetta[];
  utentiMap: Record<string, Utente>;
  onBack: () => void;
  onOpenRicetta: (ricettaId: string) => void;
  onOpenProfilo: (utenteId: string) => void;
}

export function ListaPostCercatiScreen({
  initialQuery,
  ricette,
  utentiMap,
  onBack,
  onOpenRicetta,
  onOpenProfilo,
}: ListaPostCercatiScreenProps) {
  const [query, setQuery] = useState(initialQuery);

  const normalized = query.trim().toLowerCase();
  const risultati = normalized
    ? ricette.filter(
        (r) =>
          r.titolo.toLowerCase().includes(normalized) ||
          r.piatto.toLowerCase().includes(normalized) ||
          r.descrizione.toLowerCase().includes(normalized) ||
          r.luogoNome.toLowerCase().includes(normalized)
      )
    : ricette;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Lista di post con il piatto cercato" onBack={onBack} />

      {/* Barra ricerca modificabile */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-3 border-b border-black bg-neutral-50 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtra per piatto..."
            className="w-full h-[38px] pl-8 pr-2.5 border border-black bg-white text-xs text-black"
          />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="h-[38px] px-2.5 border border-black bg-white text-[11px] font-semibold hover:bg-neutral-100 cursor-pointer"
          >
            Tutti
          </button>
        )}
      </form>

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-3">
        <p className="text-[11px] text-neutral-600 font-mono-wf">
          {risultati.length} risultati{' '}
          {normalized ? `per "${query.trim()}"` : 'disponibili'}
        </p>

        {risultati.length === 0 ? (
          <div className="border border-dashed border-black p-4 text-center space-y-2">
            <p className="text-xs font-semibold">
              Nessun post trovato per "{query.trim()}".
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-3 py-1.5 border border-black bg-black text-white text-xs font-semibold cursor-pointer"
            >
              Mostra tutti i piatti
            </button>
          </div>
        ) : (
          risultati.map((ricetta) => {
            const autore = utentiMap[ricetta.autoreId];
            return (
              <article
                key={ricetta.id}
                className="border-2 border-black bg-white p-2.5 space-y-2.5"
              >
                <div className="flex gap-2.5">
                  <WireframeMedia
                    variant={ricetta.hasVideo ? 'video' : 'photo'}
                    label={ricetta.piatto}
                    className="w-24 h-20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-black leading-snug">
                      {ricetta.titolo}
                    </h2>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      {autore ? autore.nome : 'Marco Conti'} ·{' '}
                      {ricetta.luogoNome}
                    </p>
                    <p className="text-xs text-neutral-700 mt-1 line-clamp-2">
                      {ricetta.descrizione}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenRicetta(ricetta.id)}
                    className="min-h-[40px] px-3 border border-black bg-black text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                  >
                    Apri ricetta
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenProfilo(ricetta.autoreId)}
                    className="min-h-[40px] px-3 border border-black bg-white text-black text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
                  >
                    Apri profilo
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
