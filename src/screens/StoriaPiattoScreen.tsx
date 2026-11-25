import { BookOpen } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { Ricetta } from '../types';

interface StoriaPiattoScreenProps {
  ricetta: Ricetta;
  onBack: () => void;
}

export function StoriaPiattoScreen({
  ricetta,
  onBack,
}: StoriaPiattoScreenProps) {
  const storia = ricetta.storia;

  if (!storia) {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <TopBar title="Storia del piatto" onBack={onBack} />
        <div className="flex-1 p-4 flex items-center justify-center">
          <p className="text-xs text-neutral-600 border border-dashed border-black p-4 text-center">
            Articolo storico non disponibile per questo piatto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={`Storia · ${ricetta.piatto}`} onBack={onBack} />

      <article className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Testata articolo degli esperti dell'app */}
        <header className="border-2 border-black bg-neutral-100 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono-wf uppercase text-neutral-600">
            <span className="flex items-center gap-1 font-bold text-black">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Archivio Esperti</span>
            </span>
            <span>{storia.epocaOrigine}</span>
          </div>

          <h2 className="text-base font-bold text-black leading-snug">
            {storia.titolo}
          </h2>

          <div className="border-t border-black pt-2 flex items-center gap-2">
            <WireframeMedia
              variant="avatar"
              label="EXP"
              className="w-8 h-8"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-black truncate">
                {storia.espertoNome}
              </p>
              <p className="text-[10px] text-neutral-600 truncate">
                {storia.ruoloEsperto}
              </p>
            </div>
          </div>
        </header>

        {/* Sezioni dell'articolo con immagini segnaposto */}
        <div className="space-y-4 pb-3">
          {storia.sezioni.map((sezione, idx) => (
            <section key={idx} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
                {sezione.sottotitolo}
              </h3>

              {sezione.immagineLabel && (
                <figure className="space-y-1">
                  <WireframeMedia
                    variant="photo"
                    label={sezione.immagineLabel}
                    className="w-full h-36"
                  />
                  {sezione.didascalia && (
                    <figcaption className="text-[10px] font-mono-wf text-neutral-600">
                      {sezione.didascalia}
                    </figcaption>
                  )}
                </figure>
              )}

              <p className="text-xs text-neutral-900 leading-relaxed">
                {sezione.testo}
              </p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
