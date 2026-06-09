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
    <motion.div key="cli" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:h-[75vh] lg:min-h-[600px] w-full max-w-5xl mx-auto overflow-hidden bg-[#050505] border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
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
  );
}
