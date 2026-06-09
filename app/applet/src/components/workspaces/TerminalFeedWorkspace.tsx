import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle } from 'lucide-react';
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
    <div className="flex-1 min-h-[100dvh] bg-black text-[#ffaa00] font-mono flex flex-col pt-16">
       {/* Ticker Tape */}
       <div className="h-10 bg-[#1a1100] border-b border-[#ffaa00]/30 flex items-center overflow-hidden shrink-0">
          <div className="flex w-full overflow-hidden whitespace-nowrap">
             <motion.div 
               animate={{ x: ["0%", "-50%"] }} 
               transition={{ ease: "linear", duration: 15, repeat: Infinity }}
               className="flex gap-16 pr-16"
             >
                {[...news, ...news].map((item, i) => (
                  <span key={i} className="text-[#ffaa00] font-bold text-sm tracking-widest flex items-center gap-4">
                     <span className="w-2 h-2 bg-[#ffaa00] rounded-full inline-block animate-pulse"></span> {item}
                  </span>
                ))}
             </motion.div>
          </div>
       </div>

       <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4 h-32 shrink-0">
             {[
               { sym: 'SPX', val: '4,102.50', chg: '-1.2%', up: false },
               { sym: 'NDX', val: '12,400.10', chg: '-2.4%', up: false },
               { sym: 'US10Y', val: '3.85%', chg: '+0.15', up: true },
               { sym: 'VIX', val: '28.50', chg: '+4.2%', up: true },
             ].map(m => (
               <div key={m.sym} className="border border-[#ffaa00]/30 bg-[#0a0600] p-4 flex flex-col justify-between">
                  <span className="text-sm font-bold text-[#ffaa00]/70">{m.sym}</span>
                  <div className="flex justify-between items-end">
                     <span className="text-2xl font-bold">{m.val}</span>
                     <span className={`text-sm font-bold flex items-center ${m.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {m.up ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                        {m.chg}
                     </span>
                  </div>
               </div>
             ))}
          </div>

          <div className="flex-1 flex gap-4 min-h-0">
             <div className="flex-[2] border border-[#ffaa00]/30 bg-[#0a0600] flex flex-col relative">
                <div className="p-3 border-b border-[#ffaa00]/30 flex justify-between items-center bg-[#1a1100]">
                   <span className="font-bold">DEV_SALARY_VS_INFLATION.MDL</span>
                   <span className="text-xs text-[#ffaa00]/50">[LIVE]</span>
                </div>
                <div className="flex-1 p-6 relative flex items-end">
                   {/* Mock Chart */}
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffaa00 1px, transparent 1px), linear-gradient(90deg, #ffaa00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                   
                   <div className="w-full h-full flex items-end justify-between gap-2 relative z-10 pt-10">
                      {dataPoints.map((val, i) => (
                         <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: `${val}%` }}
                           className="w-full bg-[#ffaa00]"
                         />
                      ))}
                   </div>
                </div>
             </div>

             <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="flex-1 border border-[#ffaa00]/30 bg-[#0a0600] flex flex-col">
                   <div className="p-3 border-b border-[#ffaa00]/30 bg-[#1a1100]">
                      <span className="font-bold">MODEL PARAMETERS</span>
                   </div>
                   <div className="p-4 space-y-4">
                      <div>
                         <label className="text-xs text-[#ffaa00]/70 block mb-1">Y-Axis Multiplier</label>
                         <input type="range" min="1" max="100" className="w-full accent-[#ffaa00]" />
                      </div>
                      <div>
                         <label className="text-xs text-[#ffaa00]/70 block mb-1">Inflation Offset</label>
                         <input type="number" defaultValue={8.5} className="w-full bg-black border border-[#ffaa00]/50 text-[#ffaa00] p-2 outline-none focus:border-[#ffaa00]" />
                      </div>
                      <button className="w-full bg-[#ffaa00]/20 hover:bg-[#ffaa00]/40 border border-[#ffaa00]/50 py-2 mt-4 transition font-bold">
                         REGENERATE REPORT
                      </button>
                   </div>
                </div>

                <div className="h-48 border border-rose-500/50 bg-[#1a0505] p-4 flex flex-col justify-center items-center text-center">
                   <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                   <span className="text-rose-500 font-bold mb-1">CEO DIRECTIVE RECEIVED</span>
                   <p className="text-xs text-rose-400/80">"Find me a chart that shows inflation is making developers too expensive. We need to justify a 20% RIF."</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
