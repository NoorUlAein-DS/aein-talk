
import type { Message, Chat, AuthResponse } from "./types";

// In production, the backend and frontend are on the same domain or relative path
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
  ? '/api' 
  : 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Login failed');
  }
  return await response.json();
};

export const register = async (username: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Registration failed');
  }
};

export const fetchAllChats = async (): Promise<Chat[]> => {
  const response = await fetch(`${API_BASE_URL}/chats`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch chats');
  return await response.json();
};

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return await response.json();
};

export const sendMessageToBackend = async (chatId: string, chatTitle: string, message: string): Promise<{ userMessage: Message, aiMessage: Message }> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ chatId, chatTitle, message })
  });
  if (!response.ok) throw new Error('Failed to send message');
  return await response.json();
};

export const deleteChatFromBackend = async (chatId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, { 
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete chat');
};
