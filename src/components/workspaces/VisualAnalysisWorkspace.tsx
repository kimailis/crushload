import React, { useState } from 'react';
import { BarChart, AreaChart, PieChart, RefreshCcw, TrendingUp, HelpCircle, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

const DASHBOARD_DATA = {
  q1: {
    metrics: [
      { label: 'Active Web Users', value: '412.5k', trend: '+12.4%', trendUp: true },
      { label: 'Data Processing Cost', value: '$3,820', trend: '-8.1%', trendUp: true },
      { label: 'Report Accuracy', value: '99.92%', trend: '+0.04%', trendUp: true }
    ],
    bars: [
      { label: 'Ingest', val: 55, h: '55%' },
      { label: 'Transform', val: 78, h: '78%' },
      { label: 'Enrich', val: 42, h: '42%' },
      { label: 'Store', val: 90, h: '90%' },
      { label: 'Expose', val: 65, h: '65%' }
    ],
    linePoints: '10,90 40,70 70,85 100,50 130,40 160,55 190,30 220,15 250,25 280,10',
    traffic: [
      { label: 'North America', val: 56, color: 'bg-indigo-500' },
      { label: 'Europe Cluster', val: 28, color: 'bg-emerald-500' },
      { label: 'APAC Gateway', val: 16, color: 'bg-amber-500' }
    ]
  },
  q2: {
    metrics: [
      { label: 'Active Web Users', value: '488.2k', trend: '+18.3%', trendUp: true },
      { label: 'Data Processing Cost', value: '$4,110', trend: '+7.5%', trendUp: false },
      { label: 'Report Accuracy', value: '99.98%', trend: '+0.06%', trendUp: true }
    ],
    bars: [
      { label: 'Ingest', val: 70, h: '70%' },
      { label: 'Transform', val: 92, h: '92%' },
      { label: 'Enrich', val: 55, h: '55%' },
      { label: 'Store', val: 95, h: '95%' },
      { label: 'Expose', val: 82, h: '82%' }
    ],
    linePoints: '10,75 40,65 70,55 100,60 130,35 160,25 190,40 220,20 250,15 280,5',
    traffic: [
      { label: 'North America', val: 48, color: 'bg-indigo-500' },
      { label: 'Europe Cluster', val: 34, color: 'bg-emerald-500' },
      { label: 'APAC Gateway', val: 18, color: 'bg-amber-500' }
    ]
  }
};

export default function VisualAnalysisWorkspace() {
  const [selectedQuarter, setSelectedQuarter] = useState<'q1' | 'q2'>('q2');
  const [activeChartSource, setActiveChartSource] = useState<string | null>(null);
  const data = DASHBOARD_DATA[selectedQuarter];

  return (
    <motion.div key="analytics-dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-[600px] lg:h-[75vh] lg:min-h-[600px] w-full max-w-7xl mx-auto overflow-hidden bg-black/45 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl relative">
      <div className="absolute inset-0 bg-[#080a13]/70 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header toolbar */}
        <header className="h-[60px] bg-black/30 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 relative">
          <div className="flex items-center gap-3">
            <BarChart className="w-5 h-5 text-indigo-400" />
            <h1 className="text-[13px] sm:text-[14px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-2">
              Visual Analysis <span className="text-zinc-600">|</span> <span className="text-zinc-500 font-mono text-[11px] uppercase">Corporate KPIs</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mr-2">Timeframe:</span>
            <div className="flex bg-black/40 border border-white/10 rounded-lg p-0.5 shadow-inner">
              <button 
                onClick={() => setSelectedQuarter('q1')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider transition ${
                  selectedQuarter === 'q1' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Q1 FY26
              </button>
              <button 
                onClick={() => setSelectedQuarter('q2')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-wider transition ${
                  selectedQuarter === 'q2' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Q2 FY26
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Top 3 KPI metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.metrics.map((m, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition shadow-lg flex flex-col"
              >
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">{m.label}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white tracking-tight">{m.value}</span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    m.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {m.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[360px]">
            
            {/* Dept Processing - Bar chart (7 cols) */}
            <div className="bg-white/5 border border-white/5 rounded-[22px] p-5 lg:col-span-7 flex flex-col min-h-[300px] shadow-lg relative">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-[13px] font-bold text-zinc-300 tracking-wide uppercase">Pipeline Operational Load</h3>
                    <span className="text-[10px] text-indigo-400 font-mono">Simulated DB execution metrics</span>
                 </div>
                 <BarChart className="w-4 h-4 text-indigo-400" />
              </div>

              {/* Bar Layout */}
              <div className="flex-1 flex items-end justify-between gap-4 px-2 pt-6 relative">
                 <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/10" />
                 {data.bars.map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer relative">
                       <div 
                         className="absolute -top-7 text-[10px] font-mono font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1.5 py-0.5 rounded border border-white/5"
                       >
                         {bar.val}%
                       </div>
                       
                       {/* Animated Bar */}
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: bar.h }}
                         transition={{ duration: 0.8, delay: i * 0.05 }}
                         className="w-full bg-gradient-to-t from-indigo-600/30 to-indigo-500 rounded-t-lg relative overflow-hidden border-t-2 border-indigo-400"
                       >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-200" />
                       </motion.div>
                       
                       <span className="text-[10px] font-bold text-zinc-500 uppercase mt-3 tracking-widest">{bar.label}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* Traffic Distribution - Donut block (5 cols) */}
            <div className="bg-white/5 border border-white/5 rounded-[22px] p-5 lg:col-span-5 flex flex-col min-h-[300px] shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-[13px] font-bold text-zinc-300 tracking-wide uppercase">Regional Inbound Flow</h3>
                   <span className="text-[10px] text-emerald-400 font-mono">Cluster access weights</span>
                </div>
                <PieChart className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Horizontal Bars for Segment Distribution */}
              <div className="flex-grow flex flex-col justify-center gap-5">
                 {data.traffic.map((seg, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 group cursor-pointer" onClick={() => setActiveChartSource(seg.label)}>
                       <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-300 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">{seg.label}</span>
                          <span className="text-zinc-500 font-mono">{seg.val}%</span>
                       </div>
                       <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${seg.val}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${seg.color}`} 
                          />
                       </div>
                    </div>
                 ))}
              </div>

              {/* Small insight callback */}
              {activeChartSource && (
                <p className="mt-3 text-[10px] text-center font-mono text-emerald-400 animate-pulse uppercase tracking-wider">
                  Target: {activeChartSource} stream analyzed. status = optimal.
                </p>
              )}
            </div>

          </div>

          {/* Bottom Insights Block */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-[22px] p-5 flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0 shadow-inner">
               <Award className="w-5 h-5" />
             </div>
             <div>
                <h4 className="text-[13px] font-bold text-zinc-200 uppercase tracking-wide">Data Analyst Executive Report</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed mt-1">
                  Database latency has leveled down in {selectedQuarter.toUpperCase()}. Query workloads show optimized transformations. 
                  We recommend increasing standard cluster buffers prior to closing the Q3 marketing sprints to safe-keep data integrity metrics.
                </p>
             </div>
          </div>

        </main>
      </div>
    </motion.div>
  );
}
