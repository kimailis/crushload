const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  ['bg-slate-950', 'bg-[#f5f5f7]'], // Apple-like light gray/off-white
  ['text-slate-100', 'text-slate-900'],
  ['text-slate-200', 'text-slate-800'],
  ['text-slate-300', 'text-slate-700'],
  ['text-slate-400', 'text-slate-600'],
  // Panels and borders
  ['bg-slate-900', 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/40'],
  ['border-slate-800', 'border-white/60'],
  ['border-slate-700', 'border-slate-300/50'],
  ['bg-slate-800', 'bg-slate-200/70'],
  ['bg-slate-850', 'bg-slate-100'],
  ['opacity-[0.03]', 'opacity-[0.05]'],
  ['radial-gradient(circle, #fff 1px, transparent 1px)', 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)'], // grid color
  // Terminal and code areas
  ['text-white', 'text-slate-900'],
  
  // Tab bg
  ['bg-slate-950/40', 'bg-white/50 backdrop-blur-lg'],
  ['bg-slate-950/80', 'bg-white/70 backdrop-blur-lg border-r border-slate-200/50'],
  ['bg-slate-900/10', 'bg-transparent'],
  ['bg-slate-900/15', 'bg-white shadow-sm rounded-t-lg border border-slate-200/60 border-b-0'],
  ['bg-slate-900/40', 'bg-white/60 backdrop-blur-xl shadow-sm'],
  ['bg-slate-900/60', 'bg-white border border-slate-200'],
  
  // Specific button hovers
  ['hover:bg-slate-900', 'hover:bg-white/90'],
  ['hover:bg-slate-800', 'hover:bg-slate-100'],
  
  // Indigo / Purple interactions
  ['bg-indigo-600', 'bg-blue-600'],
  ['shadow-indigo-500/20', 'shadow-blue-500/30'],
  ['text-indigo-400', 'text-blue-600'],
  ['text-indigo-500', 'text-blue-600'],
  ['border-indigo-500', 'border-blue-500'],
  ['bg-indigo-500/10', 'bg-blue-500/10'],
  ['bg-indigo-500/20', 'bg-blue-100'],
  ['border-indigo-500/30', 'border-blue-300'],
  ['text-indigo-200', 'text-blue-800'],
  ['text-indigo-300', 'text-blue-700'],
  ['bg-indigo-950/70', 'bg-blue-50/80 backdrop-blur-sm'],
  ['border-indigo-500/35', 'border-blue-300/50'],
  ['bg-indigo-900', 'bg-blue-100'],

  // Alerts & Colors
  ['bg-rose-950/20', 'bg-rose-50/80 backdrop-blur-md'],
  ['border-rose-900/50', 'border-rose-200'],
  ['shadow-[0_0_15px_rgba(244,63,94,0.05)]', 'shadow-md shadow-rose-500/10'],
  ['bg-rose-505/20', 'bg-rose-100'],
  
  ['bg-emerald-950/40', 'bg-emerald-50/80 backdrop-blur-md'],
  ['bg-emerald-950/50', 'bg-emerald-100/50'],
  ['bg-emerald-950', 'bg-emerald-100'],
  
  ['bg-amber-950/20', 'bg-amber-50/80 backdrop-blur-md'],
  ['border-amber-900/50', 'border-amber-200'],
  
  ['text-emerald-400', 'text-emerald-600'],
  ['text-emerald-500', 'text-emerald-600'],
  ['text-amber-400', 'text-amber-600'],
  ['text-amber-300', 'text-amber-600'],
  ['text-rose-400', 'text-rose-600'],
  ['text-rose-500', 'text-rose-600'],
  ['border-emerald-900/30', 'border-emerald-200'],
];

replacements.forEach(([search, replace]) => {
  app = app.split(search).join(replace);
});

fs.writeFileSync('src/App.tsx', app);
