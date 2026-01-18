
export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
