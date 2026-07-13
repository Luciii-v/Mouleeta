import React from 'react';

export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] px-6 py-40 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-jost font-light text-3xl md:text-4xl tracking-[0.2em] uppercase mb-12 border-b border-[#1A1A1A]/10 pb-8 text-center">
          {title}
        </h1>
        <div className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/80 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
