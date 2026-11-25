import { FormEvent, useState } from 'react';
import {
  Bookmark,
  Heart,
  PlusSquare,
  Settings,
  Trash2,
  UserCog,
  X,
} from 'lucide-react';
import { WireframeMedia } from '../components/WireframeMedia';
import { Luogo, Ricetta, Utente } from '../types';

interface ProfiloPersonaleScreenProps {
  me: Utente;
  savedCount: number;
  myPosts: Ricetta[];
  likedIds: string[];
  savedIds: string[];
  luoghi: Luogo[];
  onOpenPostSalvati: () => void;
  onOpenNuovoPost: () => void;
  onOpenModificaProfilo: () => void;
  onOpenRicetta: (ricettaId: string) => void;
  onUpdatePost: (
    ricettaId: string,
    data: { titolo: string; descrizione: string; luogoId: string }
  ) => void;
  onDeletePost: (ricettaId: string) => void;
}

export function ProfiloPersonaleScreen({
  me,
  savedCount,
  myPosts,
  likedIds,
  savedIds,
  luoghi,
  onOpenPostSalvati,
  onOpenNuovoPost,
  onOpenModificaProfilo,
  onOpenRicetta,
  onUpdatePost,
  onDeletePost,
}: ProfiloPersonaleScreenProps) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLuogoId, setEditLuogoId] = useState('');

  const startEditing = (post: Ricetta) => {
    if (editingPostId === post.id) {
      setEditingPostId(null);
      return;
    }
    setEditingPostId(post.id);
    setEditTitle(post.titolo);
    setEditDesc(post.descrizione);
    setEditLuogoId(post.luogoId);
  };

  const handleSaveEdit = (e: FormEvent, postId: string) => {
    e.preventDefault();
    onUpdatePost(postId, {
      titolo: editTitle.trim() || 'Ricetta aggiornata',
      descrizione: editDesc.trim() || 'Descrizione ricetta.',
      luogoId: editLuogoId,
    });
    setEditingPostId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="shrink-0 bg-white border-b-2 border-black px-3 py-2.5">
        <h1 className="text-sm font-bold text-black">Profilo personale</h1>
      </header>

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Rettangolo Marco Conti */}
        <div className="border-2 border-black bg-white p-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <WireframeMedia
              variant="avatar"
              label={me.avatarLabel}
              className="w-14 h-14"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-black">{me.nome}</h2>
              <p className="text-xs text-neutral-600">{me.username}</p>
              <p className="text-[11px] text-neutral-500">{me.citta}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-800 border-t border-neutral-300 pt-2 leading-relaxed">
            {me.bio}
          </p>
        </div>

        {/* Icone sotto il rettangolo di Marco Conti */}
        <section
          aria-label="Azioni profilo"
          className="grid grid-cols-3 gap-2"
        >
          <button
            type="button"
            onClick={onOpenPostSalvati}
            aria-label="Post salvati"
            className="relative min-h-[56px] p-2 border-2 border-black bg-white text-black flex flex-col items-center justify-center gap-1 hover:bg-black hover:text-white transition-colors cursor-pointer group"
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-bold leading-none whitespace-nowrap">
              Salvati ({savedCount})
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenNuovoPost}
            aria-label="Nuovo post"
            className="min-h-[56px] p-2 border-2 border-black bg-black text-white flex flex-col items-center justify-center gap-1 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <PlusSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold leading-none whitespace-nowrap">
              Nuovo post
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenModificaProfilo}
            aria-label="Modifica profilo"
            className="min-h-[56px] p-2 border-2 border-black bg-white text-black flex flex-col items-center justify-center gap-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <UserCog className="w-5 h-5" />
            <span className="text-[10px] font-bold leading-none whitespace-nowrap">
              Modifica
            </span>
          </button>
        </section>

        {/* Lista dei post di Marco con le varie ricette sue */}
        <section aria-label="I post di Marco" className="space-y-2.5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            I post di {me.nome.split(' ')[0]} ({myPosts.length})
          </h3>

          {myPosts.length === 0 ? (
            <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
              Non hai ancora pubblicato ricette. Tocca l’icona Nuovo post per
              iniziare.
            </p>
          ) : (
            <div className="space-y-2.5">
              {myPosts.map((post) => {
                const totalLikes =
                  post.likes + (likedIds.includes(post.id) ? 1 : 0);
                const totalSaves =
                  (post.saves ?? 0) + (savedIds.includes(post.id) ? 1 : 0);
                const isEditing = editingPostId === post.id;

                return (
                  <article
                    key={post.id}
                    className="border-2 border-black bg-white p-2 space-y-2"
                  >
                    <div className="flex items-stretch gap-2.5">
                      {/* Immagine del piatto a lato */}
                      <button
                        type="button"
                        onClick={() => onOpenRicetta(post.id)}
                        aria-label={`Apri ${post.titolo}`}
                        className="shrink-0 cursor-pointer"
                      >
                        <WireframeMedia
                          variant={post.hasVideo ? 'video' : 'photo'}
                          label={post.piatto}
                          className="w-20 h-20"
                        />
                      </button>

                      {/* Nome del piatto, like ricevuti, salvataggi ricevuti */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <button
                            type="button"
                            onClick={() => onOpenRicetta(post.id)}
                            className="text-left text-xs font-bold text-black hover:underline leading-snug line-clamp-2 cursor-pointer"
                          >
                            {post.titolo}
                          </button>
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                            {post.luogoNome}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono-wf text-black pt-1">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{totalLikes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{totalSaves}</span>
                          </span>
                        </div>
                      </div>

                      {/* Impostazioni per modificare il post */}
                      <div className="shrink-0 flex flex-col justify-start">
                        <button
                          type="button"
                          onClick={() => startEditing(post)}
                          aria-label={`Impostazioni modifica ${post.titolo}`}
                          title="Modifica post"
                          className={`w-9 h-9 border border-black flex items-center justify-center transition-colors cursor-pointer ${
                            isEditing
                              ? 'bg-black text-white'
                              : 'bg-white text-black hover:bg-black hover:text-white'
                          }`}
                        >
                          {isEditing ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Settings className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Pannello impostazioni modifica post */}
                    {isEditing && (
                      <form
                        onSubmit={(e) => handleSaveEdit(e, post.id)}
                        className="border-t-2 border-black pt-2.5 space-y-2 bg-neutral-50 p-2"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-black">
                          Modifica post
                        </p>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Nome piatto"
                          className="w-full h-[36px] px-2 border border-black bg-white text-xs text-black"
                        />
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Descrizione ricetta"
                          className="w-full p-2 border border-black bg-white text-xs text-black resize-none"
                        />
                        <select
                          value={editLuogoId}
                          onChange={(e) => setEditLuogoId(e.target.value)}
                          className="w-full h-[36px] px-2 border border-black bg-white text-xs text-black"
                        >
                          {luoghi.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.nome} ({l.tipo})
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onDeletePost(post.id);
                              setEditingPostId(null);
                            }}
                            className="min-h-[34px] px-2.5 border border-black bg-white text-black text-[11px] font-semibold flex items-center gap-1 hover:bg-neutral-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Elimina</span>
                          </button>
                          <button
                            type="submit"
                            className="min-h-[34px] px-3 border border-black bg-black text-white text-[11px] font-bold hover:bg-neutral-800 cursor-pointer"
                          >
                            Salva modifiche
                          </button>
                        </div>
                      </form>
                    )}
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
