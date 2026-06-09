import React, { useState, useEffect } from 'react';
import { CandlestickChart, TrendingUp, TrendingDown, Clock, Wallet, DollarSign, RefreshCw, Briefcase, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StockTicker {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  candles: { open: number, close: number, high: number, low: number, volume: number }[];
}

const DEFAULT_STOCKS: StockTicker[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 125.40,
    changePercent: 4.85,
    candles: [
      { open: 118, close: 120, high: 122, low: 117, volume: 450 },
      { open: 120, close: 122, high: 124, low: 119, volume: 520 },
      { open: 122, close: 121, high: 123, low: 120, volume: 380 },
      { open: 121, close: 124, high: 125, low: 121, volume: 600 },
      { open: 124, close: 123.50, high: 126, low: 122.50, volume: 410 },
      { open: 123.50, close: 125.40, high: 127, low: 123, volume: 640 }
    ]
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.20,
    changePercent: -1.25,
    candles: [
      { open: 185, close: 184, high: 186, low: 183, volume: 300 },
      { open: 184, close: 185.20, high: 187, low: 183.50, volume: 290 },
      { open: 185.20, close: 183, high: 186, low: 182, volume: 340 },
      { open: 183, close: 181.50, high: 184, low: 181, volume: 400 },
      { open: 181.50, close: 183.10, high: 185, low: 181.20, volume: 310 },
      { open: 183.10, close: 182.20, high: 184.50, low: 181.80, volume: 360 }
    ]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 174.50,
    changePercent: 8.12,
    candles: [
      { open: 155, close: 158, high: 160, low: 154, volume: 800 },
      { open: 158, close: 162, high: 164, low: 157, volume: 920 },
      { open: 162, close: 160, high: 165, low: 159, volume: 750 },
      { open: 160, close: 168, high: 170, low: 160, volume: 1100 },
      { open: 168, close: 171.20, high: 173, low: 166, volume: 850 },
      { open: 171.20, close: 174.50, high: 178, low: 170, volume: 1250 }
    ]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.80,
    changePercent: 0.45,
    candles: [
      { open: 412, close: 414, high: 416, low: 411, volume: 210 },
      { open: 414, close: 413, high: 415, low: 412, volume: 190 },
      { open: 413, close: 415.50, high: 417, low: 413, volume: 240 },
      { open: 415.50, close: 414.20, high: 418, low: 414, volume: 220 },
      { open: 414.20, close: 416, high: 417.50, low: 413.50, volume: 200 },
      { open: 416, close: 415.80, high: 418, low: 415, volume: 250 }
    ]
  }
];

