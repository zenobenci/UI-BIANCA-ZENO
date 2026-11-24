import { Heart, MessageSquare, UserCheck, UserPlus } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta, Utente } from '../types';

interface ProfiloUtenteScreenProps {
  utente: Utente;
  posts: Ricetta[];
  likedIds: string[];
  isFollowing: boolean;
  onBack: () => void;
  onToggleFollow: (utenteId: string) => void;
  onToggleLike: (ricettaId: string) => void;
  onOpenRicetta: (ricettaId: string) => void;
  onOpenTextChat: (utenteId: string) => void;
}

export function ProfiloUtenteScreen({
  utente,
  posts,
  likedIds,
  isFollowing,
  onBack,
  onToggleFollow,
  onToggleLike,
  onOpenRicetta,
  onOpenTextChat,
}: ProfiloUtenteScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={utente.username} onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Intestazione profilo + Bio */}
        <div className="border-2 border-black p-3 space-y-3 bg-white">
          <div className="flex items-center gap-3">
            <WireframeMedia
              variant="avatar"
              label={utente.avatarLabel}
              className="w-14 h-14"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-black">{utente.nome}</h2>
              <p className="text-xs text-neutral-600">{utente.username}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {utente.citta}
                {utente.isLocalLegend ? ' · Local legend' : ''}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="border-t border-neutral-300 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
              Bio
            </p>
            <p className="text-xs text-black leading-relaxed">{utente.bio}</p>
          </div>

          {/* Segui & Text */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleFollow(utente.id)}
              className={`min-h-[42px] px-3 border border-black text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
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
              onClick={() => onOpenTextChat(utente.id)}
              className="min-h-[42px] px-3 border border-black bg-white text-black text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-black hover:text-white cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
          </div>
        </div>

        {/* Post del profilo */}
        <section aria-label="Post del profilo" className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            Post del profilo ({posts.length})
          </h3>

          {posts.length === 0 ? (
            <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
              Nessun post pubblicato.
            </p>
          ) : (
            <div className="space-y-2.5">
              {posts.map((post) => {
                const isLiked = likedIds.includes(post.id);
                return (
                  <article
                    key={post.id}
                    className="border-2 border-black bg-white p-2.5 space-y-2"
                  >
                    <WireframeMedia
                      variant={post.hasVideo ? 'video' : 'photo'}
                      label={post.piatto}
                      className="w-full h-24"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-black">
                        {post.titolo}
                      </h4>
                      <p className="text-[11px] text-neutral-600">
                        {post.luogoNome}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleLike(post.id)}
                        className={`flex-1 min-h-[38px] px-2 border border-black text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
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
                        <span>Like ({post.likes + (isLiked ? 1 : 0)})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenRicetta(post.id)}
                        className="flex-1 min-h-[38px] px-2 border border-black bg-white text-black text-xs font-semibold hover:bg-black hover:text-white cursor-pointer"
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
      </div>
    </div>
  );
}
