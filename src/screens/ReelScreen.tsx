import { FormEvent, useState } from 'react';
import {
  Bookmark,
  FileText,
  Heart,
  MessageCircle,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { WireframeMedia } from '../components/WireframeMedia';
import { CURRENT_USER_ID } from '../data/mockData';
import { Ricetta, Utente } from '../types';

interface ReelScreenProps {
  reels: Ricetta[];
  utentiMap: Record<string, Utente>;
  likedIds: string[];
  savedIds: string[];
  followingIds: string[];
  onToggleLike: (ricettaId: string) => void;
  onToggleSave: (ricettaId: string) => void;
  onToggleFollow: (utenteId: string) => void;
  onAddComment: (ricettaId: string, testo: string) => void;
  onOpenProfilo: (utenteId: string) => void;
  onOpenRicetta: (ricettaId: string) => void;
}

export function ReelScreen({
  reels,
  utentiMap,
  likedIds,
  savedIds,
  followingIds,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onAddComment,
  onOpenProfilo,
  onOpenRicetta,
}: ReelScreenProps) {
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});
  const [commentDrawerId, setCommentDrawerId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const togglePlay = (id: string) => {
    setPausedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCommentRicetta = commentDrawerId
    ? reels.find((r) => r.id === commentDrawerId)
    : undefined;

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!activeCommentRicetta) return;
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(activeCommentRicetta.id, trimmed);
    setCommentText('');
  };

  return (
    <div className="relative flex-1 w-full h-full bg-neutral-200 overflow-hidden select-none">
      {/* Feed verticale a scorrimento (Instagram Reels wireframe) */}
      <div
        aria-label="Feed video short di ricette"
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory wf-scroll"
      >
        {reels.map((reel, idx) => {
          const autore = utentiMap[reel.autoreId];
          const isLiked = likedIds.includes(reel.id);
          const isSaved = savedIds.includes(reel.id);
          const isFollowing = followingIds.includes(reel.autoreId);
          const isPaused = !!pausedMap[reel.id];
          const isOwnPost = reel.autoreId === CURRENT_USER_ID;

          return (
            <section
              key={reel.id}
              aria-label={`Video ${reel.titolo}`}
              className="relative w-full h-full snap-start shrink-0 bg-neutral-200 border-b-2 border-black overflow-hidden flex flex-col justify-between"
            >
              {/* Segnaposto Video Wireframe a tutto schermo con X */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full stroke-neutral-400 pointer-events-none"
              >
                <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.6" />
                <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.6" />
              </svg>

              {/* Top bar: solo etichetta Reel Ricette */}
              <div className="relative z-20 p-3 flex items-center justify-start">
                <div className="bg-white/95 border border-black px-2.5 py-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                    Reel Ricette
                  </span>
                  <span className="ml-2 text-[10px] font-mono-wf text-neutral-600">
                    {idx + 1}/{reels.length}
                  </span>
                </div>
              </div>

              {/* Area centrale cliccabile per Play / Pausa */}
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => togglePlay(reel.id)}
                  aria-label={isPaused ? 'Riproduci video' : 'Metti in pausa'}
                  className="px-4 py-3 border-2 border-black bg-white/95 text-black shadow-[3px_3px_0_0_#000000] flex items-center gap-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 fill-current" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                  <span className="text-xs font-mono-wf font-bold uppercase">
                    {isPaused ? 'In pausa · Riprendi' : `Video · ${reel.piatto}`}
                  </span>
                </button>
              </div>

              {/* Barra azioni verticale a destra + Bio compatta in basso a sinistra */}
              <div className="relative z-20 p-3 flex items-end justify-between gap-2">
                {/* Bio compatta autore + titolo piatto */}
                <div className="max-w-[230px] bg-white/95 border border-black p-2 space-y-1 shadow-[2px_2px_0_0_#000000]">
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenProfilo(reel.autoreId)}
                      className="flex items-center gap-1.5 min-w-0 text-left group cursor-pointer"
                    >
                      <WireframeMedia
                        variant="avatar"
                        label={autore?.avatarLabel || 'U'}
                        className="w-6 h-6"
                      />
                      <span className="text-[11px] font-bold text-black truncate group-hover:underline">
                        {autore ? autore.username : '@marco_conti'}
                      </span>
                    </button>

                    {!isOwnPost && (
                      <button
                        type="button"
                        onClick={() => onToggleFollow(reel.autoreId)}
                        className={`px-1.5 py-0.5 border border-black text-[9px] font-bold shrink-0 cursor-pointer ${
                          isFollowing
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-neutral-100'
                        }`}
                      >
                        {isFollowing ? 'Seguito' : 'Segui'}
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] font-semibold text-black leading-tight truncate">
                    {reel.titolo}
                  </p>
                  <p className="text-[9px] text-neutral-600 truncate">
                    {reel.luogoNome}
                  </p>
                </div>

                {/* Colonna destra: Like, Commenta, Salva, Apri ricetta */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleLike(reel.id)}
                    aria-label="Metti like"
                    className={`w-12 py-1.5 border-2 border-black flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0_0_#000000] cursor-pointer ${
                      isLiked
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`}
                    />
                    <span className="text-[10px] font-mono-wf font-bold leading-none">
                      {reel.likes + (isLiked ? 1 : 0)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCommentDrawerId(reel.id)}
                    aria-label="Commenta video"
                    className="w-12 py-1.5 border-2 border-black bg-white text-black flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0_0_#000000] hover:bg-black hover:text-white cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[10px] font-mono-wf font-bold leading-none">
                      {reel.commenti.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(reel.id)}
                    aria-label="Salva ricetta"
                    className={`w-12 py-1.5 border-2 border-black flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0_0_#000000] cursor-pointer ${
                      isSaved
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`}
                    />
                    <span className="text-[9px] font-bold leading-none">
                      {isSaved ? 'Salvata' : 'Salva'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenRicetta(reel.id)}
                    aria-label="Apri post ricetta"
                    className="w-12 py-1.5 border-2 border-black bg-white text-black flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0_0_#000000] hover:bg-black hover:text-white cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[9px] font-bold leading-none">
                      Post
                    </span>
                  </button>
                </div>
              </div>

              {/* Barra progresso wireframe in basso */}
              <div
                aria-hidden="true"
                className="relative z-20 w-full h-1 bg-neutral-300 border-t border-black"
              >
                <div
                  className={`h-full bg-black ${
                    isPaused ? 'w-[38%]' : 'w-[65%]'
                  }`}
                />
              </div>
            </section>
          );
        })}
      </div>

      {/* Pannello Commenti in sovrimpressione */}
      {activeCommentRicetta && (
        <div
          role="dialog"
          aria-label="Commenti video"
          className="absolute inset-0 z-40 bg-black/40 flex flex-col justify-end"
        >
          <div className="bg-white border-t-2 border-black h-[62%] flex flex-col">
            <div className="shrink-0 px-3 py-2 border-b-2 border-black flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider truncate">
                Commenti ({activeCommentRicetta.commenti.length}) ·{' '}
                {activeCommentRicetta.piatto}
              </p>
              <button
                type="button"
                onClick={() => setCommentDrawerId(null)}
                aria-label="Chiudi commenti"
                className="w-8 h-8 border border-black bg-white text-black flex items-center justify-center hover:bg-black hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-2">
              {activeCommentRicetta.commenti.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-6">
                  Nessun commento ancora. Scrivi il primo!
                </p>
              ) : (
                activeCommentRicetta.commenti.map((c) => (
                  <div
                    key={c.id}
                    className="border border-black bg-neutral-50 p-2 space-y-0.5"
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-black">
                        {c.autoreNome}
                      </span>
                      <span className="text-neutral-500">{c.ora}</span>
                    </div>
                    <p className="text-xs text-neutral-800">{c.testo}</p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSubmitComment}
              className="shrink-0 p-2.5 border-t-2 border-black bg-white flex items-center gap-1.5"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Aggiungi un commento..."
                className="flex-1 h-[38px] px-2.5 border border-black bg-white text-xs text-black"
              />
              <button
                type="submit"
                className="h-[38px] px-3 border border-black bg-black text-white text-xs font-bold cursor-pointer"
              >
                Invia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
