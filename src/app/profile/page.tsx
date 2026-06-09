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
               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Personal Details</h3>
               <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Email</span>
                     <span className="text-[14px] text-zinc-200 bg-[#111] px-4 py-2.5 rounded-xl border border-white/5">agent@crushload.net</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Employee ID</span>
                     <span className="text-[14px] text-zinc-200 bg-[#111] px-4 py-2.5 rounded-xl border border-white/5 font-mono">CL-4092-B</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                     <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Stress Tolerance</span>
                     <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 w-[65%]"></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col">
               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Cpu className="w-4 h-4" /> Training Stats</h3>
               <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center bg-[#111] p-3 rounded-2xl border border-white/5">
                     <span className="text-[13px] flex items-center gap-2"><Cpu className="w-4 h-4 text-zinc-500"/> Scenarios Completed</span>
                     <span className="text-white font-mono font-bold">14</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111] p-3 rounded-2xl border border-white/5">
                     <span className="text-[13px] flex items-center gap-2"><HardDrive className="w-4 h-4 text-zinc-500"/> Total Hours Simulated</span>
                     <span className="text-white font-mono font-bold">42h</span>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">Subscription</h3>
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 mb-4">
                     <p className="text-xs text-rose-200/70 mb-2">You are currently on the Free Track.</p>
                     <p className="text-sm text-rose-200 font-medium">Unlock Shadow Tracks (Premium)</p>
                  </div>
                  <button className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                     Upgrade to Premium
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
