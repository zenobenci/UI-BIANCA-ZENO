import { FormEvent, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Luogo } from '../types';

interface NuovoPostScreenProps {
  luoghi: Luogo[];
  onBack: () => void;
  onPublish: (data: {
    titolo: string;
    descrizione: string;
    luogoId: string;
    hasPhoto: boolean;
    hasVideo: boolean;
  }) => void;
}

export function NuovoPostScreen({
  luoghi,
  onBack,
  onPublish,
}: NuovoPostScreenProps) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [luogoId, setLuogoId] = useState(luoghi[0]?.id || 'roma');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onPublish({
      titolo: titolo.trim() || 'Nuova ricetta fatta in casa',
      descrizione:
        descrizione.trim() ||
        'Ricetta tradizionale preparata con ingredienti locali selezionati.',
      luogoId,
      hasPhoto: hasPhoto || !hasVideo,
      hasVideo,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Nuovo post" onBack={onBack} />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto wf-scroll p-3 space-y-3.5"
      >
        {/* Aggiungi foto & Video */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <WireframeMedia
              variant="photo"
              label={hasPhoto ? 'FOTO AGGIUNTA' : 'NESSUNA FOTO'}
              className={`w-full h-24 ${
                hasPhoto ? 'border-2 border-black' : 'opacity-80'
              }`}
            />
            <button
              type="button"
              onClick={() => setHasPhoto((v) => !v)}
              className={`w-full min-h-[38px] px-2 border border-black text-xs font-semibold cursor-pointer ${
                hasPhoto
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {hasPhoto ? 'Foto aggiunta ✓' : 'Aggiungi foto'}
            </button>
          </div>

          <div className="space-y-1.5">
            <WireframeMedia
              variant="video"
              label={hasVideo ? 'VIDEO AGGIUNTO' : 'NESSUN VIDEO'}
              className={`w-full h-24 ${
                hasVideo ? 'border-2 border-black' : 'opacity-80'
              }`}
            />
            <button
              type="button"
              onClick={() => setHasVideo((v) => !v)}
              className={`w-full min-h-[38px] px-2 border border-black text-xs font-semibold cursor-pointer ${
                hasVideo
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {hasVideo ? 'Video aggiunto ✓' : 'Video'}
            </button>
          </div>
        </div>

        {/* Titolo piatto */}
        <div className="space-y-1">
          <label
            htmlFor="post-titolo"
            className="block text-xs font-bold uppercase tracking-wider"
          >
            Nome piatto
          </label>
          <input
            id="post-titolo"
            type="text"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            placeholder="Es. Pasta all'Amatriciana"
            className="w-full h-[40px] px-3 border border-black bg-white text-xs text-black"
          />
        </div>

        {/* Descrizione */}
        <div className="space-y-1">
          <label
            htmlFor="post-descrizione"
            className="block text-xs font-bold uppercase tracking-wider"
          >
            Descrizione
          </label>
          <textarea
            id="post-descrizione"
            rows={4}
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            placeholder="Descrivi ingredienti, dosi e segreti della ricetta..."
            className="w-full p-3 border border-black bg-white text-xs text-black resize-none"
          />
        </div>

        {/* Luogo */}
        <div className="space-y-1">
          <label
            htmlFor="post-luogo"
            className="block text-xs font-bold uppercase tracking-wider"
          >
            Luogo
          </label>
          <select
            id="post-luogo"
            value={luogoId}
            onChange={(e) => setLuogoId(e.target.value)}
            className="w-full h-[40px] px-3 border border-black bg-white text-xs text-black"
          >
            {luoghi.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome} ({l.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Bottone Pubblica */}
        <button
          type="submit"
          className="w-full min-h-[46px] px-4 py-2.5 border-2 border-black bg-black text-white text-sm font-bold hover:bg-neutral-800 cursor-pointer"
        >
          Pubblica
        </button>
      </form>
    </div>
  );
}
