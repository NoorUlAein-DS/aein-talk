
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { COFFEE_THEME, Icons } from '../constants';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  toggleSidebar: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isTyping,
  onSendMessage,
  toggleSidebar
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const aeinDetails = "Tell me about AEIN. (Context: AEIN is a Data Science student in their 2nd year at University and currently works at the AIT Alkhair Institute of Technology. Please give a friendly greeting starting with 'Salam' if asked about AEIN).";

  return (
    <main className="flex-1 flex flex-col h-screen relative bg-gradient-to-b from-[#1a0f0a] to-[#2c1810]">
      <header className="lg:hidden p-4 flex items-center bg-[#2c1810]/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <button onClick={toggleSidebar} className="p-2 text-[#d4a373]">
          <Icons.Menu />
        </button>
        <span className="ml-4 font-playfair font-bold text-[#d4a373] text-lg">AEIN TALK</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative group">
              <div className="absolute -inset-8 bg-[#d4a373]/20 rounded-full blur-3xl group-hover:bg-[#d4a373]/30 transition-all duration-700 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-white/5 backdrop-blur-md border border-[#d4a373]/30 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#d4a373]/10 to-transparent"></div>
                <Icons.Butterfly />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-playfair font-bold text-[#d4a373] tracking-tight">AEIN TALK</h2>
              <p className="text-white/60 text-lg font-light italic">"Say less. Mean more."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
              {/* Card 1: Developer */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#d4a373]/50 transition-all cursor-pointer group hover:bg-[#d4a373]/5" onClick={() => onSendMessage("What are the best practices for a modern Frontend Developer?")}>
                <p className="text-[#d4a373] text-[15px] uppercase tracking-widest mb-1 font-bold">Developer</p>
                <p className="text-white/80 text-xm leading-relaxed">Coding best practices & architecture...</p>
              </div>

              {/* Card 2: Data Science */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#d4a373]/50 transition-all cursor-pointer group hover:bg-[#d4a373]/5" onClick={() => onSendMessage("Explain the future of Data Science and AI.")}>
                <p className="text-[#d4a373] text-[15px] uppercase tracking-widest mb-1 font-bold">Data Science</p>
                <p className="text-white/80 text-xm leading-relaxed">Future of AI & Data insights...</p>
              </div>

              {/* Card 3: Know about AEIN */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#d4a373]/50 transition-all cursor-pointer group hover:bg-[#d4a373]/10 border-dashed" onClick={() => onSendMessage(aeinDetails)}>
                <p className="text-[#d4a373] text-[15px] uppercase tracking-widest mb-1 font-bold">Founder</p>
                <p className="text-white/80 text-xm leading-relaxed">Know more about AEIN...</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-lg ${msg.role === 'user' ? COFFEE_THEME.userBubble : COFFEE_THEME.aiBubble}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-[#d4a373]/80 italic">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[#d4a373] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1 h-1 bg-[#d4a373] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-[#d4a373] rounded-full animate-bounce"></div>
            </div>
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a373]/0 via-[#d4a373]/10 to-[#d4a373]/0 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message here..."
            className="w-full relative bg-[#3d2b1f]/50 border border-white/10 rounded-2xl py-4 pl-4 pr-16 text-[#f5f1ed] placeholder-white/30 focus:outline-none focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/20 resize-none shadow-2xl transition-all"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#d4a373] text-[#1a0f0a] rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            <Icons.Send />
          </button>
        </form>
        <p className="text-[15px] text-center text-white/20 mt-4">AEIN Talk Like Money Talk<br></br> <span className='text-[#d4a373] text-[20px]'>Created By NOOR-UL-AEIN</span></p>
      </div>
    </main>
  );
};

export default ChatWindow;
