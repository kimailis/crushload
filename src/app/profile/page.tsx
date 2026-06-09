import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Cpu, HardDrive, Sparkles, Trophy, Flame, Layers } from 'lucide-react';
import { motion } from 'motion/react';

const spring = { type: 'spring', stiffness: 320, damping: 26 } as const;

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-300 font-sans relative overflow-hidden">
      {/* Ambient light field */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-indigo-600/25 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/15 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] bg-teal-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition cursor-pointer mb-8 px-4 py-2 rounded-2xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/10 hover:bg-white/[0.08]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to careers
        </button>

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="relative rounded-[28px] bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 p-6 sm:p-8 mb-6 overflow-hidden shadow-[0_16px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full blur-3xl bg-indigo-500/30" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 shrink-0">
              <User className="w-9 h-9 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1.5">Agent Profile</h1>
              <p className="text-slate-400 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Clearance: Top Secret
              </p>
            </div>
            <div className="flex sm:flex-col gap-2 sm:text-right">
              <span className="text-[11px] font-mono text-slate-400 bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 rounded-full">CL-4092-B</span>
              <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3 py-1.5 rounded-full">Active</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, ...spring }}
            className="rounded-[28px] bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 p-6 sm:p-7"
          >
            <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.18em] mb-5 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Email</span>
                <span className="text-[14px] text-slate-200 bg-black/20 px-4 py-3 rounded-2xl ring-1 ring-white/[0.06]">agent@crushload.net</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">Employee ID</span>
                <span className="text-[14px] text-slate-200 bg-black/20 px-4 py-3 rounded-2xl ring-1 ring-white/[0.06] font-mono">CL-4092-B</span>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-400" /> Stress Tolerance</span>
                  <span className="text-[12px] font-mono text-slate-300">65%</span>
                </div>
                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden ring-1 ring-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats + subscription */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, ...spring }}
            className="rounded-[28px] bg-white/[0.04] backdrop-blur-2xl ring-1 ring-white/10 p-6 sm:p-7 flex flex-col"
          >
            <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.18em] mb-5 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Training Stats
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-black/20 ring-1 ring-white/[0.06] p-4 rounded-2xl flex flex-col gap-1">
                <Cpu className="w-4 h-4 text-indigo-300 mb-1" />
                <span className="text-2xl font-semibold text-white tracking-tight">14</span>
                <span className="text-[11px] text-slate-500 font-medium">Scenarios completed</span>
              </div>
              <div className="bg-black/20 ring-1 ring-white/[0.06] p-4 rounded-2xl flex flex-col gap-1">
                <HardDrive className="w-4 h-4 text-teal-300 mb-1" />
                <span className="text-2xl font-semibold text-white tracking-tight">42h</span>
                <span className="text-[11px] text-slate-500 font-medium">Hours simulated</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br from-indigo-600/30 via-fuchsia-600/20 to-transparent ring-1 ring-white/10">
                <div className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full blur-2xl bg-fuchsia-500/30" />
                <div className="relative">
                  <p className="text-[13px] font-semibold text-white mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Unlock the Shadow Tracks
                  </p>
                  <p className="text-[12px] text-slate-300/80 leading-relaxed mb-4">
                    You're on the free plan. Premium opens the high-stakes fictional roles.
                  </p>
                  <button className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold text-[13px] py-3 rounded-2xl transition cursor-pointer shadow-lg shadow-black/20">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-10 flex items-center justify-center gap-1.5">
          <Layers className="w-3 h-3" /> CrushLoad — all scenarios are fictional satire
        </p>
      </div>
    </div>
  );
}
