import React, { useState } from 'react';
import { Layers, Activity, Search, ShieldCheck, AlertTriangle, Network, Cpu, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export default function TopologyWorkspace() {
  const [nodes, setNodes] = useState([
    { id: 'edge-gw', name: 'Edge Gateway', type: 'router', status: 'online', load: 45 },
    { id: 'lb-01', name: 'Load Balancer 1', type: 'lb', status: 'online', load: 60 },
    { id: 'app-cluster-a', name: 'App Cluster A', type: 'server', status: 'warning', load: 88 },
    { id: 'db-master', name: 'DB Master', type: 'database', status: 'online', load: 30 },
  ]);

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#f43f5e 1px, transparent 1px), linear-gradient(90deg, #f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <header className="h-[72px] bg-[#0a0f1c]/80 backdrop-blur-3xl flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 sticky top-0 shadow-sm border-b border-white/5">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-rose-400 to-orange-600 rounded-xl flex items-center justify-center font-bold text-zinc-50 shadow-lg shadow-rose-500/20 text-base flex-shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[15px] lg:text-[17px] font-semibold tracking-tight text-zinc-50 truncate">
              SysAdmin <span className="text-zinc-500 font-normal ml-1 text-[11px] lg:text-sm">Topology Manager</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Network className="w-4 h-4 text-rose-400" />
                <span className="text-[13px] font-medium text-zinc-300">4 Active Nodes</span>
             </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-10">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-64 bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5">
            <div className="p-4">
              <h2 className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] mb-3 uppercase">Infrastructure</h2>
              <div className="space-y-1">
                {nodes.map(node => (
                  <button key={node.id} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-[13px] font-medium hover:bg-white/5 text-zinc-400 hover:text-zinc-200">
                    <div className="flex items-center gap-3">
                       {node.type === 'server' && <Cpu className="w-4 h-4" />}
                       {node.type === 'router' && <Wifi className="w-4 h-4" />}
                       {node.type === 'database' && <Database className="w-4 h-4" />}
                       {node.type === 'lb' && <Layers className="w-4 h-4" />}
                       <span className="truncate">{node.name}</span>
                    </div>
                    {node.status === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> : <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:overflow-hidden relative z-10 gap-4 justify-center items-center">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
                   {nodes.map(node => (
                      <div key={node.id} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-3xl shrink-0 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                         {node.status === 'warning' && <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />}
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${node.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
                           {node.type === 'server' && <Cpu className="w-7 h-7" />}
                           {node.type === 'router' && <Wifi className="w-7 h-7" />}
                           {node.type === 'database' && <Database className="w-7 h-7" />}
                           {node.type === 'lb' && <Layers className="w-7 h-7" />}
                         </div>
                         <h3 className="text-[14px] font-bold text-white mb-1 text-center">{node.name}</h3>
                         <p className="text-[11px] text-zinc-500 font-mono uppercase mb-4">{node.id}</p>
                         
                         <div className="w-full space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400 uppercase font-bold">
                               <span>Load</span>
                               <span className={node.load > 80 ? 'text-amber-400' : 'text-emerald-400'}>{node.load}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                               <div className={`h-full ${node.load > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${node.load}%` }} />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
          </div>
          
          <aside className="order-2 lg:order-none w-full lg:w-[260px] xl:w-[300px] bg-slate-900/40 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5">
            <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-200 flex items-center gap-2"><Activity className="w-4 h-4 opacity-50" /> System Events</h2>
            </div>
            <div className="lg:flex-1 lg:overflow-y-auto p-4 flex flex-col gap-4">
              <div className="text-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-2xl flex gap-3 items-start">
                 <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                 <div className="flex flex-col gap-1">
                    <span className="font-bold">High Load Detected</span>
                    <span className="opacity-80 leading-relaxed">App Cluster A is experiencing elevated load (88%). Consider provisioning additional instances.</span>
                 </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Database(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
}
