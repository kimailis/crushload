import React, { useState } from 'react';
import { Layers, Activity, Search, ShieldCheck, AlertTriangle, Network, Cpu, Wifi, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function TopologyWorkspace() {
  const [nodes, setNodes] = useState([
    { id: 'edge-gw', name: 'Edge Gateway', type: 'router', status: 'online', load: 45 },
    { id: 'lb-01', name: 'Load Balancer 1', type: 'lb', status: 'online', load: 60 },
    { id: 'app-cluster-a', name: 'App Cluster A', type: 'server', status: 'warning', load: 88 },
    { id: 'db-master', name: 'DB Master', type: 'database', status: 'online', load: 30 },
  ]);

  return (
    <motion.div key="topology" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#050505] border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="flex-1 w-full bg-transparent overflow-hidden flex flex-col relative">
        <header className="h-[64px] bg-[#111111] flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
        <div className="flex items-center gap-3 lg:gap-4">
          <h1 className="text-[14px] lg:text-[15px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            Topology Manager <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] lg:text-xs">us-east-cluster</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
              <Network className="w-4 h-4 text-rose-500" />
              <span className="text-[13px] font-bold tracking-widest uppercase text-zinc-300">4 Nodes Online</span>
           </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-6 flex items-center justify-center relative scrollbar-thin scrollbar-thumb-white/10">
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 w-full">
               {nodes.map(node => (
                  <div key={node.id} className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 lg:p-8 rounded-[28px] shrink-0 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group hover:border-white/20 transition cursor-default">
                     <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500 opacity-50 group-hover:opacity-100 transition" />
                     {node.status === 'warning' && <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />}
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${node.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'} border shadow-inner`}>
                       {node.type === 'server' && <Cpu className="w-8 h-8" />}
                       {node.type === 'router' && <Wifi className="w-8 h-8" />}
                       {node.type === 'database' && <Database className="w-8 h-8" />}
                       {node.type === 'lb' && <Layers className="w-8 h-8" />}
                     </div>
                     <h3 className="text-[15px] font-bold text-white mb-1 text-center tracking-wide">{node.name}</h3>
                     <p className="text-[11px] text-zinc-500 font-mono uppercase mb-5 tracking-widest">{node.id}</p>
                     
                     <div className="w-full space-y-2 mt-auto">
                        <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                           <span>Load Metrics</span>
                           <span className={node.load > 80 ? 'text-amber-400' : 'text-emerald-400'}>{node.load}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/60 shadow-inner rounded-full overflow-hidden">
                           <div className={`h-full ${node.load > 80 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} style={{ width: `${node.load}%` }} />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>
     </div>
    </motion.div>
  );
}
