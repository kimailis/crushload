import React, { useState } from 'react';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';
import { INITIAL_MISSIONS, Mission } from '../../lib/mission-data';

export default function InboxWorkspace({ config }: { config: CareerConfig }) {
  const careerMissions = INITIAL_MISSIONS.filter(m => m.careerId === config.id);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(careerMissions[0] || null);

  return (
    <div className="flex-1 min-h-[100dvh] bg-[#f8f9fa] text-zinc-900 font-sans flex pt-16">
       
       <div className="w-1/3 border-r border-zinc-200 bg-white flex flex-col h-full shrink-0">
          <div className="h-14 border-b border-zinc-200 flex items-center px-6 bg-zinc-50 font-semibold text-zinc-700">
             <Mail className="w-5 h-5 mr-3 text-zinc-400" /> Inbox
          </div>
          <div className="flex-1 overflow-y-auto">
             {careerMissions.map(m => (
                <div 
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className={`p-4 border-b border-zinc-100 cursor-pointer transition ${selectedMission?.id === m.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-zinc-50 border-l-4 border-l-transparent'}`}
                >
                   <div className="flex justify-between items-baseline mb-1">
                      <span className={`text-sm font-bold ${m.status === 'unread' ? 'text-zinc-900' : 'text-zinc-600'}`}>{m.sender.split('<')[0]}</span>
                      <span className="text-xs text-zinc-400">{m.timestamp}</span>
                   </div>
                   <h4 className={`text-sm mb-2 ${m.status === 'unread' ? 'font-bold text-zinc-800' : 'text-zinc-600'}`}>{m.subject}</h4>
                   <p className="text-xs text-zinc-500 truncate">{m.content}</p>
                </div>
             ))}
          </div>
       </div>

       <div className="flex-1 bg-[#f8f9fa] h-full flex flex-col overflow-hidden">
          {selectedMission ? (
             <div className="p-8 max-w-3xl w-full mx-auto flex flex-col h-full h-full overflow-y-auto">
                <div className="mb-8">
                   <h2 className="text-2xl font-bold text-zinc-900 mb-6">{selectedMission.subject}</h2>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                            {selectedMission.sender.charAt(0)}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-zinc-900">{selectedMission.sender}</div>
                            <div className="text-xs text-zinc-500">To: me</div>
                         </div>
                      </div>
                      <span className="text-sm text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4"/> {selectedMission.timestamp}</span>
                   </div>
                </div>

                <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-8 text-zinc-800 text-sm leading-relaxed mb-8 flex-1">
                   {selectedMission.content}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                   <h3 className="text-amber-800 font-bold text-sm tracking-wide uppercase mb-2 flex items-center gap-2">
                     <CheckCircle className="w-4 h-4" /> Current Objective
                   </h3>
                   <p className="text-amber-900">{selectedMission.objective}</p>
                </div>
             </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-zinc-400 flex-col gap-4">
                <Mail className="w-12 h-12 opacity-50" />
                No message selected
             </div>
          )}
       </div>

    </div>
  );
}
