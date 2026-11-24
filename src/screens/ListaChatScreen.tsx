import { Users } from 'lucide-react';
import { WireframeMedia } from '../components/WireframeMedia';
import { Chat } from '../types';

interface ListaChatScreenProps {
  chats: Chat[];
  onOpenChat: (chatId: string) => void;
  onOpenCreateGroupchat: () => void;
}

export function ListaChatScreen({
  chats,
  onOpenChat,
  onOpenCreateGroupchat,
}: ListaChatScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <header className="shrink-0 bg-white border-b-2 border-black px-3 py-2.5">
        <h1 className="text-sm font-bold text-black">Lista chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto wf-scroll p-3 space-y-4">
        {/* Bottone Create groupchat */}
        <button
          type="button"
          onClick={onOpenCreateGroupchat}
          className="w-full min-h-[46px] px-3.5 py-2.5 border-2 border-black bg-black text-white flex items-center justify-between hover:bg-neutral-800 cursor-pointer"
        >
          <span className="flex items-center gap-2 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>Create groupchat</span>
          </span>
          <span className="text-xs font-mono-wf">+ Nuovo gruppo</span>
        </button>

        {/* Sezione Chat recenti */}
        <section aria-label="Chat recenti" className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-1">
            Chat recenti
          </h2>

          <div className="space-y-2">
            {chats.map((chat) => {
              const ultimo = chat.messaggi[chat.messaggi.length - 1];
              const preview = ultimo
                ? ultimo.tipo === 'foto'
                  ? '[Foto allegata]'
                  : ultimo.tipo === 'ricetta'
                  ? `[Ricetta: ${ultimo.ricettaTitolo}]`
                  : ultimo.testo
                : 'Nessun messaggio';

              const avatarCode = chat.isGroup
                ? 'GRP'
                : chat.nome
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onOpenChat(chat.id)}
                  className="w-full text-left border-2 border-black bg-white p-2.5 flex items-center justify-between gap-2.5 hover:bg-neutral-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <WireframeMedia
                      variant="avatar"
                      label={avatarCode}
                      className="w-11 h-11"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-black truncate">
                        {chat.nome}
                      </p>
                      <p className="text-[11px] text-neutral-600 truncate">
                        {preview}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-wf text-neutral-500 shrink-0">
                    {ultimo?.ora || 'Ora'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
