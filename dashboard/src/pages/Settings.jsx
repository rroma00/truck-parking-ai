import React from 'react';

export default function Settings({ title = 'Settings' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-200/50 shadow-sm p-12 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl"></div>
        <span className="material-symbols-outlined text-slate-400 text-5xl relative z-10 transition-transform hover:rotate-12 duration-500">
          {title === 'Settings' ? 'settings' : 'grid_view'}
        </span>
      </div>
      <h2 className="text-3xl font-black text-[#050f36] font-manrope mb-4 tracking-tight">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-body">
        We're currently perfecting the {title.toLowerCase()} experience. Soon you'll be able to manage your {title === 'Settings' ? 'operational preferences and team access' : 'lot capacity and visual mapping'} with precision.
      </p>
      <div className="mt-10 inline-flex items-center gap-2 px-6 py-2.5 bg-[#050f36]/5 text-[#050f36] rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-[#050f36]/5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        Module Under Construction
      </div>
    </div>
  );
}
