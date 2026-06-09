import React, { useState } from 'react';
import { Landmark, TrendingUp, TrendingDown, ClipboardList, Briefcase, BarChart3, PieChart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';

interface ClassicFinancialData {
  symbol: string;
  name: string;
  peRatio: number;
  pbRatio: number;
  eps: number;
  debtEquity: number;
  roe: string;
  recommendation: 'STRONG BUY' | 'HOLD' | 'UNDERVALUED' | 'HIGH PE';
  targetPrice: number;
  income: {
    revenue: number;
    opex: number;
    ebitda: number;
    netIncome: number;
    margin: string;
  };
  balance: {
    cash: number;
    assets: number;
    liabilities: number;
    equity: number;
  };
  analystCommentary: string;
}

const SECURITY_DATABASE: Record<string, ClassicFinancialData> = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    peRatio: 64.2,
    pbRatio: 38.5,
    eps: 1.95,
    debtEquity: 0.15,
    roe: '48.2%',
    recommendation: 'STRONG BUY',
    targetPrice: 155.00,
    income: {
      revenue: 96020,
      opex: 18450,
      ebitda: 52400,
      netIncome: 38100,
      margin: '39.6%'
    },
    balance: {
      cash: 25900,
      assets: 65700,
      liabilities: 18200,
      equity: 47500
    },
    analystCommentary: 'GPU AI accelerator volume orders have reached historic peaks. Gross margins represent industry leading pricing authority on B200 and Blackwell server suites. High valuation justified by massive growth bounds.'
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    peRatio: 28.4,
    pbRatio: 31.2,
    eps: 6.42,
    debtEquity: 1.22,
    roe: '145.4%',
    recommendation: 'HOLD',
    targetPrice: 195.00,
    income: {
      revenue: 385600,
      opex: 54200,
      ebitda: 125800,
      netIncome: 97000,
      margin: '25.1%'
    },
    balance: {
      cash: 72600,
      assets: 343000,
      liabilities: 271000,
      equity: 72000
    },
    analystCommentary: 'Strong defensive characteristics with immense buyback allocation power ($110B). Service stream continues double digit growth offset by slower hardware device cycles. Maintain stable baseline hold rating.'
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    peRatio: 52.8,
    pbRatio: 9.8,
    eps: 3.31,
    debtEquity: 0.08,
    roe: '21.5%',
    recommendation: 'STRONG BUY',
    targetPrice: 215.00,
    income: {
      revenue: 96700,
      opex: 8850,
      ebitda: 18400,
      netIncome: 13400,
      margin: '13.8%'
    },
    balance: {
      cash: 29100,
      assets: 104500,
      liabilities: 26000,
      equity: 78500
    },
    analystCommentary: 'Full self-driving monetization and energy storage segment showing exponential expansion. Auto gross automotive margin shows structural compression due to pricing battles, but software segments offset liability.'
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    peRatio: 34.5,
    pbRatio: 12.4,
    eps: 11.80,
    debtEquity: 0.42,
    roe: '38.1%',
    recommendation: 'UNDERVALUED',
    targetPrice: 470.00,
    income: {
      revenue: 245100,
      opex: 58200,
      ebitda: 118400,
      netIncome: 86100,
      margin: '35.1%'
    },
    balance: {
      cash: 80400,
      assets: 485000,
      liabilities: 232000,
      equity: 253000
    },
    analystCommentary: 'Azure cloud expansion remains strong with direct enterprise copilot recurring subscription add-ons. Outstanding cash reserves present unparalleled acquisition buffers and software stability metrics.'
  }
};

