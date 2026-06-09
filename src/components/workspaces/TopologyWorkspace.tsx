import React, { useState, useEffect, useRef } from 'react';
import { Layers, Activity, ShieldCheck, AlertTriangle, Network, Cpu, Wifi, Database, Terminal, ShieldAlert, Zap, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HackerNode {
  id: string;
  name: string;
  type: 'router' | 'lb' | 'server' | 'database';
  status: 'online' | 'warning' | 'compromised';
  load: number;
  ip: string;
  ports: string[];
}

export default function TopologyWorkspace() {
  const [nodes, setNodes] = useState<HackerNode[]>([
    { id: 'edge-gw', name: 'Edge Gateway Security', type: 'router', status: 'online', load: 45, ip: '10.0.12.1', ports: ['22/ssh', '80/http', '443/https'] },
    { id: 'lb-01', name: 'DMZ Cluster LB', type: 'lb', status: 'online', load: 60, ip: '10.0.12.50', ports: ['80/http', '443/https'] },
    { id: 'app-server', name: 'Identity Store DC', type: 'server', status: 'warning', load: 88, ip: '10.0.12.100', ports: ['135/rpc', '445/smb', '3389/rdp'] },
    { id: 'db-master', name: 'SQL Payroll Repository', type: 'database', status: 'online', load: 31, ip: '10.0.99.200', ports: ['1433/mssql'] },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('edge-gw');
  const [hackingProgress, setHackingProgress] = useState<number>(0);
  const [activePayload, setActivePayload] = useState<string | null>(null);
  const [hackLogs, setHackLogs] = useState<string[]>(['Reconnaissance script active in back-buffers.']);

  // Custom targets manager
  const [customNodeName, setCustomNodeName] = useState('');
  const [customNodeType, setCustomNodeType] = useState<'router' | 'server' | 'database'>('server');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const exploitIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    return () => {
      if (exploitIntervalRef.current) clearInterval(exploitIntervalRef.current);
    };
  }, []);

  const handleLaunchExploit = (exploitType: string) => {
    setActivePayload(exploitType);
    setHackingProgress(5);
    setHackLogs(prev => [`[LAUNCH] Initiating brute-force payload [${exploitType}] against target ${selectedNode.ip}...`, ...prev]);

    if (exploitIntervalRef.current) clearInterval(exploitIntervalRef.current);
    const interval = setInterval(() => {
      setHackingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          exploitIntervalRef.current = null;
          setActivePayload(null);
          // Set node compromised status
          setNodes(currentNodes => currentNodes.map(n => 
            n.id === selectedNodeId ? { ...n, status: 'compromised', load: 100 } : n
          ));
          setHackLogs(currentLogs => [
            `[SUCCESS] TARGET COMPROMISED: Remote code execution verified on ${selectedNode.name} (${selectedNode.ip}).`,
            `[LEAK] Root certificates harvested. Host control hijacked.`,
            ...currentLogs
          ]);
          return 0;
        }
        return Math.min(prev + 15, 100);
      });
    }, 200);
    exploitIntervalRef.current = interval;
  };

  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNodeName.trim()) return;
    const nameStr = customNodeName.trim();
    const cleanId = nameStr.toLowerCase().replace(/\s+/g, '-');

    if (nodes.some(n => n.id === cleanId)) {
      alert('Node already exists!');
      return;
    }

    const newNode: HackerNode = {
      id: cleanId,
      name: nameStr,
      type: customNodeType,
      status: 'online',
      load: Math.floor(Math.random() * 40 + 10),
      ip: `10.0.${Math.floor(Math.random()*150)}.${Math.floor(Math.random()*254)}`,
      ports: customNodeType === 'database' ? ['3306/mysql'] : ['80/http', '22/ssh']
    };

    setNodes(prev => [...prev, newNode]);
    setHackLogs(prev => [`Spotted new subnet node: ${newNode.name} - ${newNode.ip}`, ...prev]);
    setCustomNodeName('');
  };

  const handleDecommissionNode = (nodeId: string) => {
    if (nodes.length <= 1) return;
    const remaining = nodes.filter(n => n.id !== nodeId);
    setNodes(remaining);
    setHackLogs(prev => [`Dropped target node mapping for ${nodeId}`, ...prev]);
    if (selectedNodeId === nodeId) setSelectedNodeId(remaining[0].id);
  };

  return (
    <motion.div key="topology" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-[#020205] border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#06040a]/80 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#f43f5e 1px, transparent 1px), linear-gradient(90deg, #f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-950/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        
        {/* Left Column: Tickers & Subnets Mapping mapping list */}
        <aside className="w-full lg:w-[240px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 p-4 gap-4 overflow-y-auto">
          <div className="pb-2 border-b border-white/5 flex items-center gap-2">
            <Network className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">Target Register</span>
          </div>

          <div className="space-y-1.5 flex-grow overflow-y-auto max-h-[160px] lg:max-h-[300px] pr-1">
             {nodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full text-left p-3 rounded-xl border transition relative flex items-center justify-between group ${
                    selectedNodeId === node.id 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                   {node.status === 'compromised' && (
                     <div className="absolute inset-0 bg-red-600/5 animate-pulse rounded-xl border-dashed border border-red-500/20" />
                   )}
                   <div className="flex flex-col min-w-0 pointer-events-none relative z-10">
                      <span className="text-[12px] font-bold text-white truncate block">{node.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500 mt-1">{node.ip}</span>
                   </div>
                   
                   <span className={`w-2.5 h-2.5 rounded-full ${
                     node.status === 'compromised' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]' :
                     node.status === 'warning' ? 'bg-amber-400' :
                     'bg-[#10b981]'
                   }`} />
                </button>
             ))}
          </div>

          {/* Add custom node router subnet */}
          <form onSubmit={handleAddCustomNode} className="border-t border-white/5 pt-4 mt-auto">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Scan New Host</span>
             <div className="flex flex-col gap-2">
                <input 
                  value={customNodeName}
                  onChange={e => setCustomNodeName(e.target.value)}
                  placeholder="e.g. Mail Server"
                  className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-rose-500"
                />
                <select 
                  value={customNodeType}
                  onChange={e => setCustomNodeType(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none focus:border-rose-500"
                >
                   <option value="server">Linux VM server</option>
                   <option value="database">Core SQL Bank</option>
                   <option value="router">Subnet Gate Gateway</option>
                </select>
                <button type="submit" className="bg-rose-950/25 border border-rose-500/30 text-rose-300 font-bold text-xs py-2 rounded-lg transition uppercase tracking-wider hover:bg-rose-950/40">
                   Trace Target
                </button>
             </div>
          </form>
        </aside>

        {/* Central Display: Attack Operations Desk */}
         <section className="flex-1 min-w-0 h-full p-4 lg:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-6">
            
            {/* Upper node details */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
               <div>
                  <h3 className="text-xl font-bold text-white">{selectedNode.name}</h3>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1 uppercase">VULNERABILITY LEVEL: {selectedNode.status === 'compromised' ? 'OWNED' : selectedNode.type === 'database' ? 'CRITICAL' : 'HIGH'}</p>
               </div>
               
               <div className="flex gap-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center min-w-[100px]">
                     <span className="text-[9px] text-zinc-500 uppercase font-mono block">IP Address</span>
                     <span className="text-[13px] font-mono text-zinc-300 font-bold mt-1 block">{selectedNode.ip}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center min-w-[100px]">
                     <span className="text-[9px] text-zinc-500 uppercase font-mono block">Status State</span>
                     <span className={`text-[13px] font-mono font-bold mt-1 block uppercase ${
                       selectedNode.status === 'compromised' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                     }`}>
                        {selectedNode.status === 'compromised' ? 'OWNED' : 'SECURE'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Launch Exploit payload progress widget */}
            {activePayload ? (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col gap-2.5 animate-pulse">
                 <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-4 h-4 text-rose-400" /> EXPLOITING: {activePayload}</span>
                    <span className="text-rose-400 font-bold">{hackingProgress}%</span>
                 </div>
                 <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-[1px] border border-rose-500/10">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${hackingProgress}%` }} />
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {/* Attack launcher */}
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                       <h4 className="text-[12px] font-bold text-zinc-300 uppercase tracking-widest mb-1 shadow-sm">Infiltration Options</h4>
                       <p className="text-[11px] text-zinc-500 font-mono">Choose exploit package to execute target compromise.</p>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                       <button 
                         disabled={selectedNode.status === 'compromised'}
                         onClick={() => handleLaunchExploit('CVE-2026-X80_SMB_BYPASS')}
                         className="w-full bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs py-2.5 rounded-xl transition font-bold disabled:opacity-40 uppercase tracking-widest cursor-pointer"
                       >
                         Execute SMB Bypass
                       </button>
                       <button 
                         disabled={selectedNode.status === 'compromised'}
                         onClick={() => handleLaunchExploit('SQL_UNION_HARVESTER')}
                         className="w-full bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs py-2.5 rounded-xl transition font-bold disabled:opacity-40 uppercase tracking-widest cursor-pointer"
                       >
                         Execute SQL Union Payload
                       </button>
                    </div>
                 </div>

                 {/* Port mapper */}
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col">
                    <h4 className="text-[12px] font-bold text-zinc-300 uppercase tracking-widest mb-3">Discovered Port Arrays</h4>
                    <div className="flex-grow space-y-1.5 overflow-y-auto max-h-[110px] pr-1">
                       {selectedNode.ports.map((port, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono bg-black/40 border border-white/5 px-3 py-2 rounded-xl">
                             <span className="text-[#ffcc00] font-bold">{port}</span>
                             <span className="text-zinc-500 uppercase text-[10px]">Open / Exploitable</span>
                          </div>
                       ))}
                    </div>
                 </div>

              </div>
            )}

            {/* Bottom logs console terminal panel */}
            <div className="bg-[#020308] border border-white/5 rounded-2xl flex flex-col flex-grow min-h-[140px] max-h-[220px] overflow-hidden">
               <div className="h-8 bg-black/40 border-b border-white/5 px-4 flex items-center gap-2 justify-between shrink-0">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5"><Terminal className="w-4 h-4 text-rose-400" /> Exploitation Output Console</span>
                  <span className="text-[9px] font-mono text-zinc-600">Trace Logs Sync</span>
               </div>
               
               <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 font-mono text-[11px] text-zinc-400 space-y-2 select-text">
                  {hackLogs.map((log, i) => (
                     <div key={i} className="leading-relaxed">
                        {log}
                     </div>
                  ))}
               </div>
            </div>

         </section>

      </div>
    </motion.div>
  );
}