export default function StockCandlestickWorkspace() {
  const [stocks, setStocks] = useState<StockTicker[]>(DEFAULT_STOCKS);
  const [selectedSymbol, setSelectedSymbol] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'MSFT'>('NVDA');
  
  // Simulated portfolio state
  const [portfolioCapital, setPortfolioCapital] = useState<number>(100000); // $100k starting Cash
  const [holdings, setHoldings] = useState<Record<string, { qty: number, avgPrice: number }>>({
    NVDA: { qty: 100, avgPrice: 120 },
    AAPL: { qty: 50, avgPrice: 180 }
  });
  const [tradeLogs, setTradeLogs] = useState<string[]>(['Portfolio opened with initial cash reserve of $100,000.']);
  
  // Timer system (3 minutes = 180 seconds)
  const [secondsLeft, setSecondsLeft] = useState(180);
  const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          triggerNewTick();
          return 180;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stocks]);

  // Generates next tick prices for all stocks
  const triggerNewTick = () => {
    setStocks(prev => prev.map(s => {
      const lastCandle = s.candles[s.candles.length - 1];
      const changePct = (Math.random() * 6 - 3); // -3% to +3% change
      const newClose = parseFloat((s.price * (1 + changePct / 100)).toFixed(2));
      const newOpen = s.price;
      const low = parseFloat((Math.min(newOpen, newClose) - (Math.random() * 2)).toFixed(2));
      const high = parseFloat((Math.max(newOpen, newClose) + (Math.random() * 2)).toFixed(2));
      const volume = Math.floor(Math.random() * 800 + 100);

      const updatedCandles = [...s.candles.slice(1), { open: newOpen, close: newClose, high, low, volume }];
      const totalInitialClose = s.candles[0].close;
      const diffFromInitial = ((newClose - totalInitialClose) / totalInitialClose) * 100;

      return {
        ...s,
        price: newClose,
        changePercent: parseFloat(diffFromInitial.toFixed(2)),
        candles: updatedCandles
      };
    }));
    
    setSecondsLeft(180);
    setTradeLogs(prev => [`Market Heartbeat: Prices synchronized across tickers at UTC ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 15));
  };

  // Buy Share handler
  const handleBuy = (qty: number) => {
    const cost = selectedStock.price * qty;
    if (cost > portfolioCapital) {
      alert('Insufficient available capital to cover buy order!');
      return;
    }

    setPortfolioCapital(prev => prev - cost);
    setHoldings(prev => {
      const current = prev[selectedSymbol] || { qty: 0, avgPrice: 0 };
      const totalQty = current.qty + qty;
      const avgPrice = parseFloat(((current.qty * current.avgPrice + cost) / totalQty).toFixed(2));
      return {
        ...prev,
        [selectedSymbol]: { qty: totalQty, avgPrice }
      };
    });

    setTradeLogs(prev => [
      `BUY EXECUTED: Purchased ${qty} shares of ${selectedSymbol} at $${selectedStock.price.toFixed(2)} for a total of $${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      ...prev
    ]);
  };

  // Sell Share handler
  const handleSell = (qty: number) => {
    const currentHolding = holdings[selectedSymbol] || { qty: 0, avgPrice: 0 };
    if (qty > currentHolding.qty) {
      alert('Cannot sell more shares than currently held!');
      return;
    }

    const proceeds = selectedStock.price * qty;
    setPortfolioCapital(prev => prev + proceeds);
    setHoldings(prev => {
      const nextHoldings = { ...prev };
      const remaining = currentHolding.qty - qty;
      if (remaining === 0) {
        delete nextHoldings[selectedSymbol];
      } else {
        nextHoldings[selectedSymbol] = { qty: remaining, avgPrice: currentHolding.avgPrice };
      }
      return nextHoldings;
    });

    setTradeLogs(prev => [
      `SELL EXECUTED: Disposed of ${qty} shares of ${selectedSymbol} at $${selectedStock.price.toFixed(2)} generating yields of $${proceeds.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      ...prev
    ]);
  };

  // Calculations for current holdings evaluation
  const activeHolding = holdings[selectedSymbol] || { qty: 0, avgPrice: 0 };
  const totalHoldingsValue = Object.keys(holdings).reduce((acc, sym) => {
    const stk = stocks.find(s => s.symbol === sym);
    if (!stk) return acc;
    return acc + (holdings[sym].qty * stk.price);
  }, 0);
  const totalPortfolioValue = portfolioCapital + totalHoldingsValue;

  return (
    <motion.div key="stocks-candlestick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      
      {/* Absolute decor grid */}
      <div className="absolute inset-0 bg-[#040909]/80 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-950/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      {/* Column 1: Ticker Select on Left */}
      <aside className="relative z-10 w-full lg:w-[220px] bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 p-4 gap-4 overflow-y-auto">
        <div className="pb-2 border-b border-white/5">
           <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-500" /> Watch Securities</h3>
        </div>
        
        <div className="space-y-2">
          {stocks.map(stk => (
             <button
               key={stk.symbol}
               onClick={() => setSelectedSymbol(stk.symbol as any)}
               className={`w-full text-left p-3 rounded-xl border transition flex flex-col ${
                 selectedSymbol === stk.symbol 
                   ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                   : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
               }`}
             >
                <div className="flex justify-between items-center w-full">
                   <span className="text-[13px] font-bold tracking-wide text-white">{stk.symbol}</span>
                   <span className={`text-[10px] font-mono font-bold ${stk.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stk.changePercent >= 0 ? '+' : ''}{stk.changePercent}%
                   </span>
                </div>
                <div className="flex justify-between items-center w-full mt-1.5 text-[10px] font-mono">
                   <span className="text-zinc-500 truncate max-w-[120px]">{stk.name}</span>
                   <span className="text-zinc-300 font-bold">${stk.price.toFixed(2)}</span>
                </div>
             </button>
          ))}
        </div>

        {/* Sync Countdown Timer */}
        <div className="mt-auto bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col gap-2 relative">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-400" /> Next Price Tick</span>
              <span className="text-[11px] font-mono font-bold text-indigo-300">{Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}</span>
           </div>
           
           <button onClick={triggerNewTick} className="w-full text-[9px] font-bold bg-white/5 hover:bg-white/10 text-zinc-300 py-1.5 rounded-lg border border-white/5 transition flex items-center justify-center gap-1 cursor-pointer">
              <RefreshCw className="w-2.5 h-2.5" /> FORCE REFRESH TICK
           </button>
        </div>
      </aside>

      {/* Main Candlestick Chart section */}
      <section className="relative z-10 flex-grow flex flex-col p-4 lg:p-6 overflow-hidden gap-6 justify-between min-w-0">
          
          {/* Header parameters */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <div>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black text-white">{selectedStock.symbol}</span>
                   <span className="text-xs text-zinc-500 font-bold">{selectedStock.name}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest mt-1 block">Live Candlestick Feed</span>
             </div>
             
             <div className="flex gap-6 text-right">
                <div>
                   <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Current Price</span>
                   <span className="text-xl font-bold font-mono text-white">${selectedStock.price.toFixed(2)}</span>
                </div>
                <div>
                   <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Session Change</span>
                   <span className={`text-xl font-bold font-mono ${selectedStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedStock.changePercent >= 0 ? '▲' : '▼'} {selectedStock.changePercent}%
                   </span>
                </div>
             </div>
          </div>

          {/* SVG Candlestick Chart Canvas */}
          <div className="flex-grow bg-slate-950/60 border border-white/5 rounded-2xl overflow-hidden relative p-4 flex flex-col justify-end min-h-[220px]">
             {/* Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-10 pointer-events-none">
                <div className="border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-b border-white" />
             </div>

             {/* Render high candles map with SVGs */}
             <div className="flex-grow flex items-end justify-between px-6 pt-10 pb-2 relative z-10">
                {(() => {
                   // Calculate heights using mock percentage scales of the box
                   // Let's safe-scale open, close, high, low on a scale relative to other points
                   const minVal = Math.min(...selectedStock.candles.map(item => item.low));
                   const maxVal = Math.max(...selectedStock.candles.map(item => item.high));
                   const delta = maxVal - minVal || 1;

                   const pct = (val: number) => ((val - minVal) / delta) * 100;

                   return selectedStock.candles.map((c, i) => {
                   const isBullish = c.close >= c.open;
                   const bottomY = 100 - pct(Math.max(c.open, c.close));
                   const heightY = Math.max(Math.abs(pct(c.open) - pct(c.close)), 3); // minimum 3% height visible
                   const wickTop = 100 - pct(c.high);
                   const wickBottom = 100 - pct(c.low);

                   return (
                     <div key={i} className="flex-1 flex flex-col items-center relative h-full">
                        {/* Vertical Wick (low to high) */}
                        <div 
                          className={`absolute w-[2px] ${isBullish ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ top: `${wickTop}%`, bottom: `${100 - wickBottom}%` }}
                        />
                        
                        {/* Candle Body */}
                        <div 
                          className={`absolute w-[20px] md:w-[32px] rounded border ${
                            isBullish 
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                              : 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                          }`}
                          style={{ top: `${bottomY}%`, height: `${heightY}%` }}
                        />

                        {/* Volume bar underneath */}
                        <div 
                          className={`absolute bottom-0 w-[14px] md:w-[20px] transition rounded ${
                            isBullish ? 'bg-emerald-500/40' : 'bg-rose-500/40'
                          }`}
                          style={{ height: `${(c.volume / 1500) * 20}%` }}
                        />
                     </div>
                   );
                   });
                })()}
             </div>
          </div>

          {/* Holdings, Port Ledger & Buy/Sell panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Trade Desk orders */}
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                   <h4 className="text-[12px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Wallet className="w-4 h-4 text-emerald-500" /> Execute Spot Orders</h4>
                   <p className="text-[11px] text-zinc-500 font-mono">Account Cash Reserve: ${portfolioCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                   <button 
                     onClick={() => handleBuy(25)}
                     className="bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 text-white py-3 rounded-xl font-bold text-[12px] transition cursor-pointer text-center"
                   >
                     BUY 25 @ ${selectedStock.price.toFixed(2)}
                   </button>
                   <button 
                     onClick={() => handleSell(25)}
                     className="bg-rose-600 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-600/20 text-white py-3 rounded-xl font-bold text-[12px] transition cursor-pointer text-center"
                   >
                     SELL 25 @ ${selectedStock.price.toFixed(2)}
                   </button>
                </div>
             </div>

             {/* Ledger Portfolio position */}
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div>
                     <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-400" /> Holdings Audit</h4>
                     <p className="text-[10px] text-zinc-500 font-mono">NAV Capital: ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                   </div>
                   
                   <div className="text-right">
                     <span className="text-[10px] text-zinc-500 font-mono block">Active Share Count</span>
                     <span className="text-[15px] font-mono font-bold text-white">{activeHolding.qty} Units</span>
                   </div>
                </div>

                <div className="flex justify-between items-center text-[11px] border-t border-white/5 pt-3 mt-2 font-mono">
                   <div>
                      <span className="text-zinc-500 block text-[9px]">AVG COST BASIS</span>
                      <span className="text-zinc-300 font-bold">${activeHolding.avgPrice.toFixed(2)}</span>
                   </div>
                   <div>
                      <span className="text-zinc-500 block text-[9px]">CURRENT VALUE</span>
                      <span className="text-zinc-300 font-bold">${(activeHolding.qty * selectedStock.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                   </div>
                   <div>
                      <span className="text-zinc-500 block text-[9px]">TOTAL RETURN</span>
                      <span className={`font-bold ${
                        (selectedStock.price - activeHolding.avgPrice) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                         {activeHolding.qty > 0 
                           ? `$${((selectedStock.price - activeHolding.avgPrice) * activeHolding.qty).toLocaleString(undefined, { maximumFractionDigits: 2 })}` 
                           : '$0.00'}
                      </span>
                   </div>
                </div>
             </div>
          </div>

      </section>

      {/* Column 3: Live Transactions Log (Width: 280px) */}
      <aside className="relative z-10 w-full lg:w-[280px] bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 p-4 gap-4 overflow-y-auto">
         <div className="pb-2 border-b border-white/5">
            <h3 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Trade History Ledger</h3>
         </div>
         <div className="flex-grow overflow-y-auto space-y-2.5 max-h-[220px] lg:max-h-full scrollbar-thin scrollbar-thumb-white/10 pr-1">
            {tradeLogs.map((log, i) => (
               <div key={i} className="text-[11px] font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5 text-zinc-400 selection:bg-indigo-500/20">
                  {log}
               </div>
            ))}
         </div>
      </aside>

    </motion.div>
  );
}
