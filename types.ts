
export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id:string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export type Theme = 'light' | 'dark';

export enum GeminiLiveStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  LISTENING = 'LISTENING',
  ERROR = 'ERROR',
}
