import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldAlert, Cpu, Settings, Activity, Database, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CliWorkspace() {
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['CLI Operations Core Online.']);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>(['Establishing secure tunnel...', 'Secure tunnel established.']);
  
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const cmd = terminalInput.trim();
    setTerminalHistory(prev => [...prev, `sysuser@cli-nexus:~$ ${cmd}`]);
    
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === 'clear') {
      setTerminalHistory(['CLI Operations Core Online.']);
    } else if (lowerCmd === 'help') {
      setTerminalHistory(prev => [...prev, 'Available commands:\\nls - List layout\\nping [host] - Ping node\\ntop - System performance\\nclear - Clear session']);
    } else if (lowerCmd === 'ls') {
      setTerminalHistory(prev => [...prev, 'drwxr-xr-x  config\\ndrwxr-xr-x  system\\n-rw-r--r--  network.log\\n-rwx------  super_secure_exec.sh']);
    } else if (lowerCmd.startsWith('ping')) {
      setTerminalHistory(prev => [...prev, `PING ${lowerCmd.split(' ')[1] || '127.0.0.1'} (127.0.0.1): 56 data bytes\\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms`]);
    } else {
      setTerminalHistory(prev => [...prev, `bash: ${cmd}: command not found`]);
    }
    
    setLogs(prev => [`Executed: ${cmd}`, ...prev].slice(0, 15));
    setTerminalInput('');
  };

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <header className="h-[72px] bg-[#0a0f1c]/80 backdrop-blur-3xl flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 sticky top-0 shadow-sm border-b border-white/5">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center font-bold text-zinc-50 shadow-lg shadow-emerald-500/20 text-base flex-shrink-0">
              <TerminalIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[15px] lg:text-[17px] font-semibold tracking-tight text-zinc-50 truncate">
              CLI Operations <span className="text-zinc-500 font-normal ml-1 text-[11px] lg:text-sm">Nexus v2.1</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5 lg:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[12px] uppercase tracking-widest text-zinc-200">System Load</span>
              <div className="flex items-center gap-3">
                <div className="w-24 md:w-32 h-1.5 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 w-[15%] transition-all duration-500" />
                </div>
                <span className="text-[12px] font-mono font-bold text-emerald-400">15%</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-10">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-64 bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5">
            <div className="p-4">
              <h2 className="text-[11px] font-bold text-zinc-500 tracking-[0.2em] mb-3 uppercase">Navigation</h2>
              <div className="space-y-1">
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-[13px] font-medium bg-emerald-500/10 text-emerald-400">
                  <div className="flex items-center gap-3"><TerminalIcon className="w-4 h-4" /> Shell</div>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-[13px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5">
                  <div className="flex items-center gap-3"><Cpu className="w-4 h-4" /> Processes</div>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 lg:overflow-hidden relative z-10">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 h-full w-full flex flex-col bg-[#050505] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
                <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                  <TerminalIcon className="w-4 h-4 text-zinc-400" />
                  <span className="text-[12px] font-mono text-zinc-300 tracking-wider">BASH (user) - cli-nexus</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                  {terminalHistory.map((item, idx) => (<div key={idx} className="whitespace-pre-wrap mb-1">{item || ' '}</div>))}
                  <div ref={terminalBottomRef} />
                </div>
                <form onSubmit={executeCommand} className="w-full bg-[#0a0a0a] p-3 flex items-center gap-2 border-t border-white/5 shrink-0 focus-within:ring-1 focus-within:ring-white/10">
                  <span className="text-emerald-500 font-mono font-bold pl-2 truncate shrink-0">sysuser@cli-nexus:~$</span>
                  <input type="text" value={terminalInput} onChange={e => setTerminalInput(e.target.value)} autoFocus className="flex-1 bg-transparent text-zinc-300 font-mono text-[16px] lg:text-[13px] outline-none placeholder-zinc-700 ml-1 rounded-none" />
                </form>
             </motion.div>
          </div>
          
          <aside className="order-2 lg:order-none w-full lg:w-[260px] xl:w-[300px] bg-slate-900/40 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5">
            <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-200 flex items-center gap-2"><Activity className="w-4 h-4 opacity-50" /> System Stream</h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1.5 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active</span>
            </div>
            <div className="lg:flex-1 lg:overflow-y-auto p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-[12px] font-mono leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5 max-h-64 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 text-zinc-400">
                    <span className="opacity-50 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="break-words">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
