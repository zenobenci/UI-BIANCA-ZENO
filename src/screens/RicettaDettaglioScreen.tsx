import { FormEvent, useRef, useState } from 'react';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta, Utente } from '../types';

interface RicettaDettaglioScreenProps {
  ricetta: Ricetta;
  autore?: Utente;
  isLiked: boolean;
  isSaved: boolean;
  onBack: () => void;
  onToggleLike: (ricettaId: string) => void;
  onToggleSave: (ricettaId: string) => void;
  onAddComment: (ricettaId: string, testo: string) => void;
  onOpenProfilo: (utenteId: string) => void;
}

export function RicettaDettaglioScreen({
  ricetta,
  autore,
  isLiked,
  isSaved,
  onBack,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onOpenProfilo,
}: RicettaDettaglioScreenProps) {
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommentButton = () => {
    setShowCommentBox(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(ricetta.id, trimmed);
    setCommentText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={ricetta.piatto} onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        <WireframeMedia
          variant={ricetta.hasVideo ? 'video' : 'photo'}
          label={ricetta.hasVideo ? 'VIDEO RICETTA' : 'FOTO PIATTO'}
          className="w-full h-40"
        />

        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-black leading-tight">
            {ricetta.titolo}
          </h2>
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-600">
            <span>{ricetta.luogoNome}</span>
            {autore && (
              <button
                type="button"
                onClick={() => onOpenProfilo(autore.id)}
                className="underline font-semibold text-black hover:text-neutral-600 cursor-pointer"
              >
                {autore.username}
              </button>
            )}
          </div>
          <p className="text-xs text-neutral-800 leading-relaxed pt-1">
            {ricetta.descrizione}
          </p>
        </div>

        {/* Azioni: Like - Salva - Commenta */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-black">
          <button
            type="button"
            onClick={() => onToggleLike(ricetta.id)}
            className={`min-h-[40px] px-2 border border-black text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
              isLiked
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
            <span>Like ({ricetta.likes + (isLiked ? 1 : 0)})</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleSave(ricetta.id)}
            className={`min-h-[40px] px-2 border border-black text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
              isSaved
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`}
            />
            <span>{isSaved ? 'Salvata' : 'Salva'}</span>
          </button>

          <button
            type="button"
            onClick={handleCommentButton}
            className="min-h-[40px] px-2 border border-black bg-white text-black text-xs font-semibold flex items-center justify-center gap-1 hover:bg-neutral-100 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Commenta</span>
          </button>
        </div>

        {/* Ingredienti */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Ingredienti
          </h3>
          <ul className="border border-black bg-neutral-50 p-2.5 space-y-1 text-xs text-black">
            {ricetta.ingredienti.map((ing, idx) => (
              <li key={idx}>• {ing}</li>
            ))}
          </ul>
        </section>

        {/* Procedimento */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Preparazione
          </h3>
          <ol className="space-y-1.5 text-xs text-neutral-800">
            {ricetta.passaggi.map((step, idx) => (
              <li key={idx} className="border-l-2 border-black pl-2.5 py-0.5">
                <span className="font-bold">{idx + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Commenti */}
        {showCommentBox && (
          <section className="space-y-2 pt-2 border-t border-black">
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Commenti ({ricetta.commenti.length})
            </h3>
            <form onSubmit={handleSubmitComment} className="flex gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Scrivi un commento..."
                className="flex-1 h-[38px] px-2.5 border border-black bg-white text-xs text-black"
              />
              <button
                type="submit"
                className="h-[38px] px-3 border border-black bg-black text-white text-xs font-semibold cursor-pointer"
              >
                Invia
              </button>
            </form>

            <div className="space-y-2">
              {ricetta.commenti.length === 0 ? (
                <p className="text-[11px] text-neutral-500">
                  Nessun commento ancora. Scrivi il primo!
                </p>
              ) : (
                ricetta.commenti.map((c) => (
                  <div
                    key={c.id}
                    className="border border-neutral-400 bg-neutral-50 p-2 space-y-0.5"
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
          </section>
        )}
      </div>
    </div>
  );
}
