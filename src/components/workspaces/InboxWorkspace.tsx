import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, Send, MessageSquare, Reply, Briefcase, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';
import { Mission } from '../../lib/mission-data';

export default function InboxWorkspace({ 
  config, 
  missions, 
  setMissions, 
  acceptMission, 
  completeMission 
}: { 
  config: CareerConfig, 
  missions: Mission[], 
  setMissions: (m: Mission[]) => void, 
  acceptMission: (id: string) => void, 
  completeMission: (id: string) => void 
}) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(missions.length > 0 ? missions[0].id : null);
  const selectedMission = missions.find(m => m.id === selectedMissionId) || null;

  useEffect(() => {
    if (selectedMission && selectedMission.status === 'unread') {
      setMissions(missions.map(m => m.id === selectedMission.id ? { ...m, status: 'read' as const } : m));
    }
  }, [selectedMission, missions, setMissions]);

  return (
    <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row lg:h-[75vh] lg:min-h-[600px] overflow-hidden bg-white/5 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl w-full max-w-7xl mx-auto">
      <aside className="w-full lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col bg-slate-900/40 h-[250px] lg:h-full">
        <div className="p-4 lg:p-5 border-b border-white/5 shrink-0"><h2 className="text-lg font-semibold text-zinc-50 flex items-center gap-2"><Mail className="w-5 h-5 text-indigo-400" /> Inbox</h2></div>
        <div className="p-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1">
            <AnimatePresence>
             {missions.map(m => (
                <motion.button 
                  key={m.id}
                  onClick={() => setSelectedMissionId(m.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer relative ${selectedMissionId === m.id ? 'bg-indigo-600 shadow-md text-white' : 'hover:bg-white/5 text-zinc-300'}`}
                >
                   {!m.missionCompleted && m.status === 'unread' && selectedMissionId !== m.id && <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>}
                   <div className="flex items-center gap-3 mb-1.5 focus:outline-none focus:ring-0">
                      <div className="text-xl">{'👤'}</div>
                      <div className={`text-[14px] leading-none ${selectedMissionId === m.id ? 'font-bold' : 'font-medium'} ${m.status === 'unread' && selectedMissionId !== m.id ? 'text-zinc-50 font-bold' : ''}`}>{m.sender.split('<')[0]}</div>
                   </div>
                   <div className={`text-[13px] block truncate pl-[32px] ${m.status === 'unread' && selectedMissionId !== m.id ? 'text-zinc-100 font-semibold' : 'opacity-80'}`}>{m.subject}</div>
                </motion.button>
              ))}
           </AnimatePresence>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-[400px] lg:h-full bg-[#0a0f1c]/50 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
         {selectedMission ? (
           <div className="p-8 max-w-3xl mx-auto w-full flex flex-col">
             <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-sm border border-white/5">👤</div>
                 <div>
                   <h3 className="text-lg font-bold text-zinc-50">{selectedMission.sender}</h3>
                   <p className="text-[13px] text-zinc-400">External Contact</p>
                 </div>
               </div>
               <span className="text-[12px] text-zinc-400 font-mono py-1 px-3 bg-white/5 rounded-full border border-white/5">{selectedMission.timestamp}</span>
             </div>
             
             <h2 className="text-2xl font-bold text-zinc-50 mb-6 font-serif tracking-tight">{selectedMission.subject}</h2>
             <div className="text-[14px] text-zinc-300 leading-relaxed space-y-4 mb-8 whitespace-pre-line bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner">
               {selectedMission.content}
             </div>
             
             {(selectedMission as any).objective && (
                <div className="mt-4 p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4"><ShieldAlert className="text-indigo-400 w-6 h-6" /><h3 className="text-zinc-50 font-semibold text-lg">Action Required</h3></div>
                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl mb-6 border border-white/5">
                     <span className="text-[13px] text-zinc-300 font-mono">Operations Reward Budget:</span>
                     <span className="text-[16px] text-amber-400 font-bold font-mono">${selectedMission.missionRewardBudget?.toLocaleString() || 500}</span>
                  </div>
                  
                  {!selectedMission.missionAccepted && !selectedMission.missionCompleted ? (
                    <button onClick={() => acceptMission(selectedMission.id)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-2xl transition cursor-pointer shadow-lg hover:shadow-indigo-500/20"><Briefcase className="w-5 h-5" /> Accept Mission Directive</button>
                  ) : selectedMission.missionAccepted && !selectedMission.missionCompleted ? (
                    <button onClick={() => completeMission(selectedMission.id)} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-2xl transition cursor-pointer shadow-lg hover:shadow-emerald-500/20"><CheckCircle className="w-5 h-5" /> Mark Mission Completed</button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold py-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Check className="w-5 h-5" /> Mission Accomplished</div>
                  )}
                </div>
             )}
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center opacity-60 m-auto">
             <Mail className="w-16 h-16 mb-4 text-zinc-500" />
             <h3 className="text-lg font-medium text-zinc-300">Select an email to view contents</h3>
           </div>
         )}
      </div>
    </motion.div>
  );
}
