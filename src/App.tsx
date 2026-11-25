/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import {
  CURRENT_USER_ID,
  INITIAL_CHATS,
  INITIAL_FOLLOWING_IDS,
  INITIAL_LIKED_IDS,
  INITIAL_LUOGHI,
  INITIAL_ME,
  INITIAL_RICETTE,
  INITIAL_SAVED_IDS,
  INITIAL_SETTINGS,
  INITIAL_UTENTI,
} from './data/mockData';
import { ChatDettaglioScreen } from './screens/ChatDettaglioScreen';
import { CreateGroupchatScreen } from './screens/CreateGroupchatScreen';
import { ListaChatScreen } from './screens/ListaChatScreen';
import { ListaPostCercatiScreen } from './screens/ListaPostCercatiScreen';
import { LuogoPanelScreen } from './screens/LuogoPanelScreen';
import { MappaScreen } from './screens/MappaScreen';
import { ModificaProfiloScreen } from './screens/ModificaProfiloScreen';
import { NuovoPostScreen } from './screens/NuovoPostScreen';
import { PostSalvatiScreen } from './screens/PostSalvatiScreen';
import { ProfiloPersonaleScreen } from './screens/ProfiloPersonaleScreen';
import { ProfiloUtenteScreen } from './screens/ProfiloUtenteScreen';
import { ReelScreen } from './screens/ReelScreen';
import { RicettaDettaglioScreen } from './screens/RicettaDettaglioScreen';
import { StoriaPiattoScreen } from './screens/StoriaPiattoScreen';
import {
  Chat,
  ImpostazioneProfilo,
  Ricetta,
  ScreenRoute,
  TabId,
  Utente,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('mappa');
  const [tabStacks, setTabStacks] = useState<Record<TabId, ScreenRoute[]>>({
    profilo: [{ name: 'profilo-personale' }],
    mappa: [{ name: 'mappa' }],
    reel: [{ name: 'reel' }],
    messaggi: [{ name: 'lista-chat' }],
  });

  const [me, setMe] = useState<Utente>(INITIAL_ME);
  const [ricette, setRicette] = useState<Ricetta[]>(INITIAL_RICETTE);
  const [likedIds, setLikedIds] = useState<string[]>(INITIAL_LIKED_IDS);
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED_IDS);
  const [followingIds, setFollowingIds] = useState<string[]>(
    INITIAL_FOLLOWING_IDS
  );
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [settings, setSettings] =
    useState<ImpostazioneProfilo[]>(INITIAL_SETTINGS);

  const utentiMap = useMemo(() => {
    const map: Record<string, Utente> = { [me.id]: me };
    INITIAL_UTENTI.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [me]);

  const luoghiMap = useMemo(() => {
    const map: Record<string, (typeof INITIAL_LUOGHI)[number]> = {};
    INITIAL_LUOGHI.forEach((l) => {
      map[l.id] = l;
    });
    return map;
  }, []);

  const currentStack = tabStacks[activeTab];
  const currentRoute = currentStack[currentStack.length - 1];

  const pushRoute = (route: ScreenRoute, targetTab: TabId = activeTab) => {
    setTabStacks((prev) => ({
      ...prev,
      [targetTab]: [...prev[targetTab], route],
    }));
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  };

  const popRoute = () => {
    setTabStacks((prev) => {
      const stack = prev[activeTab];
      if (stack.length <= 1) return prev;
      return {
        ...prev,
        [activeTab]: stack.slice(0, -1),
      };
    });
  };

  const handleSelectTab = (tab: TabId) => {
    if (tab === activeTab) {
      // Tornare alla schermata principale della tab toccando di nuovo la tab attiva
      setTabStacks((prev) => ({
        ...prev,
        [tab]: [prev[tab][0]],
      }));
    } else {
      setActiveTab(tab);
    }
  };

  const handleToggleLike = (ricettaId: string) => {
    setLikedIds((prev) =>
      prev.includes(ricettaId)
        ? prev.filter((id) => id !== ricettaId)
        : [...prev, ricettaId]
    );
  };

  const handleToggleSave = (ricettaId: string) => {
    setSavedIds((prev) =>
      prev.includes(ricettaId)
        ? prev.filter((id) => id !== ricettaId)
        : [...prev, ricettaId]
    );
  };

  const handleToggleFollow = (utenteId: string) => {
    if (utenteId === CURRENT_USER_ID) return;
    setFollowingIds((prev) =>
      prev.includes(utenteId)
        ? prev.filter((id) => id !== utenteId)
        : [...prev, utenteId]
    );
  };

  const handleAddComment = (ricettaId: string, testo: string) => {
    setRicette((prev) =>
      prev.map((r) =>
        r.id === ricettaId
          ? {
              ...r,
              commenti: [
                ...r.commenti,
                {
                  id: `c-${Date.now()}`,
                  autoreNome: me.nome,
                  testo,
                  ora: 'Adesso',
                },
              ],
            }
          : r
      )
    );
  };

  const handlePublishPost = (data: {
    titolo: string;
    descrizione: string;
    luogoId: string;
    hasPhoto: boolean;
    hasVideo: boolean;
  }) => {
    const luogo = luoghiMap[data.luogoId];
    const nuovaRicetta: Ricetta = {
      id: `r-${Date.now()}`,
      titolo: data.titolo,
      piatto: data.titolo.split(' ')[0] || 'Ricetta',
      descrizione: data.descrizione,
      ingredienti: [
        'Ingredienti freschi di stagione',
        'Olio extravergine d’oliva',
        'Sale e pepe q.b.',
      ],
      passaggi: [data.descrizione],
      luogoId: data.luogoId,
      regioneId:
        luogo?.tipo === 'Regione' ? luogo.id : luogo?.regioneId,
      luogoNome: luogo ? `${luogo.nome}, ${luogo.sottotitolo}` : 'Italia',
      autoreId: CURRENT_USER_ID,
      likes: 0,
      saves: 0,
      hasVideo: data.hasVideo,
      commenti: [],
    };
    setRicette((prev) => [nuovaRicetta, ...prev]);
    popRoute();
  };

  const handleUpdatePost = (
    ricettaId: string,
    data: { titolo: string; descrizione: string; luogoId: string }
  ) => {
    const luogo = luoghiMap[data.luogoId];
    setRicette((prev) =>
      prev.map((r) =>
        r.id === ricettaId
          ? {
              ...r,
              titolo: data.titolo,
              piatto: data.titolo.split(' ')[0] || r.piatto,
              descrizione: data.descrizione,
              luogoId: data.luogoId,
              regioneId:
                luogo?.tipo === 'Regione' ? luogo.id : luogo?.regioneId,
              luogoNome: luogo
                ? `${luogo.nome}, ${luogo.sottotitolo}`
                : r.luogoNome,
            }
          : r
      )
    );
  };

  const handleDeletePost = (ricettaId: string) => {
    setRicette((prev) => prev.filter((r) => r.id !== ricettaId));
  };

  const handleUpdateProfile = (
    nome: string,
    bio: string,
    avatarLabel: string
  ) => {
    setMe((prev) => ({ ...prev, nome, bio, avatarLabel }));
  };

  const handleToggleSetting = (settingId: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === settingId ? { ...s, attiva: !s.attiva } : s))
    );
  };

  const handleOpenTextChat = (utenteId: string) => {
    const targetUser = utentiMap[utenteId];
    if (!targetUser) return;

    const existing = chats.find(
      (c) => !c.isGroup && c.partecipantiIds.includes(utenteId)
    );

    if (existing) {
      pushRoute({ name: 'chat-dettaglio', chatId: existing.id });
      return;
    }

    const newChat: Chat = {
      id: `chat-${utenteId}-${Date.now()}`,
      nome: targetUser.nome,
      isGroup: false,
      partecipantiIds: [CURRENT_USER_ID, utenteId],
      messaggi: [],
    };
    setChats((prev) => [newChat, ...prev]);
    pushRoute({ name: 'chat-dettaglio', chatId: newChat.id });
  };

  const handleSendMessage = (
    chatId: string,
    payload: {
      tipo: 'testo' | 'foto' | 'ricetta';
      testo?: string;
      ricettaId?: string;
      ricettaTitolo?: string;
    }
  ) => {
    const now = new Date();
    const ora = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messaggi: [
                ...c.messaggi,
                {
                  id: `m-${Date.now()}`,
                  mittenteId: CURRENT_USER_ID,
                  mittenteNome: me.nome,
                  ora,
                  ...payload,
                },
              ],
            }
          : c
      )
    );
  };

  const handleCreateGroupchat = (nomeGruppo: string, membriIds: string[]) => {
    const newGroup: Chat = {
      id: `chat-grp-${Date.now()}`,
      nome: nomeGruppo,
      isGroup: true,
      partecipantiIds: [CURRENT_USER_ID, ...membriIds],
      messaggi: [
        {
          id: `m-${Date.now()}`,
          mittenteId: CURRENT_USER_ID,
          mittenteNome: me.nome,
          tipo: 'testo',
          testo: `Gruppo "${nomeGruppo}" creato!`,
          ora: 'Adesso',
        },
      ],
    };
    setChats((prev) => [newGroup, ...prev]);
    setTabStacks((prev) => ({
      ...prev,
      messaggi: [
        { name: 'lista-chat' },
        { name: 'chat-dettaglio', chatId: newGroup.id },
      ],
    }));
    setActiveTab('messaggi');
  };

  const savedRicette = useMemo(
    () => ricette.filter((r) => savedIds.includes(r.id)),
    [ricette, savedIds]
  );

  const myPosts = useMemo(
    () => ricette.filter((r) => r.autoreId === CURRENT_USER_ID),
    [ricette]
  );

  const renderScreen = () => {
    switch (currentRoute.name) {
      case 'mappa':
        return (
          <MappaScreen
            luoghi={INITIAL_LUOGHI}
            onSelectLuogo={(luogoId) =>
              pushRoute({ name: 'luogo-panel', luogoId })
            }
            onSearch={(query) =>
              pushRoute({ name: 'lista-post-cercati', query })
            }
          />
        );

      case 'reel': {
        const videoReels = ricette.filter((r) => r.hasVideo);
        return (
          <ReelScreen
            reels={videoReels.length > 0 ? videoReels : ricette}
            utentiMap={utentiMap}
            likedIds={likedIds}
            savedIds={savedIds}
            followingIds={followingIds}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onToggleFollow={handleToggleFollow}
            onAddComment={handleAddComment}
            onOpenProfilo={(utenteId) =>
              pushRoute({ name: 'profilo-utente', utenteId })
            }
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
          />
        );
      }

      case 'luogo-panel': {
        const luogo = luoghiMap[currentRoute.luogoId] || INITIAL_LUOGHI[0];
        const ricetteLuogo =
          luogo.tipo === 'Regione'
            ? ricette.filter(
                (r) => r.luogoId === luogo.id || r.regioneId === luogo.id
              )
            : ricette.filter((r) => r.luogoId === luogo.id);
        const legendsLuogo =
          luogo.tipo === 'Regione'
            ? INITIAL_UTENTI.filter(
                (u) => u.luogoId === luogo.id || u.regioneId === luogo.id
              )
            : INITIAL_UTENTI.filter((u) => u.luogoId === luogo.id);

        const cittaRegione =
          luogo.tipo === 'Regione'
            ? INITIAL_LUOGHI.filter(
                (l) => l.tipo === 'Città' && l.regioneId === luogo.id
              )
            : [];

        return (
          <LuogoPanelScreen
            luogo={luogo}
            cittaRegione={cittaRegione}
            ricette={ricetteLuogo}
            localLegends={legendsLuogo}
            utentiMap={utentiMap}
            likedIds={likedIds}
            savedIds={savedIds}
            onBack={popRoute}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
            onOpenProfilo={(utenteId) =>
              pushRoute({ name: 'profilo-utente', utenteId })
            }
            onSelectLuogo={(luogoId) =>
              pushRoute({ name: 'luogo-panel', luogoId })
            }
          />
        );
      }

      case 'lista-post-cercati':
        return (
          <ListaPostCercatiScreen
            initialQuery={currentRoute.query}
            ricette={ricette}
            utentiMap={utentiMap}
            onBack={popRoute}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
            onOpenProfilo={(utenteId) =>
              pushRoute({ name: 'profilo-utente', utenteId })
            }
          />
        );

      case 'ricetta-dettaglio': {
        const ricetta =
          ricette.find((r) => r.id === currentRoute.ricettaId) || ricette[0];
        return (
          <RicettaDettaglioScreen
            ricetta={ricetta}
            autore={utentiMap[ricetta.autoreId]}
            isLiked={likedIds.includes(ricetta.id)}
            isSaved={savedIds.includes(ricetta.id)}
            onBack={popRoute}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onAddComment={handleAddComment}
            onOpenProfilo={(utenteId) =>
              pushRoute({ name: 'profilo-utente', utenteId })
            }
            onOpenStoria={(ricettaId) =>
              pushRoute({ name: 'storia-piatto', ricettaId })
            }
          />
        );
      }

      case 'storia-piatto': {
        const ricetta =
          ricette.find((r) => r.id === currentRoute.ricettaId) || ricette[0];
        return <StoriaPiattoScreen ricetta={ricetta} onBack={popRoute} />;
      }

      case 'profilo-utente': {
        const utente = utentiMap[currentRoute.utenteId] || INITIAL_UTENTI[0];
        const postsUtente = ricette.filter((r) => r.autoreId === utente.id);
        return (
          <ProfiloUtenteScreen
            utente={utente}
            posts={postsUtente}
            likedIds={likedIds}
            isFollowing={followingIds.includes(utente.id)}
            onBack={popRoute}
            onToggleFollow={handleToggleFollow}
            onToggleLike={handleToggleLike}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
            onOpenTextChat={handleOpenTextChat}
          />
        );
      }

      case 'profilo-personale':
        return (
          <ProfiloPersonaleScreen
            me={me}
            savedCount={savedRicette.length}
            myPosts={myPosts}
            likedIds={likedIds}
            savedIds={savedIds}
            luoghi={INITIAL_LUOGHI}
            onOpenPostSalvati={() => pushRoute({ name: 'post-salvati' })}
            onOpenNuovoPost={() => pushRoute({ name: 'nuovo-post' })}
            onOpenModificaProfilo={() => pushRoute({ name: 'modifica-profilo' })}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
          />
        );

      case 'post-salvati':
        return (
          <PostSalvatiScreen
            savedRicette={savedRicette}
            utentiMap={utentiMap}
            likedIds={likedIds}
            followingIds={followingIds}
            onBack={popRoute}
            onToggleLike={handleToggleLike}
            onToggleFollow={handleToggleFollow}
            onOpenTextChat={handleOpenTextChat}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
          />
        );

      case 'nuovo-post':
        return (
          <NuovoPostScreen
            luoghi={INITIAL_LUOGHI}
            onBack={popRoute}
            onPublish={handlePublishPost}
          />
        );

      case 'modifica-profilo':
        return (
          <ModificaProfiloScreen
            me={me}
            settings={settings}
            onBack={popRoute}
            onUpdateProfile={handleUpdateProfile}
            onToggleSetting={handleToggleSetting}
          />
        );

      case 'lista-chat':
        return (
          <ListaChatScreen
            chats={chats}
            onOpenChat={(chatId) =>
              pushRoute({ name: 'chat-dettaglio', chatId })
            }
            onOpenCreateGroupchat={() =>
              pushRoute({ name: 'create-groupchat' })
            }
          />
        );

      case 'chat-dettaglio': {
        const chat = chats.find((c) => c.id === currentRoute.chatId) || chats[0];
        return (
          <ChatDettaglioScreen
            chat={chat}
            savedRicette={savedRicette}
            onBack={popRoute}
            onSendMessage={handleSendMessage}
            onOpenRicetta={(ricettaId) =>
              pushRoute({ name: 'ricetta-dettaglio', ricettaId })
            }
          />
        );
      }

      case 'create-groupchat':
        return (
          <CreateGroupchatScreen
            utenti={INITIAL_UTENTI}
            onBack={popRoute}
            onCreateGroup={handleCreateGroupchat}
          />
        );
    }
  };

  return (
    <main className="wireframe-canvas min-h-dvh w-full flex items-center justify-center p-3 sm:p-5">
      {/* Cornice iPhone 11 (414 x 896) centrata in bianco e nero */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width:
            'min(414px, calc((100dvh - 36px) * 414 / 896), calc(100vw - 24px))',
        }}
      >
        {/* Tasti hardware wireframe */}
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[13%] w-[4px] h-[3.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[20%] w-[4px] h-[6.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -left-[5px] top-[28%] w-[4px] h-[6.2%] border-2 border-r-0 border-black bg-white rounded-l-sm"
        />
        <div
          aria-hidden="true"
          className="absolute -right-[5px] top-[22%] w-[4px] h-[9.5%] border-2 border-l-0 border-black bg-white rounded-r-sm"
        />

        {/* Scocca esterna iPhone 11 */}
        <div className="w-full aspect-[414/896] rounded-[46px] border-2 border-black bg-white p-2.5 shadow-[8px_8px_0_0_#000000]">
          {/* Schermo interno 414x896 */}
          <div className="relative w-full h-full rounded-[36px] border-2 border-black bg-white overflow-hidden flex flex-col">
            {/* Notch wireframe */}
            <div
              aria-hidden="true"
              className="w-full flex justify-center shrink-0 bg-white"
            >
              <div className="w-[48%] h-[24px] border-2 border-t-0 border-black rounded-b-[16px] bg-white flex items-center justify-center gap-2">
                <span className="w-9 h-[3px] border border-black rounded-full bg-white" />
                <span className="w-2 h-2 border border-black rounded-full bg-white" />
              </div>
            </div>

            {/* Area schermata corrente */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {renderScreen()}
            </div>

            {/* Barra di navigazione fissa in basso con 3 tab */}
            <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

            {/* Home indicator iPhone 11 */}
            <div
              aria-hidden="true"
              className="w-full py-1.5 flex justify-center shrink-0 bg-white"
            >
              <div className="w-[34%] h-[4px] bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
