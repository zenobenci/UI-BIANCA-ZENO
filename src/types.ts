export type TabId = 'mappa' | 'profilo' | 'messaggi';

export type ScreenRoute =
  | { name: 'mappa' }
  | { name: 'luogo-panel'; luogoId: string }
  | { name: 'lista-post-cercati'; query: string }
  | { name: 'ricetta-dettaglio'; ricettaId: string }
  | { name: 'profilo-utente'; utenteId: string }
  | { name: 'profilo-personale' }
  | { name: 'post-salvati' }
  | { name: 'nuovo-post' }
  | { name: 'modifica-profilo' }
  | { name: 'lista-chat' }
  | { name: 'chat-dettaglio'; chatId: string }
  | { name: 'create-groupchat' };

export type TipoLuogo = 'Città' | 'Regione' | 'Paese';

export interface Luogo {
  id: string;
  nome: string;
  tipo: TipoLuogo;
  sottotitolo: string;
  x: number; // percentuale 0-100 su mappa
  y: number; // percentuale 0-100 su mappa
}

export interface Utente {
  id: string;
  nome: string;
  username: string;
  bio: string;
  citta: string;
  luogoId: string;
  isLocalLegend: boolean;
  avatarLabel: string;
}

export interface Commento {
  id: string;
  autoreNome: string;
  testo: string;
  ora: string;
}

export interface Ricetta {
  id: string;
  titolo: string;
  piatto: string;
  descrizione: string;
  ingredienti: string[];
  passaggi: string[];
  luogoId: string;
  luogoNome: string;
  autoreId: string;
  likes: number;
  hasVideo?: boolean;
  commenti: Commento[];
}

export interface MessaggioChat {
  id: string;
  mittenteId: string;
  mittenteNome: string;
  tipo: 'testo' | 'foto' | 'ricetta';
  testo?: string;
  ricettaId?: string;
  ricettaTitolo?: string;
  ora: string;
}

export interface Chat {
  id: string;
  nome: string;
  isGroup: boolean;
  partecipantiIds: string[];
  messaggi: MessaggioChat[];
}

export interface ImpostazioneProfilo {
  id: string;
  label: string;
  descrizione: string;
  attiva: boolean;
}
