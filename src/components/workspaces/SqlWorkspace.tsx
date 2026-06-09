import React, { useState } from 'react';
import { Database, Play, History, Activity, Table, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function SqlWorkspace() {
  const [query, setQuery] = useState('SELECT *\\nFROM users\\nWHERE active = true;');
  const [results, setResults] = useState<{cols: string[], rows: any[][]}>({
    cols: ['id', 'username', 'role', 'active'],
    rows: [
      [1, 'admin_sys', 'admin', 'true'],
      [2, 'db_user_read', 'readonly', 'true'],
      [3, 'app_service', 'service', 'true']
    ]
  });

  const executeQuery = () => {
    setResults({
      cols: ['status', 'message', 'rows_affected'],
      rows: [['SUCCESS', 'Query executed successfully.', '3']]
    });
  };

  return (
    <motion.div key="sql" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/50 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <header className="h-[64px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
          <div className="flex items-center gap-3 lg:gap-4">
            <h1 className="text-[14px] lg:text-[15px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              SQL Editor <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] lg:text-xs">prod-db-01</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={executeQuery} className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 text-white px-5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer">
                <Play className="w-4 h-4 text-white" /> RUN QUERY
             </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-64 bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5">
            <div className="p-4">
              <h2 className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] mb-3 uppercase">Schemas</h2>
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-[13px] font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <div className="flex items-center gap-3"><Table className="w-4 h-4 text-indigo-500" /> users</div>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-[13px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5">
                  <div className="flex items-center gap-3"><Table className="w-4 h-4 opacity-50" /> transactions</div>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10 gap-4 lg:gap-6">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-[0.6] min-h-[200px] w-full flex flex-col bg-[#050505] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl relative">
                <div className="h-10 bg-[#111111] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                  <Code className="w-4 h-4 text-zinc-500" />
                  <span className="text-[11px] font-mono font-bold text-zinc-400 tracking-widest uppercase">SQL Editor</span>
                </div>
                <textarea 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-indigo-300 font-mono text-[14px] p-5 outline-none resize-none leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
                  spellCheck={false}
                />
             </motion.div>

             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 min-h-[250px] w-full flex flex-col bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden shadow-2xl relative">
                <div className="h-10 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2 shrink-0 justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-zinc-500" />
                    <span className="text-[11px] font-mono font-bold text-zinc-400 tracking-widest uppercase">Results</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {results.cols.map((c, i) => (
                          <th key={i} className="py-2.5 px-4 border-b border-white/10 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-4 border-b border-white/5 text-[13px] font-mono text-zinc-300 group-hover:text-white transition">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}

function Code(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
}
