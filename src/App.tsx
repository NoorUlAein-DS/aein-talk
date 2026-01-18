
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Auth from './components/Auth';
import type { Chat, Message, User } from './types';
import * as api from './geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load chats when user logs in
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const data = await api.fetchAllChats();
      setChats(data);
      // Auto-select first chat if none selected
      if (data.length > 0 && !activeChatId) {
        handleSelectChat(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setChats([]);
    setActiveChatId(null);
    setActiveMessages([]);
  };

  const handleSelectChat = async (id: string) => {
    setActiveChatId(id);
    setIsSidebarOpen(false);
    try {
      const messages = await api.fetchMessages(id);
      setActiveMessages(messages);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setActiveMessages([]);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = async (id: string) => {
    try {
      await api.deleteChatFromBackend(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSendMessage = async (text: string) => {
    let currentId = activeChatId || Date.now().toString();
    const isNew = !activeChatId;
    const title = isNew ? (text.length > 30 ? text.substring(0, 30) + '...' : text) : '';

    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setActiveMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const { userMessage, aiMessage } = await api.sendMessageToBackend(currentId, title, text);
      
      setActiveMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id);
        return [...filtered, userMessage, aiMessage];
      });

      if (isNew) {
        setActiveChatId(currentId);
        loadChats();
      }
    } catch (err) {
      console.error("Chat failed", err);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#1a0f0a] text-[#f5f1ed] overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        chats={chats}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onLogout={handleLogout}
        username={user.username}
      />

      <ChatWindow 
        messages={activeMessages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        toggleSidebar={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};

export default App;
