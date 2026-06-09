import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, CheckCircle, Clock, Send, MessageSquare, Reply, Briefcase, Check, ShieldAlert, BadgeInfo, Star } from 'lucide-react';
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
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  acceptMission: (id: string) => void, 
  completeMission: (id: string) => void 
}) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(missions.length > 0 ? missions[0].id : null);
  const selectedMission = missions.find(m => m.id === selectedMissionId) || null;

  useEffect(() => {
    if (selectedMission && selectedMission.status === 'unread') {
      setMissions(prev => prev.map(m => m.id === selectedMission.id ? { ...m, status: 'read' as const } : m));
    }
  }, [selectedMissionId]);

  return (
    <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl w-full max-w-7xl mx-auto divide-y lg:divide-y-0 lg:divide-x divide-white/5">
      
      {/* Outlook Left Summary list pane */}
      <aside className="w-full lg:w-[360px] shrink-0 flex flex-col bg-slate-950/40 h-full overflow-hidden select-none">
        <div className="p-4 border-b border-white/5 shrink-0 flex items-center justify-between bg-black/10">
          <div className="flex items-center gap-2">
             <Mail className="w-4 h-4 text-indigo-400" /> 
             <h2 className="text-[13px] font-bold tracking-widest text-zinc-300 uppercase">INBOX OUTLOOK</h2>
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
             {missions.filter(m => m.status === 'unread').length} Unread
          </span>
        </div>

        {/* Email feed */}
        <div className="p-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1.5 max-h-[220px] lg:max-h-full">
           <AnimatePresence mode="popLayout">
             {missions.map(m => {
                const isSelected = selectedMissionId === m.id;
                const isUnread = m.status === 'unread';
                const senderName = m.sender.split('<')[0].trim();
                const snippet = m.content.substring(0, 60) + '...';

                return (
                  <motion.button 
                    key={m.id}
                    onClick={() => setSelectedMissionId(m.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition duration-150 cursor-pointer relative border ${
                      isSelected 
                        ? 'bg-indigo-600/15 border-indigo-500/35 text-indigo-300 shadow-md' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                     {/* Blue Unread Dot */}
                     {isUnread && !isSelected && (
                       <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full" />
                     )}
                     
                     <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center justify-center text-zinc-500">
                           {isSelected || !isUnread ? <MailOpen className="w-4 h-4 text-zinc-400" /> : <Mail className="w-4 h-4 text-indigo-400 animate-pulse" />}
                        </div>
                        <span className={`text-[12px] uppercase tracking-wide leading-none truncate flex-1 font-bold ${
                          isSelected ? 'text-white' : isUnread ? 'text-zinc-100' : 'text-zinc-300'
                        }`}>
                          {senderName}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 shrink-0">{m.timestamp.split(' ')[0]}</span>
                     </div>

                     <div className={`text-[11.5px] block truncate font-medium pl-6 ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                        {m.subject}
                     </div>

                     <div className="text-[10.5px] font-medium opacity-50 block truncate pl-6 mt-1 text-zinc-400 leading-tight">
                        {snippet}
                     </div>
                  </motion.button>
                );
              })}
           </AnimatePresence>
        </div>
      </aside>

      {/* Outlook Right Detailed Reading Pane */}
      <div className="flex-1 flex flex-col h-full bg-[#050811]/70 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 relative">
         {selectedMission ? (
           <div className="p-4 lg:p-8 w-full flex flex-col gap-6">
             
             {/* Outlook Headers envelope format */}
             <div className="bg-white/5 border border-white/5 rounded-2xl p-5 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 gap-3">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl font-bold">👤</div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-zinc-50">{selectedMission.sender.split('<')[0].trim()}</h3>
                            <span className="text-[10px] font-mono text-zinc-500">&lt;{selectedMission.sender.split('<')[1] || 'no-reply@corp.local'}</span>
                         </div>
                         <p className="text-[10.5px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">External Contact</p>
                      </div>
                   </div>
                   
                   <span className="text-[10.5px] text-zinc-400 font-mono py-1 px-3 bg-black/40 rounded-full border border-white/5 self-start sm:self-auto uppercase tracking-wider">{selectedMission.timestamp}</span>
                </div>

                <div className="pt-4 flex flex-col gap-1 text-[11px] font-mono text-zinc-500">
                   <p>To: <span className="text-zinc-400 font-bold">&lt;operator@corp-network.local&gt;</span></p>
                   <p className="flex items-center gap-1">Security Rating: <span className="text-emerald-400 font-bold flex items-center gap-0.5 animate-pulse"><Star className="w-3 h-3 text-emerald-400" /> ENCRYPTED_VERIFIED</span></p>
                </div>
             </div>
             
             {/* Email Subject block */}
             <div>
                <h2 className="text-lg lg:text-2xl font-bold text-white tracking-tight">{selectedMission.subject}</h2>
             </div>

             {/* Dynamic Rich Text Body */}
             <div className="text-[13px] text-zinc-300 leading-relaxed space-y-4 font-mono select-text bg-white/5 p-6 rounded-[22px] border border-white/5 shadow-2xl relative">
               <div className="absolute top-4 right-4 opacity-10 text-zinc-400 font-mono text-[10px] uppercase">LDAP COMPLIANT MSG</div>
               {selectedMission.content}
             </div>
             
             {/* Mission directives logic (Action banner) */}
             {(selectedMission as any).objective && (
                <div className="p-6 bg-indigo-950/25 border border-indigo-500/20 rounded-[22px] shadow-lg flex flex-col gap-4">
                  <div className="flex items-center gap-2.5"><ShieldAlert className="text-indigo-400 w-5 h-5 shrink-0" /><h3 className="text-zinc-50 font-bold text-[13px] uppercase tracking-wider">Mission Action Required Directive</h3></div>
                  <div className="flex items-center justify-between bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 font-mono">
                     <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Operational reward pay:</span>
                     <span className="text-[15px] text-emerald-400 font-bold">${selectedMission.missionRewardBudget?.toLocaleString() || 500}</span>
                  </div>
                  
                  {!selectedMission.missionAccepted && !selectedMission.missionCompleted ? (
                    <button onClick={() => acceptMission(selectedMission.id)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg hover:shadow-indigo-500/20 uppercase tracking-widest"><Briefcase className="w-4 h-4" /> Accept Mission Directive</button>
                  ) : selectedMission.missionAccepted && !selectedMission.missionCompleted ? (
                    <button onClick={() => completeMission(selectedMission.id)} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg hover:shadow-emerald-500/20 uppercase tracking-widest"><CheckCircle className="w-4 h-4" /> Clear and Finish Mission</button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs py-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 uppercase tracking-widest"><Check className="w-4 h-4" /> Mission Cleared</div>
                  )}
                </div>
             )}
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center opacity-40 m-auto p-8 text-center select-none">
              <Mail className="w-12 h-12 mb-3 text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No Message Selected</h3>
           </div>
         )}
      </div>
    </motion.div>
  );
}
