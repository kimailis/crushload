import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, Command } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem("sim_user_auth", "true");
      navigate('/');
    }
  };

  const handleSSO = () => {
    localStorage.setItem("sim_user_auth", "true");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-300 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
           <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-6">
             <Command className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Agent Access</h1>
           <p className="text-slate-400">Authenticate to enter the CrushLoad network</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative">
          
          <button onClick={handleSSO} className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition hover:bg-slate-200 mb-6 group">
             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
             <div className="h-px bg-white/10 flex-1" />
             <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Or Secure Login</span>
             <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1.5">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  autoFocus
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder-slate-600 focus:bg-white/[0.07]"
                  placeholder="agent@crushload.net"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1.5 flex justify-between">
                 Password
                 <a href="#" className="text-indigo-400 hover:text-indigo-300 normal-case tracking-normal">Forgot?</a>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder-slate-600 focus:bg-white/[0.07]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer mt-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Authenticate <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-500 mt-8 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> FIPS 140-2 Level 3 Encrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
