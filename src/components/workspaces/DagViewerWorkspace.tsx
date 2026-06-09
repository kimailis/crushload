import React, { useState } from 'react';
import { GitMerge, Play, AlertTriangle, CheckCircle, RefreshCcw, Command, Activity, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function DagViewerWorkspace({ config }: { config: CareerConfig }) {
  const [nodes, setNodes] = useState([
    { id: 'extract_sales', status: 'success', x: 50, y: 50 },
    { id: 'extract_marketing', status: 'success', x: 50, y: 150 },
    { id: 'transform_users', status: 'success', x: 200, y: 100 },
    { id: 'join_events', status: 'failed', x: 350, y: 100 },
    { id: 'load_warehouse', status: 'skipped', x: 500, y: 100 },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>('join_events');

  return (
    <motion.div key="dag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/50 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <header className="h-[64px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
          <div className="flex items-center gap-3 lg:gap-4">
            <h1 className="text-[14px] lg:text-[15px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-emerald-400" />
              Workflow Orchestrator <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] lg:text-xs">prod-pipeline-v3</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 shadow-inner text-[13px] font-bold tracking-widest uppercase text-rose-400">
                <AlertTriangle className="w-4 h-4" /> Pipeline Failed
             </div>
             <button className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] text-[13px] font-bold tracking-widest uppercase text-white transition">
                <Play className="w-4 h-4" /> Trigger Run
             </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-[260px] bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
               <h2 className="text-[12px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Control Panel</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-2">
               <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[13px] font-bold tracking-wide uppercase transition">
                  <LayoutGrid className="w-4 h-4" /> DAG Graph
               </button>
               <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-zinc-400 text-[13px] font-bold tracking-wide uppercase transition">
                  <Activity className="w-4 h-4" /> Event Logs
               </button>
               <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-zinc-400 text-[13px] font-bold tracking-wide uppercase transition">
                  <Command className="w-4 h-4" /> Run History
               </button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10">
             <div className="flex-1 h-full w-full flex flex-col bg-[#050505] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                
                <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-4 gap-3 shrink-0 relative z-10">
                  <span className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase">Canvas View</span>
                </div>
                
                {/* Canvas Area */}
                <div className="flex-1 relative bg-[#020617] overflow-auto">
                   <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                   
                   {/* SVG Lines */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M170 80 L200 130" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="4" />
                      <path d="M170 180 L200 130" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="4" />
                      <path d="M320 130 L350 130" stroke="#f43f5e" strokeWidth="2" fill="none" strokeDasharray="4" className="animate-pulse" />
                      <path d="M470 130 L500 130" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="4" />
                   </svg>

                   {nodes.map(node => (
                      <motion.div 
                        key={node.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedNode(node.id)}
                        className={`absolute w-[160px] p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 cursor-pointer shadow-xl backdrop-blur-md transition-colors
                           ${node.status === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 
                             node.status === 'failed' ? 'bg-rose-950/40 border-rose-500/50 text-rose-400' : 
                             'bg-slate-900/50 border-slate-700/50 text-slate-400'}
                           ${selectedNode === node.id ? 'ring-2 ring-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.2)]' : ''}
                        `}
                        style={{ left: node.x, top: node.y }}
                      >
                        {node.status === 'success' && <CheckCircle className="w-6 h-6" />}
                        {node.status === 'failed' && <AlertTriangle className="w-6 h-6 animate-pulse" />}
                        {node.status === 'skipped' && <div className="w-6 h-6 border-2 border-slate-600 rounded-full" />}
                        <span className="text-[11px] font-mono font-bold truncate w-full text-center tracking-wider text-white">{node.id}</span>
                      </motion.div>
                   ))}
                </div>
             </div>
          </div>
          
          <aside className="order-2 lg:order-none w-full lg:w-[320px] xl:w-[380px] bg-slate-900/40 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5">
             <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center shrink-0">
               <h2 className="text-[12px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Node Inspector</h2>
             </div>
             
             {selectedNode ? (
                <div className="p-6 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                   <div className="mb-6">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Task Identifier</span>
                      <h4 className="text-[15px] font-mono font-bold text-indigo-300 mt-1">{selectedNode}</h4>
                   </div>
                   
                   {nodes.find(n => n.id === selectedNode)?.status === 'failed' && (
                     <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="flex items-center gap-2 text-rose-400 mb-3 font-bold text-[13px] tracking-wide uppercase">
                           <AlertTriangle className="w-4 h-4" /> Execution Failed
                        </div>
                        <p className="text-[12px] font-mono text-rose-200/70 leading-relaxed bg-black/40 p-3 rounded-xl border border-rose-500/10 break-all">
                          psycopg2.errors.UndefinedColumn: column "test_do_not_use" does not exist\n
                          LINE 1: SELECT user_id, test_do_not_use FROM raw_events
                        </p>
                     </div>
                   )}

                   <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                      <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 rounded-xl text-[13px] font-bold tracking-widest uppercase transition text-zinc-300">View Server Logs</button>
                      <button className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl text-[13px] font-bold tracking-widest uppercase transition shadow-[0_0_15px_rgba(255,255,255,0.2)]">Clear State & Retry</button>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-600 text-[12px] uppercase tracking-widest font-bold">
                   Select a node to inspect
                </div>
             )}
          </aside>
        </main>
      </div>
    </motion.div>
  );
}
