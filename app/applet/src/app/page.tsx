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
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-24">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Immersive Simulations
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Experience the Reality of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">Corporate Chaos</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              CrushLoad trains you for modern tech and corporate careers by subjecting you to the exact soul-crushing scenarios you'll face on the job. No theory, just pure stress.
            </p>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career, i) => {
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
                  className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 p-8 flex flex-col items-start rounded-3xl cursor-pointer hover:bg-white/[0.05] transition-all relative overflow-hidden shadow-2xl"
                  onClick={() => handleEnterSim(career.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all shadow-lg`}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{career.name}</h3>
                  <div className="flex flex-col gap-2 mb-8 mt-2 w-full">
                     {career.metrics.map(m => (
                        <div key={m.id} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                          <span className="text-slate-500 font-medium">{m.name}</span>
                          <span className="text-slate-300 font-mono">{m.startValue}</span>
                        </div>
                     ))}
                  </div>
                  
                  <div className="mt-auto w-full group-hover:mt-auto relative z-10">
                     <div className="w-full bg-white/5 group-hover:bg-indigo-600 border border-white/10 group-hover:border-indigo-500 text-center py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2">
                        Enter Simulation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact Sales</a></li>
                  <li><a href="#" className="hover:text-white transition">Site Map</a></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold text-sm mb-4">Legal & Compliance</h4>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Compliance Center</a></li>
                  <li><a href="#" className="hover:text-white transition">Acceptable Use</a></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold text-sm mb-4">System</h4>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-white transition">Status</a></li>
                  <li><a href="#" className="hover:text-white transition">Documentation</a></li>
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
