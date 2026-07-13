import React from 'react';

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
      <div className="flex flex-col items-center gap-6">
        {/* Subtle Pulse Logo or Spinner */}
        <div className="w-12 h-12 border border-[#1A1A1A]/10 rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 border-t border-[#1A1A1A] rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="w-2 h-2 bg-[#1A1A1A] rounded-full animate-pulse" />
        </div>
        <span className="font-metropolis text-[9px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 animate-pulse">
          Curating
        </span>
      </div>
    </div>
  );
}
