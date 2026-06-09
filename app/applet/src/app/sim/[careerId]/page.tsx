import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CAREER_MAP } from '../../../lib/career-config';
import CliWorkspace from '../../../components/workspaces/CliWorkspace';
import SqlWorkspace from '../../../components/workspaces/SqlWorkspace';
import EditorWorkspace from '../../../components/workspaces/EditorWorkspace';
import TicketingWorkspace from '../../../components/workspaces/TicketingWorkspace';
import DagViewerWorkspace from '../../../components/workspaces/DagViewerWorkspace';
import TerminalFeedWorkspace from '../../../components/workspaces/TerminalFeedWorkspace';

export default function SimWrapper() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  const config = careerId ? CAREER_MAP[careerId] : null;

  if (!config) {
    return (
      <div className="flex-1 min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
         <div>Career simulation "{careerId}" not found.</div>
         <button onClick={() => navigate('/')} className="px-4 py-2 bg-white/10 rounded pointer hover:bg-white/20 transition">Go Back</button>
      </div>
    );
  }

  const renderWorkspace = () => {
    switch (config.layoutType) {
      case 'cli': return <CliWorkspace />;
      case 'sql': return <SqlWorkspace />;
      case 'editor': return <EditorWorkspace config={config} />;
      case 'ticketing': return <TicketingWorkspace config={config} />;
      case 'dag_viewer': return <DagViewerWorkspace config={config} />;
      case 'terminal_feed': return <TerminalFeedWorkspace config={config} />;
      default: return <div className="p-20 text-white">Workspace layout {config.layoutType} not implemented.</div>;
    }
  };

  return (
    <div className='min-h-screen bg-[#050505] flex flex-col relative w-full overflow-hidden text-zinc-300 font-sans'>
      {/* Universal Sim Header */}
      <div className='absolute top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 lg:px-6 bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/5'>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className='flex items-center gap-2 hover:bg-white/10 text-white p-2 rounded-lg text-sm font-medium transition cursor-pointer'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg">
             <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
             <span className="font-bold text-white tracking-wide">{config.name}</span>
             <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ml-2">SIM_ACTIVE</span>
          </div>
        </div>

        {/* Dynamic Metrics */}
        <div className="flex items-center gap-4 lg:gap-6">
           {config.metrics.map(metric => (
             <div key={metric.id} className="flex flex-col items-end">
               <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{metric.name}</span>
               <span className={`text-[13px] font-mono font-bold text-${metric.color}-400`}>
                 {metric.id === 'budget' ? '$' : ''}{metric.startValue.toLocaleString()}
               </span>
             </div>
           ))}
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-64 bg-[#111] border-r border-white/10 z-[70] flex flex-col pt-16 lg:hidden">
                 <div className="p-4">
                    <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-4">Modules</h2>
                    <div className="space-y-1">
                      {config.sidebarTabs.map(tab => {
                         const Icon = (Icons as any)[tab.icon] || Icons.Square;
                         return (
                           <button 
                             key={tab.id}
                             onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === tab.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                           >
                             <Icon className="w-4 h-4" /> {tab.label}
                           </button>
                         );
                      })}
                    </div>
                 </div>
              </motion.div>
           </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex h-[100dvh] pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#0a0f1c]/50 backdrop-blur-xl border-r border-white/5 flex-col shrink-0 relative z-40">
           <div className="p-4 flex-1">
              <h2 className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] mb-4 uppercase">Sim Modules</h2>
              <div className="space-y-1">
                {config.sidebarTabs.map(tab => {
                   const Icon = (Icons as any)[tab.icon] || Icons.Square;
                   return (
                     <button 
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition cursor-pointer ${activeTab === tab.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                     >
                       <Icon className="w-5 h-5" /> {tab.label}
                     </button>
                   );
                })}
              </div>
           </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 min-w-0 bg-black relative flex flex-col h-[calc(100vh-64px)] overflow-hidden">
           {renderWorkspace()}
        </main>
      </div>
      
    </div>
  );
}
