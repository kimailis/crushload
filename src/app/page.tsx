import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Briefcase, Terminal, Database, Rss, Layers, Lock, Unlock, ArrowRight, LogIn, PenTool, TrendingUp, GitMerge, LifeBuoy } from 'lucide-react';
import { motion } from 'motion/react';
import { CAREER_MAP } from '../lib/career-config';

export default function LandingPage() {
  const isAuthenticated = localStorage.getItem("sim_user_auth") === "true";
  const navigate = useNavigate();

  const handleEnterSim = (careerId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/sim/${careerId}`);
    }
  };

  const careers = Object.values(CAREER_MAP);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col">
      {/* Background gradients and spots */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-rose-500/10 blur-[180px] rounded-full mix-blend-screen" />
      </div>
      
      {/* Header */}
      <header className="h-20 px-6 sm:px-8 border-b border-white/5 bg-[#020617]/50 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-[17px] font-bold text-white tracking-wide">CrushLoad</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
             <div className="flex items-center gap-4">
               <Link to="/profile" className="text-sm font-medium text-slate-400 hover:text-white transition">My Profile</Link>
               <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-sm font-medium text-slate-400 hover:text-rose-400 transition cursor-pointer">Disconnect</button>
             </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-[14px] font-bold bg-white text-black hover:bg-slate-200 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition">
              <LogIn className="w-4 h-4" /> Agent Login
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Immersive Simulations
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Experience the Reality of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">Corporate Chaos</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              CrushLoad trains you for modern tech and corporate careers by subjecting you to the exact soul-crushing scenarios you'll face on the job. No theory, just pure stress.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {careers.filter(c => c.tier === 'free').map((career, i) => {
              const iconMap: Record<string, any> = {
                 'cyber-architect': Shield,
                 'copywriter': PenTool,
                 'economist': TrendingUp,
                 'data-analyst': Database,
                 'data-engineer': GitMerge,
                 'sysadmin': LifeBuoy
              };
              const Icon = iconMap[career.id] || Terminal;
              
              return (
                <motion.div 
                  key={career.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 p-6 flex flex-col items-start rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all relative overflow-hidden shadow-xl"
                  onClick={() => handleEnterSim(career.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between w-full items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all shadow-md`}>
                       <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">FREE TRACK</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{career.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed flex-1">
                     Experience the high-pressure stakes of being a {career.name.toLowerCase()} in an aggressive corporate structure. You will manage stakeholders, process critical data loops, and push past burnout.
                  </p>
                  
                  <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5 mb-6">
                     <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Initial Parameters</h4>
                     <div className="flex flex-col gap-1.5 w-full">
                        {career.metrics.map(m => (
                           <div key={m.id} className="flex items-center justify-between text-[11px]">
                             <span className="text-slate-400 font-medium">{m.name}</span>
                             <span className="text-slate-300 font-mono bg-white/5 px-1.5 py-0.5 rounded">{m.startValue}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="mt-auto w-full group-hover:mt-auto relative z-10">
                     <div className="w-full bg-white/5 group-hover:bg-indigo-600 border border-white/10 group-hover:border-indigo-500 text-center py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2">
                        Enter Simulation <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                </motion.div>
              );
            })}
         </div>

         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-10 text-center max-w-3xl mx-auto pt-10 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              CrushLoad Premium
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400">Shadow Tracks</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              High-stakes, illicit, or adrenaline-fueled scenarios. Only for subscribers looking for the ultimate risk exposure.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {careers.filter(c => c.tier === 'paid').map((career, i) => {
              const iconMap: Record<string, any> = {
                 'investment-manager': TrendingUp,
                 'crypto-laundry': GitMerge,
                 'cyber-activist': Terminal,
                 'spy-manager': Shield
              };
              const Icon = iconMap[career.id] || Lock;
              
              return (
                <motion.div 
                  key={career.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="group bg-[#0a0505] backdrop-blur-xl border border-rose-500/20 hover:border-rose-500/50 p-6 flex flex-col items-start rounded-2xl cursor-pointer transition-all relative overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.05)] hover:shadow-[0_0_60px_rgba(244,63,94,0.15)]"
                  onClick={() => handleEnterSim(career.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between w-full items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md`}>
                       <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-rose-500/50 group-hover:text-rose-400 transition-colors">
                       <Lock className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{career.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed flex-1">
                     Premium tier experience. Absorb the unrelenting stress of illicit activities, massive capital risk, and intense cyber warfare. Keep your sanity above zero, if you can.
                  </p>
                  
                  <div className="w-full bg-black/60 rounded-xl p-3 border border-rose-500/10 mb-6">
                     <h4 className="text-[10px] font-bold tracking-widest uppercase text-rose-500/70 mb-2">Risk Parameters</h4>
                     <div className="flex flex-col gap-1.5 w-full">
                        {career.metrics.map(m => (
                           <div key={m.id} className="flex items-center justify-between text-[11px]">
                             <span className="text-slate-400 font-medium">{m.name}</span>
                             <span className="text-rose-200 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded">{m.startValue}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="mt-auto w-full group-hover:mt-auto relative z-10">
                     <div className="w-full bg-rose-500/10 group-hover:bg-rose-600 border border-rose-500/20 group-hover:border-rose-500 text-center py-2.5 rounded-lg text-xs font-bold text-rose-300 group-hover:text-white transition-all shadow-md flex items-center justify-center gap-2">
                        Unlock Premium <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                </motion.div>
              );
            })}
         </div>
      </main>

      {/* Corporate Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020617]/80 backdrop-blur-xl py-12 mt-auto">
         <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                   <Layers className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-[14px] font-bold text-white">CrushLoad</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                 Preparing the next generation of knowledge workers for inevitable burnout through highly realistic crisis modeling.
               </p>
            </div>
            
            <div>
               <h4 className="text-white font-bold text-sm mb-4">Platform</h4>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link to="/sitemap" className="hover:text-white transition">Site Map</Link></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold text-sm mb-4">Legal & Compliance</h4>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                  <li><Link to="/compliance" className="hover:text-white transition">Compliance Center</Link></li>
                  <li><Link to="/acceptable-use" className="hover:text-white transition">Acceptable Use</Link></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-white/5 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between">
            <p>© {new Date().getFullYear()} CrushLoad Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <span>v2.4.9</span>
               <span>SOC2 Type II Certified</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
