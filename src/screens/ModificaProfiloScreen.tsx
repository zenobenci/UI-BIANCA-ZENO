import { FormEvent, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { ImpostazioneProfilo, Utente } from '../types';

interface ModificaProfiloScreenProps {
  me: Utente;
  settings: ImpostazioneProfilo[];
  onBack: () => void;
  onUpdateProfile: (nome: string, bio: string, avatarLabel: string) => void;
  onToggleSetting: (settingId: string) => void;
}

const AVATAR_OPTIONS = ['MC', 'CHEF', 'MR', 'X'];

export function ModificaProfiloScreen({
  me,
  settings,
  onBack,
  onUpdateProfile,
  onToggleSetting,
}: ModificaProfiloScreenProps) {
  const [nome, setNome] = useState(me.nome);
  const [bio, setBio] = useState(me.bio);
  const [avatarLabel, setAvatarLabel] = useState(me.avatarLabel);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const cycleAvatar = () => {
    const idx = AVATAR_OPTIONS.indexOf(avatarLabel);
    const next = AVATAR_OPTIONS[(idx + 1) % AVATAR_OPTIONS.length];
    setAvatarLabel(next);
    setSavedFeedback(false);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile(
      nome.trim() || me.nome,
      bio.trim() || me.bio,
      avatarLabel
    );
    setSavedFeedback(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Modifica profilo" onBack={onBack} />

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-5">
        {/* Modifica foto profilo */}
        <section className="border-2 border-black p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <WireframeMedia
              variant="avatar"
              label={avatarLabel}
              className="w-14 h-14"
            />
            <div>
              <p className="text-xs font-bold text-black">Foto profilo</p>
              <p className="text-[11px] text-neutral-600">
                Segnaposto wireframe
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cycleAvatar}
            className="min-h-[40px] px-3 border border-black bg-white text-black text-xs font-semibold hover:bg-black hover:text-white cursor-pointer"
          >
            Modifica foto profilo
          </button>
        </section>

        {/* Nome e Bio */}
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="edit-nome"
              className="block text-xs font-bold uppercase tracking-wider"
            >
              Nome
            </label>
            <input
              id="edit-nome"
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setSavedFeedback(false);
              }}
              placeholder="Il tuo nome..."
              className="w-full h-[40px] px-2.5 border border-black bg-white text-xs text-black"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="edit-bio"
              className="block text-xs font-bold uppercase tracking-wider"
            >
              Bio
            </label>
            <textarea
              id="edit-bio"
              rows={3}
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setSavedFeedback(false);
              }}
              className="w-full p-2.5 border border-black bg-white text-xs text-black resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-neutral-600">
              {savedFeedback ? 'Modifiche salvate ✓' : ''}
            </span>
            <button
              type="submit"
              className="min-h-[38px] px-4 border border-black bg-black text-white text-xs font-semibold cursor-pointer"
            >
              Salva profilo
            </button>
          </div>
        </form>

        {/* Vari settings */}
        <section aria-label="Vari settings" className="space-y-2 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            Vari settings
          </h2>
          <div className="space-y-2">
            {settings.map((item) => (
              <div
                key={item.id}
                className="border border-black p-2.5 flex items-center justify-between gap-3 bg-white"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-black">{item.label}</p>
                  <p className="text-[11px] text-neutral-600">
                    {item.descrizione}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.attiva}
                  onClick={() => onToggleSetting(item.id)}
                  className={`min-w-[54px] min-h-[32px] px-2 border border-black text-[11px] font-mono-wf font-bold shrink-0 cursor-pointer ${
                    item.attiva
                      ? 'bg-black text-white'
                      : 'bg-neutral-200 text-black'
                  }`}
                >
                  {item.attiva ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
