import { Bookmark, Heart } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Luogo, Ricetta, Utente } from '../types';

interface LuogoPanelScreenProps {
  luogo: Luogo;
  ricette: Ricetta[];
  localLegends: Utente[];
  utentiMap: Record<string, Utente>;
  likedIds: string[];
  savedIds: string[];
  onBack: () => void;
  onToggleLike: (ricettaId: string) => void;
  onToggleSave: (ricettaId: string) => void;
  onOpenRicetta: (ricettaId: string) => void;
  onOpenProfilo: (utenteId: string) => void;
}

export function LuogoPanelScreen({
  luogo,
  ricette,
  localLegends,
  utentiMap,
  likedIds,
  savedIds,
  onBack,
  onToggleLike,
  onToggleSave,
  onOpenRicetta,
  onOpenProfilo,
}: LuogoPanelScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={`${luogo.nome} (${luogo.tipo})`} onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-5">
        {/* Intestazione luogo */}
        <div className="border border-black bg-neutral-100 px-3 py-2">
          <p className="text-xs font-bold text-black">{luogo.nome}</p>
          <p className="text-[11px] text-neutral-600">
            {luogo.tipo} · {luogo.sottotitolo}
          </p>
        </div>

        {/* Sezione 1: Ricette locali */}
        <section aria-label="Ricette locali" className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            Ricette locali
          </h2>

          {ricette.length === 0 ? (
            <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
              Nessuna ricetta ancora presente per questo luogo.
            </p>
          ) : (
            <div className="space-y-3">
              {ricette.map((ricetta) => {
                const isLiked = likedIds.includes(ricetta.id);
                const isSaved = savedIds.includes(ricetta.id);
                const autore = utentiMap[ricetta.autoreId];

                return (
                  <article
                    key={ricetta.id}
                    className="border-2 border-black bg-white p-2.5 space-y-2"
                  >
                    <WireframeMedia
                      variant={ricetta.hasVideo ? 'video' : 'photo'}
                      label={ricetta.piatto}
                      className="w-full h-24"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        {ricetta.titolo}
                      </h3>
                      <p className="text-[11px] text-neutral-600">
                        di {autore ? autore.nome : 'Marco Conti'} ·{' '}
                        {ricetta.luogoNome}
                      </p>
                      <p className="text-xs text-neutral-800 mt-1 line-clamp-2">
                        {ricetta.descrizione}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onToggleLike(ricetta.id)}
                        className={`min-h-[38px] px-2 border border-black text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                          isLiked
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-neutral-100'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-white' : ''
                          }`}
                        />
                        <span>Like ({ricetta.likes + (isLiked ? 1 : 0)})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleSave(ricetta.id)}
                        className={`min-h-[38px] px-2 border border-black text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                          isSaved
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-neutral-100'
                        }`}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isSaved ? 'fill-white' : ''
                          }`}
                        />
                        <span>{isSaved ? 'Salvata' : 'Salva ricetta'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenRicetta(ricetta.id)}
                        className="min-h-[38px] px-2 border border-black bg-white text-black text-[11px] font-bold hover:bg-black hover:text-white cursor-pointer"
                      >
                        Apri post
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Sezione 2: Local legend */}
        <section aria-label="Local legend" className="space-y-2.5 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            Local legend
          </h2>

          {localLegends.length === 0 ? (
            <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
              Nessun Local legend registrato in quest’area.
            </p>
          ) : (
            <div className="space-y-2.5">
              {localLegends.map((utente) => (
                <div
                  key={utente.id}
                  className="border-2 border-black bg-white p-2.5 flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <WireframeMedia
                      variant="avatar"
                      label={utente.avatarLabel}
                      className="w-11 h-11"
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
                  <button
                    type="button"
                    onClick={() => onOpenProfilo(utente.id)}
                    className="min-h-[40px] px-3 border border-black bg-black text-white text-[11px] font-semibold whitespace-nowrap shrink-0 hover:bg-neutral-800 cursor-pointer"
                  >
                    Apri profilo
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
