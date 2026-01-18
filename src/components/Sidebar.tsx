
import React from 'react';
import type { Chat } from '../types';
import { COFFEE_THEME, Icons } from '../constants';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isOpen: boolean;
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  searchQuery,
  setSearchQuery,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onLogout,
  isOpen,
  username
}) => {
  const filteredChats = chats
    .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 ${COFFEE_THEME.sidebar} backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold text-[#d4a373]">AEIN TALK</h1>
        <button 
          onClick={onNewChat}
          className={`p-2 rounded-full ${COFFEE_THEME.accentBg} text-[#1a0f0a] hover:opacity-90 transition-all shadow-lg`}
        >
          <Icons.Plus />
        </button>
      </div>

      <div className="px-6 mb-4">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Icons.Search />
          </span>
          <input
            type="text"
            placeholder="Search brewing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-[#f5f1ed] focus:outline-none focus:border-[#d4a373]/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
              activeChatId === chat.id 
                ? 'bg-[#d4a373]/20 border border-[#d4a373]/30' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex flex-col overflow-hidden mr-2">
              <span className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-[#d4a373]' : 'text-[#f5f1ed]'}`}>
                {chat.title}
              </span>
              <span className="text-[10px] text-white/40">
                {new Date(chat.updatedAt).toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-white/40 hover:text-red-400"
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#d4a373] flex items-center justify-center text-[#1a0f0a] font-bold shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate text-[#f5f1ed]">{username}</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-white/40 hover:text-[#d4a373] p-1 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
