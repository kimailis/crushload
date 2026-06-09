import React, { useState } from 'react';
import { GitMerge, Play, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';
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
    <div className="flex-1 min-h-[100dvh] bg-[#0c0c0c] text-zinc-300 font-sans flex flex-col pt-16">
       <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 h-full max-h-[100dvh] pb-8 overflow-hidden">
          
          <div className="flex-1 bg-[#121212] border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
             <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-black/20">
                <div className="flex items-center gap-3">
                   <GitMerge className="w-5 h-5 text-emerald-500" />
                   <h2 className="font-semibold text-white">production_revenue_pipeline_v3</h2>
                   <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400"><RefreshCcw className="w-4 h-4" /></button>
                   <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2"><Play className="w-4 h-4"/> Trigger RUN</button>
                </div>
             </div>
             
             {/* Mock Canvas Area */}
             <div className="flex-1 relative bg-[#0a0a0a] overflow-auto">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                
                {/* SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <path d="M170 80 L200 130" stroke="#333" strokeWidth="2" fill="none" />
                   <path d="M170 180 L200 130" stroke="#333" strokeWidth="2" fill="none" />
                   <path d="M320 130 L350 130" stroke="#e11d48" strokeWidth="2" fill="none" strokeDasharray="4" />
                   <path d="M470 130 L500 130" stroke="#333" strokeWidth="2" fill="none" />
                </svg>

                {nodes.map(node => (
                   <motion.div 
                     key={node.id}
                     whileHover={{ scale: 1.05 }}
                     onClick={() => setSelectedNode(node.id)}
                     className={`absolute w-[120px] p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-sm
                        ${node.status === 'success' ? 'bg-emerald-950/40 border-emerald-500/30' : 
                          node.status === 'failed' ? 'bg-rose-950/40 border-rose-500/50' : 
                          'bg-zinc-900/50 border-zinc-700/50'}
                        ${selectedNode === node.id ? 'ring-2 ring-white/20' : ''}
                     `}
                     style={{ left: node.x, top: node.y }}
                   >
                     {node.status === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                     {node.status === 'failed' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                     {node.status === 'skipped' && <div className="w-5 h-5 border-2 border-zinc-600 rounded-full" />}
                     <span className="text-[10px] font-mono font-bold truncate w-full text-center">{node.id}</span>
                   </motion.div>
                ))}
             </div>
          </div>

          <div className="w-full lg:w-96 bg-[#121212] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-xl shrink-0">
             <div className="h-14 border-b border-white/10 flex items-center px-6 bg-black/20">
                <h3 className="font-semibold text-white">Node Details</h3>
             </div>
             
             {selectedNode ? (
                <div className="p-6 flex flex-col h-full overflow-auto">
                   <div className="mb-6">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Task ID</span>
                      <h4 className="text-lg font-mono text-zinc-200 mt-1">{selectedNode}</h4>
                   </div>
                   
                   {nodes.find(n => n.id === selectedNode)?.status === 'failed' && (
                     <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-rose-400 mb-2 font-bold text-sm">
                           <AlertTriangle className="w-4 h-4" /> Execution Failed
                        </div>
                        <p className="text-xs font-mono text-rose-300/80 leading-relaxed">
                          psycopg2.errors.UndefinedColumn: column "test_do_not_use" does not exist\\n
                          LINE 1: SELECT user_id, test_do_not_use, created_at FROM raw_events
                        </p>
                     </div>
                   )}

                   <div className="mt-auto space-y-3">
                      <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl text-sm font-semibold transition">View Logs</button>
                      <button className="w-full bg-zinc-100 hover:bg-white text-black py-3 rounded-xl text-sm font-bold transition">Clear State & Retry</button>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                   Select a node to view details
                </div>
             )}
          </div>

       </div>
    </div>
  );
}
