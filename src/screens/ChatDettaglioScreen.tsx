import { FormEvent, useState } from 'react';
import { Bookmark, Image as ImageIcon, Send } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { WireframeMedia } from '../components/WireframeMedia';
import { CURRENT_USER_ID } from '../data/mockData';
import { Chat, Ricetta } from '../types';

interface ChatDettaglioScreenProps {
  chat: Chat;
  savedRicette: Ricetta[];
  onBack: () => void;
  onSendMessage: (
    chatId: string,
    payload: {
      tipo: 'testo' | 'foto' | 'ricetta';
      testo?: string;
      ricettaId?: string;
      ricettaTitolo?: string;
    }
  ) => void;
  onOpenRicetta: (ricettaId: string) => void;
}

export function ChatDettaglioScreen({
  chat,
  savedRicette,
  onBack,
  onSendMessage,
  onOpenRicetta,
}: ChatDettaglioScreenProps) {
  const [text, setText] = useState('');
  const [showSavedPicker, setShowSavedPicker] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(chat.id, { tipo: 'testo', testo: trimmed });
    setText('');
  };

  const handleSendPicture = () => {
    onSendMessage(chat.id, {
      tipo: 'foto',
      testo: 'Foto piatto condivisa',
    });
  };

  const handlePickSavedRecipe = (ricetta: Ricetta) => {
    onSendMessage(chat.id, {
      tipo: 'ricetta',
      ricettaId: ricetta.id,
      ricettaTitolo: ricetta.titolo,
    });
    setShowSavedPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title={chat.nome} onBack={onBack} />

      {/* Elenco messaggi */}
      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-2.5 bg-neutral-50">
        {chat.messaggi.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-6">
            Inizia la conversazione scrivendo un messaggio.
          </p>
        ) : (
          chat.messaggi.map((msg) => {
            const isMine = msg.mittenteId === CURRENT_USER_ID;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMine ? 'items-end' : 'items-start'
                }`}
              >
                {!isMine && chat.isGroup && (
                  <span className="text-[10px] text-neutral-600 mb-0.5 font-semibold">
                    {msg.mittenteNome}
                  </span>
                )}

                <div
                  className={`max-w-[82%] p-2.5 border border-black text-xs space-y-1.5 ${
                    isMine ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {msg.tipo === 'foto' && (
                    <WireframeMedia
                      variant="photo"
                      label={msg.testo || 'FOTO'}
                      className="w-44 h-24"
                    />
                  )}

                  {msg.tipo === 'ricetta' && msg.ricettaId && (
                    <button
                      type="button"
                      onClick={() => onOpenRicetta(msg.ricettaId!)}
                      className={`w-full text-left border p-2 space-y-1 cursor-pointer ${
                        isMine
                          ? 'border-white bg-neutral-900 text-white'
                          : 'border-black bg-neutral-100 text-black'
                      }`}
                    >
                      <span className="block text-[10px] font-mono-wf uppercase">
                        Ricetta salvata
                      </span>
                      <span className="block text-xs font-bold underline">
                        {msg.ricettaTitolo}
                      </span>
                    </button>
                  )}

                  {msg.tipo === 'testo' && <p>{msg.testo}</p>}

                  <span
                    className={`block text-[9px] text-right ${
                      isMine ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {msg.ora}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selettore ricette salvate quando attivo */}
      {showSavedPicker && (
        <div className="border-t-2 border-black bg-neutral-100 p-2.5 space-y-1.5 max-h-40 overflow-y-auto wf-scroll">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase">
              Seleziona una ricetta salvata
            </p>
            <button
              type="button"
              onClick={() => setShowSavedPicker(false)}
              className="text-[11px] underline font-semibold cursor-pointer"
            >
              Chiudi
            </button>
          </div>
          {savedRicette.length === 0 ? (
            <p className="text-[11px] text-neutral-600">
              Non hai ancora ricette salvate.
            </p>
          ) : (
            <div className="space-y-1">
              {savedRicette.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handlePickSavedRecipe(r)}
                  className="w-full text-left px-2.5 py-1.5 border border-black bg-white text-xs font-semibold hover:bg-black hover:text-white cursor-pointer"
                >
                  {r.titolo}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Barra inferiore: Send pictures, Send ricette salvate + Barra messaggio */}
      <div className="shrink-0 border-t-2 border-black bg-white p-2.5 space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={handleSendPicture}
            className="min-h-[36px] px-2 border border-black bg-white text-black text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-neutral-100 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Send pictures</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSavedPicker((v) => !v)}
            className={`min-h-[36px] px-2 border border-black text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer ${
              showSavedPicker
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Send ricette salvate</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Barra messaggio..."
            aria-label="Barra messaggio"
            className="flex-1 h-[40px] px-2.5 border border-black bg-white text-xs text-black"
          />
          <button
            type="submit"
            aria-label="Invia messaggio"
            className="h-[40px] px-3 border border-black bg-black text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invia</span>
          </button>
        </form>
      </div>
    </div>
  );
}
