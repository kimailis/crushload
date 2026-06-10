import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield, Command } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleLogin } from '@react-oauth/google';

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

      <div className="absolute top-6 left-6 z-[999]">
         <button 
           onClick={() => navigate('/')}
           className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer backdrop-blur-md shadow-lg"
         >
           <ArrowRight className="w-4 h-4 rotate-180" /> Back to Hub
         </button>
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
          
          <div className="mb-6 flex justify-center">
             <GoogleLogin
               onSuccess={(credentialResponse) => {
                 console.log(credentialResponse);
                 handleSSO();
               }}
               onError={() => {
                 console.log('Login Failed');
               }}
             />
          </div>

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
