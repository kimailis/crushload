import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
         <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition cursor-pointer mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
         </button>
         
         <div className="flex items-center gap-4 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white">Agent Profile</h1>
               <p className="text-zinc-400 flex items-center gap-2 mt-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Clearance Level: Top Secret</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Training Stats</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#111] p-3 rounded-2xl border border-white/5">
                     <span className="text-[13px] flex items-center gap-2"><Cpu className="w-4 h-4 text-zinc-500"/> Scenarios Completed</span>
                     <span className="text-white font-mono font-bold">14</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111] p-3 rounded-2xl border border-white/5">
                     <span className="text-[13px] flex items-center gap-2"><HardDrive className="w-4 h-4 text-zinc-500"/> Total Hours</span>
                     <span className="text-white font-mono font-bold">42h</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
