import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-12 overflow-hidden">
      {/* Background gradients for premium aesthetic */}
      {/* Background gradients for premium aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-950/15 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <svg width="150" height="76" viewBox="0 0 235 120" xmlns="http://www.w3.org/2000/svg" className="mb-2 shrink-0">
            <defs>
              <linearGradient id="dojoGradientAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E53935"/>
                <stop offset="100%" stop-color="#B71C1C"/>
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="42" fill="none" stroke="url(#dojoGradientAuth)" stroke-width="6"/>
            <rect x="35" y="35" width="50" height="6" rx="3" fill="#FFFFFF"/>
            <rect x="40" y="43" width="40" height="5" rx="2" fill="#E53935"/>
            <rect x="42" y="48" width="6" height="28" fill="#FFFFFF"/>
            <rect x="72" y="48" width="6" height="28" fill="#FFFFFF"/>
            <path d="M60 62 C52 66 50 73 60 82 C70 73 68 66 60 62Z" fill="#E53935"/>
            <text x="120" y="56" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">Meu</text>
            <text x="120" y="90" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#E53935">Dojo</text>
          </svg>
          <p className="text-sm text-zinc-400">A melhor gestão para sua academia de artes marciais</p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};
