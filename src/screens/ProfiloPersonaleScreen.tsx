import { Bookmark, PlusSquare, Settings } from 'lucide-react';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta, Utente } from '../types';

interface ProfiloPersonaleScreenProps {
  me: Utente;
  savedCount: number;
  myPosts: Ricetta[];
  onOpenPostSalvati: () => void;
  onOpenNuovoPost: () => void;
  onOpenModificaProfilo: () => void;
  onOpenRicetta: (ricettaId: string) => void;
}

export function ProfiloPersonaleScreen({
  me,
  savedCount,
  myPosts,
  onOpenPostSalvati,
  onOpenNuovoPost,
  onOpenModificaProfilo,
  onOpenRicetta,
}: ProfiloPersonaleScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="shrink-0 bg-white border-b-2 border-black px-3 py-2.5">
        <h1 className="text-sm font-bold text-black">Profilo personale</h1>
      </header>

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Scheda utente personale */}
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

        {/* Tre bottoni/sezioni principali della mappa */}
        <section aria-label="Azioni profilo" className="space-y-2">
          <button
            type="button"
            onClick={onOpenPostSalvati}
            className="w-full min-h-[48px] px-3.5 py-2.5 border-2 border-black bg-white text-black flex items-center justify-between hover:bg-black hover:text-white transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2.5 text-xs font-bold">
              <Bookmark className="w-4 h-4" />
              <span>Post salvati</span>
            </span>
            <span className="text-xs font-mono-wf border border-black group-hover:border-white px-2 py-0.5">
              {savedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenNuovoPost}
            className="w-full min-h-[48px] px-3.5 py-2.5 border-2 border-black bg-black text-white flex items-center justify-between hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-xs font-bold">
              <PlusSquare className="w-4 h-4" />
              <span>Nuovo post</span>
            </span>
            <span className="text-xs font-mono-wf">+ Crea</span>
          </button>

          <button
            type="button"
            onClick={onOpenModificaProfilo}
            className="w-full min-h-[48px] px-3.5 py-2.5 border-2 border-black bg-white text-black flex items-center justify-between hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-xs font-bold">
              <Settings className="w-4 h-4" />
              <span>Modifica profilo</span>
            </span>
            <span className="text-xs font-mono-wf">&rarr;</span>
          </button>
        </section>

        {/* I tuoi post pubblicati */}
        <section className="space-y-2 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            I tuoi post ({myPosts.length})
          </h3>
          {myPosts.length === 0 ? (
            <p className="text-xs text-neutral-600 border border-dashed border-neutral-400 p-3">
              Non hai ancora pubblicato ricette. Usa "Nuovo post" per iniziare.
            </p>
          ) : (
            <div className="space-y-2">
              {myPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onOpenRicetta(post.id)}
                  className="w-full text-left border border-black p-2.5 flex items-center gap-2.5 hover:bg-neutral-100 cursor-pointer"
                >
                  <WireframeMedia
                    variant={post.hasVideo ? 'video' : 'photo'}
                    label={post.piatto}
                    className="w-16 h-14 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-black truncate">
                      {post.titolo}
                    </p>
                    <p className="text-[11px] text-neutral-600 truncate">
                      {post.luogoNome}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
