export interface Message {
  id: string;
  role: string;
  content: string;
  conversationId: string | null;
  createdAt: Date;
  userId: string;
}

export interface Conversation {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  messages: Message[];
}

export type Role = "user" | "assistant" | "system";

export interface User {
  id: string;
  name: string | null;
  email: string;
}
