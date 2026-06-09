import React, { useState } from 'react';
import { TrendingUp, Activity, ArrowUpRight, ArrowDownRight, DollarSign, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

export default function TradeDeskWorkspace({ config }: { config: CareerConfig }) {
  const [stocks, setStocks] = useState([
    { symbol: 'MEGACORP', price: 142.50, change: '+2.4%', up: true, volume: '1.2M' },
    { symbol: 'TECHON', price: 84.20, change: '-1.2%', up: false, volume: '450K' },
    { symbol: 'GLOBAL_SYS', price: 210.45, change: '+5.1%', up: true, volume: '2.1M' },
    { symbol: 'NEXUS_BIO', price: 45.30, change: '-4.5%', up: false, volume: '890K' },
  ]);
  const [tradeStatus, setTradeStatus] = useState<string | null>(null);

  const executeTrade = (type: string) => {
     setTradeStatus(`Executing ${type} ORDER...`);
     setTimeout(() => setTradeStatus(`Trade Confirmed: ${type} executing optimally.`), 1000);
     setTimeout(() => setTradeStatus(null), 3000);
  };

  return (
    <motion.div key="trade-desk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-8">
      <div className="mb-2 border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Live Trade Desk
        </h2>
        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Execute orders and manage portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stocks.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold tracking-wider text-sm">{s.symbol}</span>
              <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${s.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {s.change}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black">${s.price.toFixed(2)}</span>
              {s.up ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Vol: {s.volume}</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex-1 flex flex-col relative overflow-hidden">
        <h3 className="text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4 mb-auto">Order Execution</h3>
        
        <AnimatePresence>
          {tradeStatus && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-4 top-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold p-3 rounded-lg flex items-center justify-center gap-2">
               <CheckCircle className="w-4 h-4" /> {tradeStatus}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4 mt-auto">
            <button onClick={() => executeTrade('BUY')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.2)]">
               BUY MARKET
            </button>
            <button onClick={() => executeTrade('SELL')} className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_20px_rgba(225,29,72,0.2)]">
               SELL MARKET
            </button>
        </div>
      </div>
    </motion.div>
  );
}
