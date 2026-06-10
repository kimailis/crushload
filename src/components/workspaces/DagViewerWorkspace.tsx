import React, { useState, useEffect } from 'react';
import { GitMerge, Play, AlertTriangle, CheckCircle, RefreshCcw, Plus, Trash2, ArrowRight, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

interface TopologyNode {
  id: string;
  type: 'Inlet' | 'Mixer' | 'Splitter' | 'PeelWallet' | 'ExitBridge';
  x: number;
  y: number;
  capacityBtc: number;
}

interface TopologyLink {
  from: string;
  to: string;
}

export default function DagViewerWorkspace({ config }: { config: CareerConfig }) {
  const isCrypto = config.id === 'crypto-laundry';

  // CRYPTO LAUNDRY SPECIFIC STATES
  const [nodes, setNodes] = useState<TopologyNode[]>([
    { id: 'Inlet_01', type: 'Inlet', x: 0, y: 110, capacityBtc: 50 },
    { id: 'Shadow_Mix_1', type: 'Mixer', x: 150, y: 45, capacityBtc: 25 },
    { id: 'Shadow_Mix_2', type: 'Mixer', x: 150, y: 175, capacityBtc: 25 },
    { id: 'Safe_Peel_A', type: 'PeelWallet', x: 300, y: 110, capacityBtc: 50 },
    { id: 'Exit_Bridge', type: 'ExitBridge', x: 450, y: 110, capacityBtc: 50 }
  ]);
  
  const [links, setLinks] = useState<TopologyLink[]>([
    { from: 'Inlet_01', to: 'Shadow_Mix_1' },
    { from: 'Inlet_01', to: 'Shadow_Mix_2' },
    { from: 'Shadow_Mix_1', to: 'Safe_Peel_A' },
    { from: 'Shadow_Mix_2', to: 'Safe_Peel_A' },
    { from: 'Safe_Peel_A', to: 'Exit_Bridge' }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('Inlet_01');
  const [candidateNodeName, setCandidateNodeName] = useState('');
  const [candidateNodeType, setCandidateNodeType] = useState<'Mixer' | 'PeelWallet' | 'ExitBridge'>('Mixer');

  const [linkFrom, setLinkFrom] = useState('');
  const [linkTo, setLinkTo] = useState('');

  const [flowStatus, setFlowStatus] = useState<'IDLE' | 'SIMULATING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [flowLogs, setFlowLogs] = useState<string[]>(['Mixer network online.']);

  // DATA ENGINEER SPECIFIC STATES
  const [deNodes, setDeNodes] = useState([
    { id: 'extract_sales_db', status: 'success', x: 0, y: 40 },
    { id: 'extract_web_logs', status: 'success', x: 0, y: 150 },
    { id: 'transform_coalesce', status: 'success', x: 150, y: 95 },
    { id: 'join_events_db', status: 'failed', x: 300, y: 95 },
    { id: 'load_analytics_dw', status: 'skipped', x: 450, y: 95 },
  ]);
  const [selectedDeNode, setSelectedDeNode] = useState<string | null>('join_events_db');

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateNodeName.trim()) return;
    const name = candidateNodeName.trim().replace(/\s+/g, '_');
    if (nodes.some(n => n.id === name)) {
      alert('Node ID already exists!');
      return;
    }

    // Coordinates logic inside boundary
    const count = nodes.length;
    const xPositions = [80, 150, 230, 300, 380];
    const x = xPositions[count % 5] + Math.floor(Math.random() * 20);
    const y = 60 + ((count * 60) % 160) + Math.floor(Math.random() * 20);

    const newNode: TopologyNode = {
      id: name,
      type: candidateNodeType,
      x,
      y,
      capacityBtc: Math.floor(Math.random() * 40 + 10)
    };

    setNodes(prev => [...prev, newNode]);
    setFlowLogs(prev => [`Deployed new routing node: ${name} (${candidateNodeType})`, ...prev]);
    setCandidateNodeName('');
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkFrom || !linkTo) return;
    if (linkFrom === linkTo) return;
    if (links.some(l => l.from === linkFrom && l.to === linkTo)) {
      alert('Link already exists!');
      return;
    }

    setLinks(prev => [...prev, { from: linkFrom, to: linkTo }]);
    setFlowLogs(prev => [`Wired connection segment: ${linkFrom} -> ${linkTo}`, ...prev]);
    setLinkFrom('');
    setLinkTo('');
  };

  const handleDeleteNode = (id: string) => {
    if (id === 'Inlet_01' || id === 'Exit_Bridge') return; // protected endpoints
    setNodes(prev => prev.filter(n => n.id !== id));
    setLinks(prev => prev.filter(l => l.from !== id && l.to !== id));
    setSelectedNodeId(null);
  };

  const triggerFlowSimulation = () => {
    setFlowStatus('SIMULATING');
    setFlowLogs(prev => ['[INIT] Dispatching $12.5M dirty BTC from Inlet_01...', ...prev]);
    
    setTimeout(() => {
      // Validate paths
      // Is exit_bridge reachable from inlet_01?
      // simple BFS check
      const queue = ['Inlet_01'];
      const visited = new Set<string>();
      while (queue.length > 0) {
        const curr = queue.shift()!;
        visited.add(curr);
        const adjacent = links.filter(l => l.from === curr).map(l => l.to);
        for (const adj of adjacent) {
          if (!visited.has(adj)) {
            queue.push(adj);
          }
        }
      }

      const reachesExit = visited.has('Exit_Bridge');
      if (reachesExit && links.length >= 4) {
        setFlowStatus('SUCCESS');
        setFlowLogs(prev => [
          '[AUDIT] Laundering route validation: VERIFIED SECURE.',
          '[SUCCESS] Monies processed. Cryptographic trail shattered successfully.',
          'Result: Clean funds moved to Exit_Bridge.',
          ...prev
        ]);
      } else {
        setFlowStatus('FAILED');
        setFlowLogs(prev => [
          '[ALERT] FLOW INTERRUPTED OR HIGH TRACEABILITY RISK.',
          '[FAIL] Topology contains dead ends or is too simple to conceal metadata.',
          ...prev
        ]);
      }
    }, 1500);
  };

  // Re-run Data Engineer DAG mock
  const reRunDePipeline = () => {
    setDeNodes(prev => prev.map(n => n.id === 'join_events_db' ? { ...n, status: 'success' } : n));
    setTimeout(() => {
      setDeNodes(prev => prev.map(n => n.id === 'load_analytics_dw' ? { ...n, status: 'success' } : n));
    }, 1000);
  };

  if (!isCrypto) {
    // STANDARD DATA ENGINEER PIPELINE WORKSPACE
    return (
      <motion.div key="dag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
        <div className="absolute inset-0 bg-[#060a15]/80 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 flex flex-col h-full w-full">
          <header className="h-[60px] bg-transparent flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
            <div className="flex items-center gap-3">
              <GitMerge className="w-4 h-4 text-emerald-400" />
              <h1 className="text-[13px] sm:text-[14px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
                Pipeline Orchestrator <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] uppercase">airflow-prod-core</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={reRunDePipeline} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest uppercase transition cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-white text-white" /> TRIGGER PIPELINE
               </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left controls */}
            <aside className="w-full lg:w-[200px] bg-slate-950/20 backdrop-blur-md flex flex-col shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-white/5 gap-3">
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pipeline Tasks</h3>
               <div className="space-y-1.5">
                  {deNodes.map(n => (
                     <button key={n.id} onClick={() => setSelectedDeNode(n.id)} className="w-full text-left px-3 py-2 text-[11px] font-mono text-zinc-300 bg-white/5 rounded-lg border border-white/5 truncate hover:bg-white/10 block">
                        {n.id}
                     </button>
                  ))}
               </div>
            </aside>

            {/* Simulated interactive Canvas mapping */}
            <div className="flex-grow p-4 lg:p-6 bg-[#030712] relative overflow-auto">
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

               {/* Sized inner canvas so all nodes are reachable (scrolls on narrow widths instead of clipping) */}
               <div className="relative w-full h-full min-w-[580px] min-h-[230px]">
                 {/* Connections */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1={120} y1={68} x2={150} y2={120} stroke="#94a3b8" strokeWidth={2} strokeDasharray="4" />
                    <line x1={120} y1={178} x2={150} y2={120} stroke="#94a3b8" strokeWidth={2} strokeDasharray="4" />
                    <line x1={270} y1={120} x2={300} y2={120} stroke="#f43f5e" strokeWidth={2} className="animate-pulse" />
                    <line x1={420} y1={120} x2={450} y2={120} stroke="#94a3b8" strokeWidth={2} />
                 </svg>

                 {deNodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedDeNode(node.id)}
                      className={`absolute p-3 rounded-xl border flex flex-col cursor-pointer shadow-lg w-[120px] ${
                        selectedDeNode === node.id ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-white/5'
                      } ${
                        node.status === 'success' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                        node.status === 'failed' ? 'bg-rose-950/20 text-rose-400 border-rose-500/30' :
                        'bg-slate-900/40 text-zinc-400 border-zinc-700/30'
                      }`}
                      style={{ left: node.x, top: node.y }}
                    >
                       <span className="text-[12px] font-bold font-mono truncate">{node.id}</span>
                       <span className="text-[9px] font-mono opacity-50 uppercase mt-1">{node.status}</span>
                    </div>
                 ))}
               </div>
            </div>

            {/* Task inspector */}
            <aside className="w-full lg:w-[300px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 p-5">
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pb-3 border-b border-white/5">Task Inspector</h3>
               {selectedDeNode ? (
                  <div className="py-4 flex flex-col gap-4">
                     <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Identifier</span>
                        <p className="text-[14px] font-mono text-white font-bold">{selectedDeNode}</p>
                     </div>
                     
                     {deNodes.find(n => n.id === selectedDeNode)?.status === 'failed' && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                           <span className="text-[11px] text-rose-400 font-mono font-bold block mb-1">STDOUT Traceback:</span>
                           <p className="text-[10px] font-mono text-rose-200/70 leading-relaxed max-h-36 overflow-y-auto bg-black/40 p-2.5 rounded-lg border border-rose-500/10 whitespace-pre-wrap">
                             psycopg2.errors.UndefinedColumn: column "test_do_not_use" does not exist{'\n'}
                             LINE 2: SELECT user_id, test_do_not_use FROM user_sprint
                           </p>
                        </div>
                     )}
                  </div>
               ) : (
                  <p className="text-[11px] text-zinc-600 font-mono mt-4">Select task block to audit diagnostics...</p>
               )}
            </aside>
          </main>
        </div>
      </motion.div>
    );
  }

  // CRYPTO LAUNDRY - FULLY FUNCTIONAL MIXER TOPOLOGY BUILDER
  return (
    <motion.div key="laundry-dag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#02050e]/90 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header toolbar */}
        <header className="h-[60px] bg-black/30 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-white/5 relative">
          <div className="flex items-center gap-3">
            <GitMerge className="w-4 h-4 text-emerald-400" />
            <h1 className="text-[13px] sm:text-[14px] font-bold tracking-widest text-[#ffcc00] uppercase flex items-center gap-2">
              Mixer Topology Core <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] uppercase">tumbler-mesh-network</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {flowStatus === 'SIMULATING' && <span className="text-[10px] font-mono text-amber-400 animate-pulse mr-2 font-bold uppercase">FLOWING ASSETS...</span>}
            <button 
              disabled={flowStatus === 'SIMULATING'}
              onClick={triggerFlowSimulation}
              className={`flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-1.5 rounded-xl text-[12px] font-bold tracking-widest uppercase transition shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer`}
            >
               <Play className="w-3.5 h-3.5 fill-white text-white" /> DETONATE LAUNDERING FLOW
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Node deployment controller sidebar */}
          <aside className="w-full lg:w-[240px] bg-slate-950/45 backdrop-blur-md flex flex-col shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-white/5 gap-4 overflow-y-auto select-none">
             
             {/* Deploy Node block */}
             <form onSubmit={handleAddNode} className="border-b border-white/5 pb-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Deploy Mixer Unit</h3>
                <div className="flex flex-col gap-2">
                   <input 
                     value={candidateNodeName}
                     onChange={e => setCandidateNodeName(e.target.value)}
                     placeholder="e.g. Helix_Tumbler"
                     className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
                   />
                   <select 
                     value={candidateNodeType}
                     onChange={e => setCandidateNodeType(e.target.value as any)}
                     className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500"
                   >
                      <option value="Mixer">Mixer (Tumbles Address)</option>
                      <option value="PeelWallet">Peel Wallet (Splits Sums)</option>
                      <option value="ExitBridge">Exit Bridge (Disburses)</option>
                   </select>
                   <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition uppercase tracking-wide">
                      Spawn Segment
                   </button>
                </div>
             </form>

             {/* Deploy Link block */}
             <form onSubmit={handleAddLink} className="border-b border-white/5 pb-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><GitMerge className="w-3.5 h-3.5" /> Wire Connection</h3>
                <div className="flex flex-col gap-2">
                   <select 
                     value={linkFrom}
                     onChange={e => setLinkFrom(e.target.value)}
                     className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500"
                   >
                      <option value="">Choose Source</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                   </select>
                   <select 
                     value={linkTo}
                     onChange={e => setLinkTo(e.target.value)}
                     className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500"
                   >
                      <option value="">Choose Target</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                   </select>
                   <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition uppercase tracking-wide">
                      Establish Link
                   </button>
                </div>
             </form>
          </aside>

          {/* Topology Canvas (Interactive grid map) */}
          <div className="flex-grow p-4 lg:p-6 bg-[#02040b] relative overflow-auto shadow-inner select-none min-h-[220px]">
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

             {/* Sized inner canvas so the Exit node is reachable (scrolls instead of clipping behind the inspector) */}
             <div className="relative w-full h-full min-w-[600px] min-h-[230px]">
             {/* Glowing Dynamic Routing Links */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                
                {links.map((link, idx) => {
                  const fromNode = nodes.find(n => n.id === link.from);
                  const toNode = nodes.find(n => n.id === link.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <g key={idx}>
                      {/* Base connection line */}
                      <path 
                        d={`M${fromNode.x + 60} ${fromNode.y + 25} L${toNode.x + 60} ${toNode.y + 25}`} 
                        stroke="#334155" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="4"
                      />
                      {/* Simulating active flows */}
                      {flowStatus === 'SIMULATING' && (
                        <path 
                          d={`M${fromNode.x + 60} ${fromNode.y + 25} L${toNode.x + 60} ${toNode.y + 25}`} 
                          stroke="url(#glowGrad)" 
                          strokeWidth="3" 
                          fill="none" 
                          strokeDasharray="6"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}
             </svg>

             {/* Render draggable/clickable nodes */}
             {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`absolute w-[120px] p-2.5 rounded-xl border flex flex-col justify-center text-left cursor-pointer transition shadow-lg backdrop-blur-md ${
                    selectedNodeId === node.id ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-white/5'
                  } ${
                    node.type === 'Inlet' ? 'bg-indigo-950/20 text-indigo-300 border-indigo-500/25' :
                    node.type === 'ExitBridge' ? 'bg-rose-950/25 text-rose-300 border-rose-500/25' :
                    'bg-slate-900/50 text-emerald-400 border-emerald-500/25'
                  }`}
                  style={{ left: node.x, top: node.y }}
                >
                   <span className="text-[11px] font-mono opacity-40 uppercase tracking-widest">{node.type}</span>
                   <span className="text-[12px] font-mono font-bold truncate text-white mt-0.5">{node.id}</span>
                </div>
             ))}
             </div>
          </div>

          {/* Node Inspector & Output Reports */}
          <aside className="w-full lg:w-[320px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 divide-y divide-white/10">
             
             {/* Node inspector panel */}
             <div className="p-5 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pb-3 border-b border-white/5">Segment audit</h3>
                {selectedNodeId ? (
                   <div className="py-4 gap-4 flex flex-col justify-between">
                      <div>
                         <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Selected Node</span>
                         <h4 className="text-[15px] font-mono font-bold text-white mt-1">{selectedNodeId}</h4>
                      </div>
                      <div>
                         <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">Type Category</span>
                         <p className="text-[13px] text-zinc-300 mt-1 font-bold">{nodes.find(n => n.id === selectedNodeId)?.type}</p>
                      </div>

                      {/* Delete option */}
                      {!['Inlet_01', 'Exit_Bridge'].includes(selectedNodeId) && (
                         <button 
                           onClick={() => handleDeleteNode(selectedNodeId)}
                           className="text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition uppercase tracking-wider block w-full mt-4 cursor-pointer"
                         >
                            <Trash2 className="w-3.5 h-3.5" /> Decommission Node
                         </button>
                      )}
                   </div>
                ) : (
                   <p className="text-[11px] text-zinc-600 font-mono mt-4">Select mixing segment node to review stats...</p>
                )}
             </div>

             {/* Output logs panel */}
             <div className="p-5 flex-grow overflow-y-auto max-h-[160px] lg:max-h-[220px] bg-black/15 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/10 font-mono">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Transaction Tunnel Logs</span>
                {flowLogs.slice(0, 10).map((log, i) => (
                   <div key={i} className="text-[10px] leading-relaxed text-zinc-400 break-words">
                      {log}
                   </div>
                ))}
             </div>

          </aside>

        </main>
      </div>
    </motion.div>
  );
}
