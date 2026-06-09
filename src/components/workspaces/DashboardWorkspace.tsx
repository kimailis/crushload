import React from 'react';
import { BarChart, Activity, PieChart, TrendingUp, Users, DollarSign, Briefcase, Zap, Check, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { CareerConfig } from '../../lib/career-config';
import { Mission } from '../../lib/mission-data';

export default function DashboardWorkspace({ config, type, activeMissions = [] }: { config: CareerConfig, type: string, activeMissions?: Mission[] }) {
  const getMetrics = () => {
    switch (type) {
      case 'marketing':
        return [
          { label: 'CAC', value: '$45.20', trend: '-2.4%' },
          { label: 'LTV', value: '$850.00', trend: '+12%' },
          { label: 'Conversion Rate', value: '4.2%', trend: '+0.5%' }
        ];
      case 'financial':
        return [
          { label: 'Revenue (Q3)', value: '$1.2M', trend: '+5.4%' },
          { label: 'OpEx', value: '$450k', trend: '-1.2%' },
          { label: 'Net Margin', value: '24%', trend: '+2%' }
        ];
      case 'analytics':
        return [
          { label: 'Unique Visitors', value: '842.1k', trend: '+14%' },
          { label: 'Query Latency', value: '45ms', trend: '-2ms' },
          { label: 'Data Processing', value: '1.2TB/d', trend: '+12%' }
        ];
      case 'cyber-architect':
        return [
          { label: 'Sec Score', value: '94/100', trend: '+2' },
          { label: 'Blocked Threats', value: '4,521', trend: '+45%' },
          { label: 'System Uptime', value: '99.99%', trend: '+0.01%' }
        ];
      case 'copywriter':
        return [
          { label: 'Word Count', value: '45k', trend: '+1.2k' },
          { label: 'Engagement Rate', value: '8.4%', trend: '+2.1%' },
          { label: 'Drafts Pending', value: '12', trend: '-3' }
        ];
      case 'economist':
        return [
          { label: 'Market Cap', value: '$2.4T', trend: '+1.5%' },
          { label: 'Inflation Rate', value: '2.4%', trend: '-0.1%' },
          { label: 'GDP Growth', value: '3.1%', trend: '+0.4%' }
        ];
      case 'data-analyst':
        return [
          { label: 'Active Dashboards', value: '24', trend: '+2' },
          { label: 'Queries Run', value: '8,421', trend: '+15%' },
          { label: 'Data Quality', value: '99.8%', trend: '+0.1%' }
        ];
      case 'data-engineer':
        return [
          { label: 'Pipeline Uptime', value: '99.9%', trend: '+0.2%' },
          { label: 'Data Processed', value: '4.5TB', trend: '+1TB' },
          { label: 'Failed Jobs', value: '3', trend: '-12' }
        ];
      case 'sysadmin':
        return [
          { label: 'Open Tickets', value: '42', trend: '-15' },
          { label: 'Avg Resolution Time', value: '4h 12m', trend: '-45m' },
          { label: 'Network Uptime', value: '99.99%', trend: '0%' }
        ];
      case 'investment-manager':
        return [
          { label: 'AUM', value: '$840M', trend: '+12%' },
          { label: 'Portfolio Alpha', value: '4.2%', trend: '+1.5%' },
          { label: 'Volatility', value: '12.4%', trend: '-2.1%' }
        ];
      case 'crypto-laundry':
        return [
          { label: 'Cleaned Volume', value: '$12.4M', trend: '+4.5%' },
          { label: 'Routing Nodes', value: '1,420', trend: '+150' },
          { label: 'Traceability', value: '1.2%', trend: '-0.5%' }
        ];
      case 'spy-manager':
        return [
          { label: 'Active Assets', value: '42', trend: '+3' },
          { label: 'Intel Gained', value: '85', trend: '+12' },
          { label: 'Cover Integrity', value: '98%', trend: '-2%' }
        ];
      default:
        return [
          { label: 'Active Users', value: '12,450', trend: '+15%' },
          { label: 'Bounce Rate', value: '42%', trend: '-5%' },
          { label: 'Avg Session', value: '4m 12s', trend: '+12s' }
        ];
    }
  };

  const metrics = getMetrics();

  const renderContextualWidget = () => {
    if (['marketing', 'copywriter', 'social-media'].includes(type) || type.includes('marketing') || type.includes('social')) {
        return (
          <>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><PieChart className="w-4 h-4" /> Content & Reach</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
               {[{l: 'Organic', p: 65, c: 'bg-indigo-500'}, {l: 'Paid', p: 25, c: 'bg-emerald-500'}, {l: 'Referral', p: 10, c: 'bg-rose-500'}].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <span className="text-xs font-bold w-20 text-zinc-300">{item.l}</span>
                     <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.c}`} style={{ width: `${item.p}%` }} />
                     </div>
                     <span className="text-xs font-mono font-bold text-zinc-500">{item.p}%</span>
                  </div>
               ))}
            </div>
          </>
        );
    }
    
    if (['financial', 'investment-manager', 'economist'].includes(type) || type.includes('finance')) {
         return (
          <>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Asset Allocation</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
               {[{l: 'Equities', p: 55, c: 'bg-indigo-500'}, {l: 'Fixed Inc.', p: 30, c: 'bg-amber-500'}, {l: 'Cash', p: 15, c: 'bg-emerald-500'}].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <span className="text-xs font-bold w-20 text-zinc-300">{item.l}</span>
                     <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.c}`} style={{ width: `${item.p}%` }} />
                     </div>
                     <span className="text-xs font-mono font-bold text-zinc-500">{item.p}%</span>
                  </div>
               ))}
            </div>
          </>
        );
    }

    if (['analytics', 'data-analyst', 'data-engineer'].includes(type) || type.includes('data')) {
          return (
          <>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Database className="w-4 h-4" /> Pipeline Health</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
               {[{l: 'Ingestion', v: 'Optimal', c: 'text-emerald-400'}, {l: 'Processing', v: 'Heavy Load', c: 'text-amber-400'}, {l: 'Export', v: 'Idle', c: 'text-zinc-400'}].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                     <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">{item.l}</span>
                     <span className={`text-xs font-mono font-bold ${item.c}`}>{item.v}</span>
                  </div>
               ))}
            </div>
          </>
          );
    }

    if (['spy-manager', 'crypto-laundry', 'darkweb-ops'].includes(type)) {
          return (
           <>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4" /> Operation Status</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
               {[{l: 'Anonymity', p: 98, c: 'bg-emerald-500'}, {l: 'Traceability', p: 12, c: 'bg-rose-500'}, {l: 'Network Health', p: 85, c: 'bg-indigo-500'}].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                     <span className="text-xs font-bold w-24 text-zinc-300">{item.l}</span>
                     <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.c}`} style={{ width: `${item.p}%` }} />
                     </div>
                     <span className="text-xs font-mono font-bold text-zinc-500">{item.p}%</span>
                  </div>
               ))}
            </div>
          </>
          );
    }

    return (
      <>
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4" /> System Load</h3>
        <div className="flex-1 flex flex-col justify-center gap-4">
           {[{l: 'CPU', p: 45, c: 'bg-indigo-500'}, {l: 'RAM', p: 78, c: 'bg-amber-500'}, {l: 'Net I/O', p: 25, c: 'bg-emerald-500'}].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                 <span className="text-xs font-bold w-16 text-zinc-300">{item.l}</span>
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.c}`} style={{ width: `${item.p}%` }} />
                 </div>
                 <span className="text-xs font-mono font-bold text-zinc-500">{item.p}%</span>
              </div>
           ))}
        </div>
      </>
    );
  };

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-8">
      <div className="mb-2 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white mb-1 capitalize">{type.split('-').join(' ')} Dashboard</h2>
        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Real-time metrics and KPIs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-6 rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <Activity className="w-12 h-12 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 relative z-10">{m.label}</p>
            <p className="text-4xl font-black text-white tracking-tight relative z-10">{m.value}</p>
            <p className={`text-sm font-bold mt-2 relative z-10 ${m.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {m.trend} vs last period
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-6 rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl min-h-[300px] flex flex-col">
           {renderContextualWidget()}
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="p-6 rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl min-h-[300px] flex flex-col">
           <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Ongoing Missions</h3>
           {activeMissions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-60">
                <Check className="w-8 h-8 mb-2 text-zinc-400" />
                <span className="text-[14px]">No active missions. Check Mailbox.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto">
                {activeMissions.map(m => (
                   <div key={m.id} className="p-4 rounded-[20px] bg-white/5 border border-white/5 text-left flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[14px] font-bold text-zinc-50">{m.subject}</h4>
                        <span className="text-[12px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">${m.missionRewardBudget?.toLocaleString()} Reward</span>
                      </div>
                      {m.objective && (
                        <p className="text-[13px] text-zinc-300 font-mono bg-black/20 p-2 rounded-lg border border-white/5 relative">
                           <Zap className="inline w-3 h-3 text-amber-400 mr-1.5" />{m.objective}
                        </p>
                      )}
                   </div>
                ))}
              </div>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
}
