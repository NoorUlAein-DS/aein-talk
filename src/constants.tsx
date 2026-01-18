
import React from 'react';

export const COFFEE_THEME = {
  background: 'bg-[#1a0f0a]', // Dark Espresso
  sidebar: 'bg-[#2c1810]/80', // Mocha
  accent: 'text-[#d4a373]', // Latte
  accentBg: 'bg-[#d4a373]',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
  userBubble: 'bg-[#3d2b1f]/90 text-[#f5f1ed]',
  aiBubble: 'bg-[#d4a373]/20 text-[#f5f1ed] border border-[#d4a373]/30',
};

export const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 12m-4.77 0L9.26 9m9.96-1.84h-3.83m.52-3.41c0-.12-.03-.21-.1-.28l-.33-.33c-.15-.15-.36-.23-.58-.23H10.1c-.22 0-.43.08-.58.23l-.33.33c-.07.07-.1.16-.1.28m11.85 0h-3.83m-11.85 0H5.17m11.85 0V4.5A2.25 2.25 0 0 0 14.74 2.25H9.26A2.25 2.25 0 0 0 7.01 4.5v1.66m10.48 0-1.05 15.11a2.25 2.25 0 0 1-2.24 2.1h-4.2a2.25 2.25 0 0 1-2.24-2.1L5.17 6.16h13.67Z" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Butterfly: () => {
  return (
    <div className="relative flex items-center justify-center p-4">
      <style>{`
        /* 1. The Main Movement Animation (Jump, Hide, Reappear from bottom) */
        @keyframes jump-hide-reappear {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          20% { transform: translateY(-25px) scale(1.1); opacity: 1; } /* Jump Peak */
          35% { transform: translateY(0) scale(1); opacity: 1; } /* Land */
          45% { transform: translateY(10px) scale(0.9); opacity: 1; } /* Anticipate disappearance */
          55% { transform: translateY(30px) scale(0.5); opacity: 0; } /* Gone down */
          80% { transform: translateY(50px) scale(0.5); opacity: 0; } /* Stay invisible below */
          90% { transform: translateY(-10px) scale(1.05); opacity: 1; } /* Pop up from below */
          100% { transform: translateY(0) scale(1); opacity: 1; } /* Settle back */
        }

        /* 2. Face Expression Switching (Neutral vs Wink) */
        /* Neutral face is visible by default, hidden during wink */
        @keyframes hide-neutral {
            0%, 15% { opacity: 1; }
            20%, 30% { opacity: 0; } /* Hide during jump peak */
            35%, 100% { opacity: 1; }
        }
        /* Wink face is hidden by default, shown during wink */
        @keyframes show-wink {
            0%, 15% { opacity: 0; }
            20%, 30% { opacity: 1; } /* Show at jump peak */
            35%, 100% { opacity: 0; }
        }

        .emoji-container {
           /* Total animation time 2.5 seconds, repeating */
           animation: jump-hide-reappear 2.5s ease-in-out infinite;
        }
        .neutral-features {
           animation: hide-neutral 2.5s ease-in-out infinite;
        }
        .wink-features {
           animation: show-wink 2.5s ease-in-out infinite;
        }
        .emoji-glow {
           filter: drop-shadow(0 0 4px #d4a373) drop-shadow(0 0 8px #d4a373);
        }
      `}</style>

      {/* Main Container applying movement animation */}
      <div className="emoji-container">
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="emoji-glow"
        >
          {/* Face Base Circle */}
          <circle cx="12" cy="12" r="10" stroke="#d4a373" strokeWidth="1.5" fill="#d4a373" fillOpacity="0.1" />

          {/* Group 1: Neutral Face (Normal Eyes) */}
          <g className="neutral-features">
            {/* Left Eye */}
            <circle cx="9" cy="10" r="1.5" fill="#d4a373" />
            {/* Right Eye */}
            <circle cx="15" cy="10" r="1.5" fill="#d4a373" />
            {/* Simple Smile */}
            <path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke="#d4a373" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Group 2: Wink Face (Replaces neutral face during jump) */}
          <g className="wink-features" style={{ opacity: 0 }}>
            {/* Left Eye (Normal) */}
            <circle cx="9" cy="10" r="1.5" fill="#d4a373" />
            {/* Right Eye (Wink - inverted V shape) */}
            <path d="M13.5 10.5L15 9L16.5 10.5" stroke="#d4a373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             {/* Bigger Wink Smile */}
            <path d="M8 14.5C8 14.5 10 17.5 12 17.5C14 17.5 16 14.5 16 14.5" stroke="#d4a373" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
    }
  }
