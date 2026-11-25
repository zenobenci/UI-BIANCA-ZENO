import { useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, Heart, MapPin, Search, X } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Luogo, Ricetta, Utente } from '../types';

interface LuogoPanelScreenProps {
  luogo: Luogo;
  cittaRegione: Luogo[];
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
  onSelectLuogo: (luogoId: string) => void;
}

export function LuogoPanelScreen({
  luogo,
  cittaRegione,
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
  onSelectLuogo,
}: LuogoPanelScreenProps) {
  const [activeSection, setActiveSection] = useState<'ricette' | 'legends'>(
    'ricette'
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'citta' | 'piatto'>('piatto');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const cittaFiltrate = useMemo(() => {
    if (!normalizedQuery) return cittaRegione;
    return cittaRegione.filter((c) =>
      c.nome.toLowerCase().includes(normalizedQuery)
    );
  }, [cittaRegione, normalizedQuery]);

  const ricetteFiltrate = useMemo(() => {
    if (!normalizedQuery) return ricette;
    if (searchMode === 'citta') {
      return ricette.filter((r) =>
        r.luogoNome.toLowerCase().includes(normalizedQuery)
      );
    }
    return ricette.filter(
      (r) =>
        r.titolo.toLowerCase().includes(normalizedQuery) ||
        r.piatto.toLowerCase().includes(normalizedQuery) ||
        r.descrizione.toLowerCase().includes(normalizedQuery)
    );
  }, [ricette, normalizedQuery, searchMode]);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setQuery('');
    } else {
      setSearchMode(luogo.tipo === 'Regione' ? 'citta' : 'piatto');
      setIsSearchOpen(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={`${luogo.nome} (${luogo.tipo})`} onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Intestazione luogo con opzione di ricerca al lato */}
        <div className="border-2 border-black bg-neutral-100 px-3 py-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-bold text-black truncate">
              {luogo.nome}
            </p>
            <p className="text-[11px] text-neutral-600 truncate">
              {luogo.tipo} · {luogo.sottotitolo}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleSearch}
            aria-expanded={isSearchOpen}
            className={`min-h-[38px] px-2.5 py-1 border border-black text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              isSearchOpen
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isSearchOpen ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>{isSearchOpen ? 'Chiudi' : 'Cerca'}</span>
          </button>
        </div>

        {/* Pannello di ricerca nella regione: città specifica o piatto specifico */}
        {isSearchOpen && (
          <div className="border-2 border-black bg-white p-2.5 space-y-2.5 shadow-[3px_3px_0_0_#000000]">
            {luogo.tipo === 'Regione' && (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('citta');
                    setQuery('');
                  }}
                  className={`min-h-[34px] px-2 border border-black text-[11px] font-bold cursor-pointer ${
                    searchMode === 'citta'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  Città della regione
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('piatto');
                    setQuery('');
                  }}
                  className={`min-h-[34px] px-2 border border-black text-[11px] font-bold cursor-pointer ${
                    searchMode === 'piatto'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  Piatto specifico
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    searchMode === 'citta'
                      ? `Cerca città in ${luogo.nome}...`
                      : `Cerca piatto in ${luogo.nome}...`
                  }
                  aria-label="Cerca nella regione"
                  className="w-full h-[38px] pl-8 pr-2.5 border border-black bg-white text-xs text-black placeholder:text-neutral-500"
                />
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="h-[38px] px-2.5 border border-black bg-white text-[11px] font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {searchMode === 'citta' && luogo.tipo === 'Regione' && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Città in {luogo.nome}
                </p>
                {cittaFiltrate.length === 0 ? (
                  <p className="text-[11px] text-neutral-500">
                    Nessuna città trovata con "{query.trim()}".
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {cittaFiltrate.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => onSelectLuogo(city.id)}
                        className="min-h-[34px] px-2.5 py-1 border border-black bg-neutral-50 text-black text-[11px] font-semibold flex items-center gap-1 hover:bg-black hover:text-white cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{city.nome}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab affiancate: Ricette locali | Local legend */}
        <div
          role="tablist"
          aria-label="Sezioni luogo"
          className="grid grid-cols-2 border-b-2 border-black"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'ricette'}
            onClick={() => setActiveSection('ricette')}
            className={`min-h-[40px] px-2 py-2 text-xs uppercase tracking-wider text-center border-r border-black transition-colors cursor-pointer ${
              activeSection === 'ricette'
                ? 'bg-white text-black font-bold border-b-2 border-b-black -mb-[2px]'
                : 'bg-neutral-100 text-neutral-400 font-medium hover:text-neutral-600'
            }`}
          >
            Ricette locali ({ricetteFiltrate.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'legends'}
            onClick={() => setActiveSection('legends')}
            className={`min-h-[40px] px-2 py-2 text-xs uppercase tracking-wider text-center transition-colors cursor-pointer ${
              activeSection === 'legends'
                ? 'bg-white text-black font-bold border-b-2 border-b-black -mb-[2px]'
                : 'bg-neutral-100 text-neutral-400 font-medium hover:text-neutral-600'
            }`}
          >
            Local legend ({localLegends.length})
          </button>
        </div>

        {/* Contenuto della tab selezionata */}
        {activeSection === 'ricette' ? (
          <section aria-label="Ricette locali" className="space-y-2.5 pb-2">
            {normalizedQuery && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-[11px] underline font-semibold cursor-pointer"
                >
                  Mostra tutte
                </button>
              </div>
            )}

            {ricetteFiltrate.length === 0 ? (
              <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
                {normalizedQuery
                  ? `Nessuna ricetta trovata per "${query.trim()}".`
                  : 'Nessuna ricetta ancora presente per questo luogo.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {ricetteFiltrate.map((ricetta) => {
                  const isLiked = likedIds.includes(ricetta.id);
                  const isSaved = savedIds.includes(ricetta.id);
                  const autore = utentiMap[ricetta.autoreId];
                  const totalLikes = ricetta.likes + (isLiked ? 1 : 0);
                  const totalSaves = (ricetta.saves ?? 0) + (isSaved ? 1 : 0);

                  return (
                    <article
                      key={ricetta.id}
                      className="border-2 border-black bg-white p-2"
                    >
                      <div className="flex items-stretch gap-2.5">
                        {/* Immagine del piatto a lato */}
                        <button
                          type="button"
                          onClick={() => onOpenRicetta(ricetta.id)}
                          aria-label={`Apri ${ricetta.titolo}`}
                          className="shrink-0 cursor-pointer"
                        >
                          <WireframeMedia
                            variant={ricetta.hasVideo ? 'video' : 'photo'}
                            label={ricetta.piatto}
                            className="w-20 h-20"
                          />
                        </button>

                        {/* Nome del piatto, autore/luogo, Like e Salva */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <button
                              type="button"
                              onClick={() => onOpenRicetta(ricetta.id)}
                              className="text-left text-xs font-bold text-black hover:underline leading-snug line-clamp-2 cursor-pointer"
                            >
                              {ricetta.titolo}
                            </button>
                            <p className="text-[10px] text-neutral-600 truncate mt-0.5">
                              {autore ? autore.nome : 'Marco Conti'} ·{' '}
                              {ricetta.luogoNome}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => onToggleLike(ricetta.id)}
                              aria-label="Metti like"
                              className={`px-2 py-1 border border-black text-[10px] font-mono-wf font-semibold flex items-center gap-1 cursor-pointer ${
                                isLiked
                                  ? 'bg-black text-white'
                                  : 'bg-white text-black hover:bg-neutral-100'
                              }`}
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  isLiked ? 'fill-white' : ''
                                }`}
                              />
                              <span>{totalLikes}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onToggleSave(ricetta.id)}
                              aria-label="Salva ricetta"
                              className={`px-2 py-1 border border-black text-[10px] font-mono-wf font-semibold flex items-center gap-1 cursor-pointer ${
                                isSaved
                                  ? 'bg-black text-white'
                                  : 'bg-white text-black hover:bg-neutral-100'
                              }`}
                            >
                              <Bookmark
                                className={`w-3 h-3 ${
                                  isSaved ? 'fill-white' : ''
                                }`}
                              />
                              <span>{totalSaves}</span>
                            </button>
                          </div>
                        </div>

                        {/* Bottone Apri post */}
                        <div className="shrink-0 flex flex-col justify-start">
                          <button
                            type="button"
                            onClick={() => onOpenRicetta(ricetta.id)}
                            aria-label={`Apri post ${ricetta.titolo}`}
                            title="Apri post"
                            className="w-9 h-9 border border-black bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section aria-label="Local legend" className="space-y-2.5 pb-2">
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
        )}
      </div>
    </div>
  );
}
