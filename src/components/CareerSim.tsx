import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CAREER_MAP, CareerConfig } from '../lib/career-config';
import CliWorkspace from './workspaces/CliWorkspace';
import EditorWorkspace from './workspaces/EditorWorkspace';
import SqlWorkspace from './workspaces/SqlWorkspace';
import TicketingWorkspace from './workspaces/TicketingWorkspace';
import DagViewerWorkspace from './workspaces/DagViewerWorkspace';
import TerminalFeedWorkspace from './workspaces/TerminalFeedWorkspace';
import TopologyWorkspace from './workspaces/TopologyWorkspace';
import ExcelSimulator from './workspaces/ExcelSimulator';
import VisualAnalysisWorkspace from './workspaces/VisualAnalysisWorkspace';
import CyberSecSim from './CyberSecSim';

export default function CareerSim({ career }: { career: any }) {
  const navigate = useNavigate();
  const config: CareerConfig = CAREER_MAP[career?.id] || CAREER_MAP['cyber-architect'];

  if (career?.id === 'cyber-architect' || career?.name === 'Cyber Security Architect') {
    return <CyberSecSim />;
  }

  const [activeTab, setActiveTab] = useState(config?.sidebarTabs[0]?.id || 'inbox');
  const [emails, setEmails] = useState(config?.initialMails || []);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [metrics, setMetrics] = useState(config?.metrics || []);

  const completeMission = () => {
     setEmails(prev => prev.map(e => ({...e, missionCompleted: true})));
     setMetrics(prev => prev.map(m => {
        if (m.name.toLowerCase().includes('budget') || m.name.toLowerCase().includes('sanity')) {
           return {...m, startValue: Number(m.startValue) + 500};
        }
        return m;
     }));
  };

  if (!config) return <div className="p-8 text-zinc-500 font-mono text-sm tracking-widest uppercase">Loading Simulation...</div>;

  const renderActiveWorkspace = () => {
    if (activeTab === 'inbox') {
      return (
        <div className="flex-1 w-full flex overflow-hidden bg-[#0d0d0f]">
          <div className="w-80 border-r border-white/10 flex flex-col shrink-0 bg-black/20">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {emails.map(mail => (
                <button 
                   key={mail.id} 
                   onClick={() => { setSelectedEmail(mail); setEmails(p => p.map(e => e.id === mail.id ? {...e, isRead: true} : e)) }}
                   className={`w-full text-left p-4 rounded-xl transition ${selectedEmail?.id === mail.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                     <div className={`text-[13px] font-bold truncate ${mail.isRead ? 'text-zinc-400' : 'text-zinc-200'}`}>{mail.sender}</div>
                     {!mail.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1"></div>}
                   </div>
                   <div className="text-[11px] text-zinc-500 truncate mt-1">{mail.subject}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto p-8 relative">
             {selectedEmail ? (
               <div className="max-w-2xl">
                 <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-lg">{selectedEmail.senderAvatar}</div>
                       <div>
                         <div className="text-xl font-bold text-white">{selectedEmail.sender}</div>
                         <div className="text-sm text-zinc-400">{selectedEmail.senderRole}</div>
                       </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight">{selectedEmail.subject}</h2>
                 </div>
                 <div className="text-[15px] text-zinc-300 leading-relaxed whitespace-pre-line mb-8 p-8 bg-black/40 rounded-[24px] border border-white/5 shadow-inner">
                    {selectedEmail.content}
                 </div>
                 
                 {selectedEmail.missionActive && (
                   <div className={`border p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 bg-opacity-10 border-indigo-500/20`}>
                     <h3 className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-3 opacity-80">Primary Directive</h3>
                     <p className="text-indigo-100 mb-6 text-sm">{selectedEmail.missionHint}</p>
                     {selectedEmail.missionCompleted ? (
                       <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 w-fit px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg text-sm">
                         <CheckCircle className="w-5 h-5"/> Mission Accomplished
                       </div>
                     ) : (
                       <div className="text-indigo-200 text-[12px] font-semibold flex items-center gap-2 bg-black/40 w-fit px-4 py-2 rounded-xl border border-indigo-500/20">
                         Action Required in Workspace
                       </div>
                     )}
                   </div>
                 )}
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-zinc-600 font-medium text-sm">Select a transmission to view.</div>
             )}
          </div>
        </div>
      );
    }

    if (activeTab === 'cli') return <CliWorkspace careerId={career?.id} />;
    if (activeTab === 'topology') return <TopologyWorkspace />;
    if (activeTab === 'editor' || activeTab === 'briefs') return <EditorWorkspace config={config} />;
    if (activeTab === 'sql') return <SqlWorkspace />;
    if (activeTab === 'dashboards') return <VisualAnalysisWorkspace />;
    if (activeTab === 'ticketing' || activeTab === 'tickets' || activeTab === 'ad') return <TicketingWorkspace config={config} />;
    if (activeTab === 'dag' || activeTab === 'logs') return <DagViewerWorkspace config={config} />;
    if (activeTab === 'terminal') return <TerminalFeedWorkspace config={config} />;
    
    // Fallbacks
    if (activeTab === 'reports') return <ExcelSimulator />;

    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0f] text-zinc-500 font-mono text-sm">
        Module Offline: {activeTab}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Top Header */}
      <div className="h-16 border-b border-white/10 bg-[#0a0a0c] shrink-0 flex items-center justify-between px-6 z-20">
         <div className="flex items-center gap-4">
           <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition text-zinc-400 hover:text-zinc-50">
             <ArrowLeft className="w-5 h-5"/>
           </Link>
           <h1 className="text-[15px] font-semibold tracking-tight text-white flex items-center gap-3">
             {config.name} 
             <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-white/10 text-zinc-400">
               Live
             </span>
           </h1>
         </div>
         <div className="flex items-center gap-6">
            {metrics.map(m => (
              <div key={m.id} className="text-right hidden sm:block">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-0.5">{m.name}</div>
                <div className={`text-sm tracking-tight font-bold ${m.color}`}>
                  {typeof m.startValue === 'number' ? m.startValue.toLocaleString() : m.startValue}
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Navigation Sidebar */}
         <div className="w-20 lg:w-64 border-r border-white/10 bg-[#0a0a0c] flex flex-col shrink-0 flex-none py-4 gap-2">
            {config.sidebarTabs.map(tab => {
               const Icon = (Icons as any)[tab.icon] || Icons.Terminal;
               const isActive = activeTab === tab.id;
               return (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 ml-2 mr-2 rounded-xl transition-all outline-none ${
                       isActive 
                         ? 'bg-zinc-800 text-white shadow-inner font-medium' 
                         : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 font-normal'
                    }`}
                 >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
                    <span className="hidden lg:block text-sm tracking-wide">{tab.label}</span>
                    
                    {tab.id === 'inbox' && emails.some(e => !e.isRead) && (
                       <span className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-rose-500"/>
                    )}
                 </button>
               );
            })}
         </div>

         {/* Main Content Pane */}
         <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
           <AnimatePresence mode="popLayout">
             <motion.div 
               key={activeTab} 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.98 }} 
               transition={{ duration: 0.2 }}
               className="absolute inset-0 flex flex-col"
             >
               {renderActiveWorkspace()}
             </motion.div>
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