export default function TradeDeskWorkspace({ config }: { config: CareerConfig }) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'ratios'>('income');
  const security = SECURITY_DATABASE[selectedSymbol] || SECURITY_DATABASE.NVDA;

  return (
    <motion.div key="trade-desk-invest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#02050b]/75 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        
        {/* Left Ticker List */}
        <aside className="w-full lg:w-[240px] bg-slate-950/40 backdrop-blur-3xl flex flex-col shrink-0 p-4 gap-4 overflow-y-auto">
          <div className="pb-2 border-b border-white/5 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-400" />
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Equity Coverage</h3>
          </div>
          
          <div className="space-y-1.5">
            {Object.keys(SECURITY_DATABASE).map(sym => {
              const sec = SECURITY_DATABASE[sym];
              return (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`w-full text-left p-3 rounded-xl transition flex flex-col border ${
                    selectedSymbol === sym 
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[13px] font-bold tracking-wide">{sec.symbol}</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-400">${sec.targetPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate mt-1">{sec.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Financial & Operational Data */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Header Panel */}
          <header className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black/10 shrink-0 gap-4">
            <div>
               <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{security.name}</h2>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">{security.symbol}</span>
               </div>
               <p className="text-[11px] text-zinc-500 font-mono tracking-wide uppercase mt-1">Fundamental Operational Analysis Desk</p>
            </div>
            
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-0.5 shadow-inner self-start sm:self-auto">
               <button 
                 onClick={() => setActiveTab('income')}
                 className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider transition ${
                   activeTab === 'income' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                 }`}
               >
                 Income
               </button>
               <button 
                 onClick={() => setActiveTab('balance')}
                 className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider transition ${
                   activeTab === 'balance' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                 }`}
               >
                 Balance Sheet
               </button>
               <button 
                 onClick={() => setActiveTab('ratios')}
                 className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider transition ${
                   activeTab === 'ratios' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                 }`}
               >
                 Ratios
               </button>
            </div>
          </header>

          {/* Statement Sheets */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-6">
             <AnimatePresence mode="wait">
                {activeTab === 'income' && (
                  <motion.div key="income" initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-4">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-indigo-400" /> Income Statement ($ in Millions)</h3>
                     <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                        {[{l: 'Gross Revenue', v: security.income.revenue}, {l: 'Operating Expenses', v: security.income.opex}, {l: 'EBITDA (Earnings before interest / taxes)', v: security.income.ebitda}, {l: 'Net Profit', v: security.income.netIncome}].map((row, idx) => (
                           <div key={idx} className="flex justify-between p-4 border-b border-white/5 text-[13px] hover:bg-white/5 transition duration-150">
                              <span className="text-zinc-400 font-medium">{row.l}</span>
                              <span className="font-mono font-bold text-white">${row.v.toLocaleString()}M</span>
                           </div>
                        ))}
                        <div className="flex justify-between p-4 bg-indigo-500/5 text-[13px]">
                           <span className="text-indigo-300 font-bold">Net Margin Ratio</span>
                           <span className="font-mono font-bold text-indigo-300">{security.income.margin}</span>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'balance' && (
                  <motion.div key="balance" initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-4">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Landmark className="w-4 h-4 text-emerald-400" /> Balance Sheet ($ in Millions)</h3>
                     <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                        {[{l: 'Cash & Cash Equivalents', v: security.balance.cash}, {l: 'Total Assets Booked', v: security.balance.assets}, {l: 'Total Listed Liabilities', v: security.balance.liabilities}, {l: 'Shareholder Equity Res', v: security.balance.equity}].map((row, idx) => (
                           <div key={idx} className="flex justify-between p-4 border-b border-white/5 text-[13px] hover:bg-white/5 transition duration-150">
                              <span className="text-zinc-400 font-medium">{row.l}</span>
                              <span className="font-mono font-bold text-white">${row.v.toLocaleString()}M</span>
                           </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'ratios' && (
                  <motion.div key="ratios" initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }} className="space-y-4">
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><PieChart className="w-4 h-4 text-amber-500" /> Valuation & Productivity Metrics</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">P/E Ratio (LTM)</span>
                           <span className="text-2xl font-mono font-black text-white">{security.peRatio}x</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Price to Book (P/B)</span>
                           <span className="text-2xl font-mono font-black text-white">{security.pbRatio}x</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Earnings Per Share (EPS)</span>
                           <span className="text-2xl font-mono font-black text-white">${security.eps.toFixed(2)}</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Debt to Equity Ratio</span>
                           <span className="text-2xl font-mono font-black text-white">{security.debtEquity}x</span>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>

             {/* Strategic Analyst Report Summary */}
             <div className="mt-auto bg-[#0a0f1c] border border-indigo-500/10 rounded-2xl p-5 flex gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                   <Info className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                     <h4 className="text-[12px] font-bold text-zinc-300 uppercase tracking-wide">Sec Analyst Consensus Rating</h4>
                     <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                       security.recommendation.includes('BUY') || security.recommendation.includes('UNDERVALUED')
                         ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                         : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                     }`}>
                       {security.recommendation}
                     </span>
                  </div>
                  <p className="text-[12px] text-zinc-400 leading-relaxed mt-2 italic">
                     "{security.analystCommentary}"
                  </p>
                </div>
             </div>

          </div>

        </main>

      </div>
    </motion.div>
  );
}
