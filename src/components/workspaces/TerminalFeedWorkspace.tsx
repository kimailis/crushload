import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, ActivitySquare, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function TerminalFeedWorkspace({ config }: { config: CareerConfig }) {
  const [news, setNews] = useState([
    'FEDERAL RESERVE HINTS AT RATE HIKE',
    'GLOBAL SUPPLY CHAIN CRISIS DEEPENS',
    'HOUSING MARKET SHOWS SIGNS OF COOLING',
  ]);
  
  const [dataPoints, setDataPoints] = useState([45, 52, 48, 60, 55, 65, 58, 70, 68]);

  useEffect(() => {
    const i = setInterval(() => {
      setNews(prev => [...prev.slice(1), ['INFLATION REACHES NEW 40-YEAR HIGH', 'TECH SECTOR LAYOFFS ACCELERATE', 'OIL PRICES SURGE ON GEOPOLITICAL TENSIONS'][Math.floor(Math.random() * 3)]]);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div key="terminal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto bg-[#0a0600]/80 text-[#ffaa00] font-mono overflow-hidden relative selection:bg-[#ffaa00] selection:text-black border border-[#ffaa00]/20 shadow-[0_0_30px_rgba(255,170,0,0.1)] rounded-[28px]">
      <div className="absolute inset-0 bg-transparent z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffaa00 1px, transparent 1px), linear-gradient(90deg, #ffaa00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full bg-[#0a0f1c]/30 backdrop-blur-md">
        {/* Ticker Tape Header */}
        <header className="h-[64px] bg-[#0a0600]/90 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 border-b border-[#ffaa00]/20 relative">
          <div className="flex items-center gap-4 shrink-0 pr-6 border-r border-[#ffaa00]/20 h-full">
             <h1 className="text-[13px] lg:text-[14px] font-bold tracking-widest text-[#ffaa00] uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,170,0,0.5)]">
               <ActivitySquare className="w-5 h-5 text-[#ffaa00]" />
               BI Terminal <span className="text-[#ffaa00]/30 mr-1">|</span> <span className="text-[#ffaa00]/70 font-mono text-[11px] lg:text-xs tracking-widest">LIVE_FEED</span>
             </h1>
          </div>
          
          <div className="flex-1 overflow-hidden flex items-center ml-6">
             <motion.div 
               animate={{ x: ["0%", "-50%"] }} 
               transition={{ ease: "linear", duration: 25, repeat: Infinity }}
               className="flex gap-16 pr-16 whitespace-nowrap"
             >
                {[...news, ...news].map((item, i) => (
                  <span key={i} className="text-[#ffaa00]/80 font-bold text-[12px] tracking-[0.2em] flex items-center gap-4">
                     <span className="w-1.5 h-1.5 bg-[#ffaa00] shadow-[0_0_8px_#ffaa00] rounded-full inline-block animate-pulse"></span> {item}
                  </span>
                ))}
             </motion.div>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-[#ffaa00]/20 h-full">
             <div className="flex items-center gap-2 bg-[#ffaa00]/10 px-3 py-1.5 rounded-md border border-[#ffaa00]/20 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ffaa00]/80 mt-0.5">Stream Active</span>
             </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
          
          <aside className="order-3 lg:order-none w-full lg:w-[240px] xl:w-[280px] bg-[#0a0600]/60 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-[#ffaa00]/20">
            <div className="p-4 border-b border-[#ffaa00]/20 bg-black/40 flex justify-between items-center shrink-0">
               <h2 className="text-[11px] font-bold text-[#ffaa00]/60 tracking-[0.2em] uppercase">Market Indices</h2>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#ffaa00]/20">
              {[
                { sym: 'SPX', val: '4,102.50', chg: '-1.2%', up: false },
                { sym: 'NDX', val: '12,400.10', chg: '-2.4%', up: false },
                { sym: 'US10Y', val: '3.85%', chg: '+0.15', up: true },
                { sym: 'VIX', val: '28.50', chg: '+4.2%', up: true },
              ].map(m => (
                <div key={m.sym} className="border border-[#ffaa00]/20 bg-[#0a0600]/80 p-4 flex flex-col relative overflow-hidden group transition duration-300 shadow-[0_0_15px_rgba(255,170,0,0.02)]">
                   <div className="absolute inset-0 bg-gradient-to-b from-[#ffaa00]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                   <span className="text-[10px] font-bold tracking-widest text-[#ffaa00]/50 mb-1">{m.sym}</span>
                   <div className="flex justify-between items-baseline">
                      <span className="text-[18px] font-bold tracking-tight text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,170,0,0.3)]">{m.val}</span>
                      <span className={`text-[10px] font-bold flex items-center tracking-widest ${m.up ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]'}`}>
                         {m.up ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
                         {m.chg}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden relative z-10">
             <div className="flex-1 h-full w-full flex flex-col bg-[#050505] border border-[#ffaa00]/20 rounded-[28px] overflow-hidden shadow-[0_0_30px_rgba(255,170,0,0.05)] relative">
                <div className="h-10 bg-[#0a0600] border-b border-[#ffaa00]/20 flex items-center px-4 gap-2 shrink-0">
                  <TerminalIcon className="w-4 h-4 text-[#ffaa00]/50" />
                  <span className="text-[11px] font-mono font-bold text-[#ffaa00]/80 tracking-widest uppercase">DEV_SALARY_VS_INFLATION.MDL</span>
                </div>
                
                <div className="flex-1 p-6 lg:p-8 relative flex items-end overflow-hidden">
                   {/* Mock Grid Background */}
                   <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#ffaa00 1px, transparent 1px), linear-gradient(90deg, #ffaa00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                   
                   <div className="w-full h-full flex items-end justify-between gap-3 relative z-10 pt-10">
                      {dataPoints.map((val, i) => (
                         <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: `${val}%` }}
                           transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                           className="w-full bg-gradient-to-t from-[#ffaa00]/20 to-[#ffaa00] opacity-80 border-t-[3px] border-[#ffaa00] relative group cursor-crosshair"
                         >
                            <div className="absolute inset-0 bg-[#ffaa00] opacity-0 group-hover:opacity-20 transition" />
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#ffaa00] opacity-0 group-hover:opacity-100 transition drop-shadow-[0_0_5px_#ffaa00] tracking-wider">
                               {val.toFixed(1)}
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
          
          <aside className="order-2 lg:order-none w-full lg:w-[280px] xl:w-[320px] bg-[#0a0600]/60 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-[#ffaa00]/20">
             <div className="p-4 border-b border-[#ffaa00]/20 bg-black/40 flex justify-between items-center shrink-0">
               <h2 className="text-[12px] font-bold text-[#ffaa00]/60 tracking-[0.2em] uppercase">Parameters</h2>
             </div>
             
             <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#ffaa00]/20 p-6 flex flex-col gap-6">
                <div>
                   <label className="text-[10px] font-bold tracking-[0.2em] text-[#ffaa00]/70 block mb-3 uppercase">Y-Axis Multiplier</label>
                   <input type="range" min="1" max="100" className="w-full accent-[#ffaa00] h-1.5 bg-[#ffaa00]/20 appearance-none rounded-none cursor-pointer border border-[#ffaa00]/30" />
                </div>
                <div>
                   <label className="text-[10px] font-bold tracking-[0.2em] text-[#ffaa00]/70 block mb-3 uppercase">Inflation Offset (%)</label>
                   <input type="number" defaultValue={8.5} className="w-full bg-black/60 border border-[#ffaa00]/30 text-[#ffaa00] p-3 focus:outline-none focus:border-[#ffaa00] focus:bg-[#ffaa00]/10 transition shadow-inner font-mono text-[14px]" />
                </div>
                <div>
                   <button onClick={() => setDataPoints(dataPoints.map(v => v + (Math.random() * 10 - 5)))} className="w-full bg-[#ffaa00]/10 hover:bg-[#ffaa00] text-[#ffaa00] hover:text-black border border-[#ffaa00]/50 py-3 transition-all duration-300 font-bold tracking-widest text-[11px] uppercase shadow-[0_0_15px_rgba(255,170,0,0.1)] hover:shadow-[0_0_20px_rgba(255,170,0,0.4)] cursor-pointer">
                      Recalculate Model
                   </button>
                </div>
                
                <div className="mt-auto pt-6">
                   <div className="border border-rose-500/40 bg-rose-950/40 p-5 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-sm shadow-inner group transition-colors hover:bg-rose-950/60">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/10 blur-[30px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
                      <AlertCircle className="w-6 h-6 text-rose-500 mb-3 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                      <span className="text-rose-400 font-bold tracking-[0.2em] mb-2 text-[11px] relative z-10 drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]">EXECUTIVE ORDER</span>
                      <p className="text-[11px] text-rose-300/80 leading-relaxed font-mono relative z-10 bg-black/60 p-4 border border-rose-500/30 w-full mt-2 shadow-inner">
                        "Find me a chart that shows inflation is making developers too expensive. We need to justify a 20% RIF."
                      </p>
                   </div>
                </div>
             </div>
          </aside>
        </main>
      </div>
    </motion.div>
  );
}
