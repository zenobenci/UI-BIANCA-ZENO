import { Heart, MessageSquare, UserCheck, UserPlus } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta, Utente } from '../types';

interface PostSalvatiScreenProps {
  savedRicette: Ricetta[];
  utentiMap: Record<string, Utente>;
  likedIds: string[];
  followingIds: string[];
  onBack: () => void;
  onToggleLike: (ricettaId: string) => void;
  onToggleFollow: (utenteId: string) => void;
  onOpenTextChat: (utenteId: string) => void;
  onOpenRicetta: (ricettaId: string) => void;
}

export function PostSalvatiScreen({
  savedRicette,
  utentiMap,
  likedIds,
  followingIds,
  onBack,
  onToggleLike,
  onToggleFollow,
  onOpenTextChat,
  onOpenRicetta,
}: PostSalvatiScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Post salvati" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-3">
        {savedRicette.length === 0 ? (
          <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-4 text-center">
            Nessun post salvato al momento. Salva una ricetta dalla Mappa!
          </p>
        ) : (
          savedRicette.map((ricetta) => {
            const autore = utentiMap[ricetta.autoreId];
            const isLiked = likedIds.includes(ricetta.id);
            const isFollowing = followingIds.includes(ricetta.autoreId);

            return (
              <article
                key={ricetta.id}
                className="border-2 border-black bg-white p-2.5 space-y-2"
              >
                <button
                  type="button"
                  onClick={() => onOpenRicetta(ricetta.id)}
                  className="w-full text-left space-y-2 cursor-pointer"
                >
                  <WireframeMedia
                    variant={ricetta.hasVideo ? 'video' : 'photo'}
                    label={ricetta.piatto}
                    className="w-full h-24"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-black">
                      {ricetta.titolo}
                    </h2>
                    <p className="text-[11px] text-neutral-600">
                      di {autore ? autore.nome : 'Marco Conti'} ·{' '}
                      {ricetta.luogoNome}
                    </p>
                  </div>
                </button>

                {/* Bottoni richiesti: Like, Segui, Text */}
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
                      className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`}
                    />
                    <span>Like</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFollow(ricetta.autoreId)}
                    className={`min-h-[38px] px-2 border border-black text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                      isFollowing
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    {isFollowing ? (
                      <UserCheck className="w-3.5 h-3.5" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    <span>{isFollowing ? 'Seguito' : 'Segui'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenTextChat(ricetta.autoreId)}
                    className="min-h-[38px] px-2 border border-black bg-white text-black text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-black hover:text-white cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Text</span>
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
