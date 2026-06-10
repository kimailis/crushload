import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Activity as ActivityIcon, CheckCircle, AlertTriangle, ShieldAlert, Zap, History, LayoutDashboard, Mail, Server, Terminal, MessageSquare, PenTool, FileText, TrendingUp, BookOpen, CheckSquare, Database, PieChart, Bell, GitMerge, AlignLeft, LifeBuoy, Users, Monitor, Box, Play, AlertCircle, Briefcase } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CAREER_MAP } from '../../../lib/career-config';
import { INITIAL_MISSIONS, Mission } from '../../../lib/mission-data';
import { MissionOption } from '../../../types';
import AdvisorChat, { AdvisorPersona, AdvisorMessage } from '../../../components/AdvisorChat';
import CliWorkspace from '../../../components/workspaces/CliWorkspace';
import SqlWorkspace from '../../../components/workspaces/SqlWorkspace';
import EditorWorkspace from '../../../components/workspaces/EditorWorkspace';
import TicketingWorkspace from '../../../components/workspaces/TicketingWorkspace';
import DagViewerWorkspace from '../../../components/workspaces/DagViewerWorkspace';
import TerminalFeedWorkspace from '../../../components/workspaces/TerminalFeedWorkspace';
import TopologyWorkspace from '../../../components/workspaces/TopologyWorkspace';
import DashboardWorkspace from '../../../components/workspaces/DashboardWorkspace';
import ExcelWorkspace from '../../../components/workspaces/ExcelWorkspace';
import SocialFeedWorkspace from '../../../components/workspaces/SocialFeedWorkspace';
import CyberSecSim from '../../../components/CyberSecSim';
import InboxWorkspace from '../../../components/workspaces/InboxWorkspace';
import TradeDeskWorkspace from '../../../components/workspaces/TradeDeskWorkspace';
import OffshoreAccountsWorkspace from '../../../components/workspaces/OffshoreAccountsWorkspace';
import DarkWebWorkspace from '../../../components/workspaces/DarkWebWorkspace';
import AssetMapWorkspace from '../../../components/workspaces/AssetMapWorkspace';
import StockCandlestickWorkspace from '../../../components/workspaces/StockCandlestickWorkspace';
import ActiveDirectoryWorkspace from '../../../components/workspaces/ActiveDirectoryWorkspace';
import VisualAnalysisWorkspace from '../../../components/workspaces/VisualAnalysisWorkspace';
import FieldIntelWorkspace from '../../../components/workspaces/FieldIntelWorkspace';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// Tailwind cannot generate classes from dynamic strings like `text-${color}-400`,
// so metric colors from career-config are mapped to static class names here.
const METRIC_COLOR_CLASSES: Record<string, string> = {
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  blue: 'text-blue-400',
  violet: 'text-violet-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
};

const CAREER_TOOLING: Record<string, {
  stakeholders: { id: string, name: string, role: string, avatar: string }[],
  systemChecks: { label: string, status: string, color: string }[],
  actionLabel: string,
  actionIcon: React.ElementType,
  actionDesc: string
}> = {
  'copywriter': {
    stakeholders: [
      { id: 'cd', name: 'Don Draper', role: 'Creative Director', avatar: '👔' },
      { id: 'client', name: 'Generic Corp', role: 'Key Client', avatar: '🏢' },
      { id: 'legal', name: 'Legal Dept', role: 'Compliance', avatar: '⚖️' }
    ],
    systemChecks: [
      { label: 'Grammar Engine', status: 'ONLINE', color: 'text-emerald-400' },
      { label: 'Plagiarism Checker', status: 'ONLINE', color: 'text-emerald-400' },
      { label: 'Tone Analyzer', status: 'CALIBRATING', color: 'text-amber-400' }
    ],
    actionLabel: 'Run Spellcheck AI',
    actionIcon: Zap,
    actionDesc: 'Runs automated AI verification.'
  },
  'economist': {
    stakeholders: [
      { id: 'editor', name: 'Chief Editor', role: 'Publications', avatar: '📰' },
      { id: 'gov', name: 'Fed Reserve', role: 'Data Source', avatar: '🏛️' },
      { id: 'trader', name: 'Desk Trader', role: 'Consumer', avatar: '📈' }
    ],
    systemChecks: [
      { label: 'Bloomberg Feed', status: 'LIVE', color: 'text-emerald-400' },
      { label: 'SEC Edgar', status: 'SYNCED', color: 'text-emerald-400' },
      { label: 'Macro Models', status: 'COMPUTING', color: 'text-amber-400' }
    ],
    actionLabel: 'Fetch CPI Data',
    actionIcon: Database,
    actionDesc: 'Pulls latest macro figures.'
  },
  'data-analyst': {
    stakeholders: [
      { id: 'pm', name: 'Sarah PM', role: 'Product Manager', avatar: '👩‍💼' },
      { id: 'vp', name: 'VP of Sales', role: 'Stakeholder', avatar: '📊' },
      { id: 'eng', name: 'Data Eng Team', role: 'Infra', avatar: '⚙️' }
    ],
    systemChecks: [
      { label: 'Redshift Cluster', status: 'ONLINE', color: 'text-emerald-400' },
      { label: 'Metabase', status: 'DEGRADED', color: 'text-amber-400' },
      { label: 'BI Refresh', status: 'LAGGING', color: 'text-rose-400' }
    ],
    actionLabel: 'Optimize Query',
    actionIcon: Zap,
    actionDesc: 'Rewrites SQL for performance.'
  },
  'data-engineer': {
    stakeholders: [
      { id: 'analyst', name: 'Data Analysts', role: 'Consumers', avatar: '📉' },
      { id: 'ds', name: 'Data Science', role: 'Model Training', avatar: '🤖' },
      { id: 'ops', name: 'Cloud Ops', role: 'Infrastructure', avatar: '☁️' }
    ],
    systemChecks: [
      { label: 'Airflow Cluster', status: 'HEALTHY', color: 'text-emerald-400' },
      { label: 'Kafka Stream', status: 'BACKPRESSURE', color: 'text-amber-400' },
      { label: 'Snowflake', status: 'ONLINE', color: 'text-emerald-400' }
    ],
    actionLabel: 'Trigger Target DAG',
    actionIcon: Play,
    actionDesc: 'Force runs delayed pipelines.'
  },
  'sysadmin': {
    stakeholders: [
      { id: 'ceo', name: 'Angry CEO', role: 'VIP', avatar: '🤬' },
      { id: 'hr', name: 'HR Dept', role: 'Onboarding', avatar: '👥' },
      { id: 'users', name: 'End Users', role: 'Victims', avatar: '🧟' }
    ],
    systemChecks: [
      { label: 'Active Directory', status: 'SYNCED', color: 'text-emerald-400' },
      { label: 'Exchange Server', status: 'RESTARTING', color: 'text-amber-400' },
      { label: 'Office WiFi', status: 'DOWN', color: 'text-rose-400' }
    ],
    actionLabel: 'Bulk Resolve Tickets',
    actionIcon: CheckSquare,
    actionDesc: 'Automatically close stale requests.'
  },
  'investment-manager': {
    stakeholders: [
      { id: 'whales', name: 'Whale Client A', role: 'High Net Worth', avatar: '🐋' },
      { id: 'compliance', name: 'SEC Monitor', role: 'Oversight', avatar: '👁️' },
      { id: 'algo', name: 'HFT Algo #4', role: 'Execution', avatar: '🤖' }
    ],
    systemChecks: [
      { label: 'Latency Node', status: '<1ms', color: 'text-emerald-400' },
      { label: 'Risk Model', status: 'EXPOSED', color: 'text-rose-400' },
      { label: 'Margin Calls', status: 'PENDING', color: 'text-amber-400' }
    ],
    actionLabel: 'Hedge Portfolio',
    actionIcon: TrendingUp,
    actionDesc: 'Executes rapid short positions.'
  },
  'crypto-laundry': {
    stakeholders: [
      { id: 'cartel', name: 'The Cartel', role: 'Supplier', avatar: '🦅' },
      { id: 'fbi', name: 'Task Force', role: 'Adversary', avatar: '🕵️' },
      { id: 'mule', name: 'Mule Network', role: 'Distribution', avatar: '🐴' }
    ],
    systemChecks: [
      { label: 'Tornado Cash', status: 'MIXING', color: 'text-amber-400' },
      { label: 'Monero Nodes', status: 'SYNCED', color: 'text-emerald-400' },
      { label: 'Chainalysis', status: 'TRACKING', color: 'text-rose-400' }
    ],
    actionLabel: 'Scramble TXs',
    actionIcon: GitMerge,
    actionDesc: 'Bounces funds across 14 chains.'
  },
  'cyber-activist': {
    stakeholders: [
      { id: 'anon', name: 'Legion', role: 'Collective', avatar: '🎭' },
      { id: 'target', name: 'MegaCorpGov', role: 'Target', avatar: '🏢' },
      { id: 'media', name: 'Journalists', role: 'Amplifiers', avatar: '📰' }
    ],
    systemChecks: [
      { label: 'Zero-Days', status: 'ARMED', color: 'text-amber-400' },
      { label: 'Botnet Status', status: 'STANDBY', color: 'text-emerald-400' },
      { label: 'OpSec Level', status: 'CRITICAL', color: 'text-rose-400' }
    ],
    actionLabel: 'Launch DDoS',
    actionIcon: Terminal,
    actionDesc: 'Floods target infrastructure.'
  },
  'spy-manager': {
    stakeholders: [
      { id: 'handler', name: 'Station Chief', role: 'Command', avatar: '🦅' },
      { id: 'asset1', name: 'Asset "Fox"', role: 'Infiltrator', avatar: '🦊' },
      { id: 'enemy', name: 'Counter Intel', role: 'Adversary', avatar: '👁️' }
    ],
    systemChecks: [
      { label: 'Comms Encryption', status: 'SECURE', color: 'text-emerald-400' },
      { label: 'Burn Notice', status: 'ACTIVE', color: 'text-rose-400' },
      { label: 'Extraction', status: 'UNAVAILABLE', color: 'text-amber-400' }
    ],
    actionLabel: 'Burn Evidence',
    actionIcon: ShieldAlert,
    actionDesc: 'Wipes local drives + servers.'
  }
};

export default function SimWrapper() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  
  const config = careerId ? CAREER_MAP[careerId] : null;

  const [activeTab, setActiveTab] = useState(config?.sidebarTabs[0]?.id || 'dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metricsState, setMetricsState] = useState<Record<string, number>>({});
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const [missions, setMissions] = useState<Mission[]>([]);

  const [activeAdvisor, setActiveAdvisor] = useState<AdvisorPersona | null>(null);
  const [advisorThreads, setAdvisorThreads] = useState<Record<string, AdvisorMessage[]>>({});
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [generatingMissions, setGeneratingMissions] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('sim_user_auth') !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (config) {
      const initialMetrics: Record<string, number> = {};
      config.metrics.forEach(m => {
        initialMetrics[m.id] = m.startValue;
      });
      setMetricsState(initialMetrics);

      const initialMissions = INITIAL_MISSIONS.filter(m => m.careerId === config.id).map(m => ({
        ...m,
        missionAccepted: false,
        missionCompleted: false,
        missionRewardBudget: Math.floor(Math.random() * 5000) + 1000
      }));
      setMissions(initialMissions);

      // Setup initial logs
      setLogs([
        { id: '1', timestamp: new Date().toLocaleTimeString([], { hour12: false }), message: 'Session initialized. Environment loaded.', type: 'info' },
        { id: '2', timestamp: new Date().toLocaleTimeString([], { hour12: false }), message: 'Connected to corporate network.', type: 'success' }
      ]);
    }
  }, [config]);

  if (!config) {
    return (
      <div className="flex-1 min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
         <div>Career simulation "{careerId}" not found.</div>
         <button onClick={() => navigate('/')} className="px-4 py-2 bg-white/10 rounded pointer hover:bg-white/20 transition">Go Back</button>
      </div>
    );
  }

  if (config.id === 'cyber-architect') {
    return (
       <div className='relative w-full h-[100dvh]'>
         <div className='absolute top-4 left-4 z-[999]'>
            <button 
              onClick={() => navigate('/')}
              className='flex items-center gap-2 bg-black/50 hover:bg-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer backdrop-blur-md border border-white/10 shadow-xl'
            >
              <ArrowLeft className='w-4 h-4' /> Exit
            </button>
         </div>
         <CyberSecSim />
       </div>
    );
  }

  const tooling = CAREER_TOOLING[config.id] || {
    stakeholders: [{id: 'mgr', name: 'Manager', role: 'Supervisor', avatar: '👤'}],
    systemChecks: [{label: 'System Link', status: 'ONLINE', color: 'text-emerald-400'}],
    actionLabel: 'Run Diagnostics',
    actionIcon: Zap,
    actionDesc: 'Checks connection integrity'
  };

  const addLog = (message: string, type: 'info'|'warning'|'error'|'success' = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      message,
      type
    }, ...prev]);
  };

  const rewardMetric = config.metrics.find(m => m.role === 'reward') || config.metrics[0];
  const riskMetric = config.metrics.find(m => m.role === 'risk') || config.metrics[1] || config.metrics[0];

  // A natural per-metric increment, sized to its own scale.
  const stepOf = (startValue: number) => startValue <= 120 ? 4 : Math.max(1, Math.round(startValue * 0.04));

  // Move a metric toward ('good') or away from ('bad') its desirable direction,
  // scaled to its own range and clamped sensibly.
  const nudge = (
    metric: typeof config.metrics[number] | undefined,
    quality: 'good' | 'bad',
    magnitude = 1,
  ) => {
    if (!metric) return;
    const dir = (quality === 'good' ? 1 : -1) * (metric.goodDirection === 'up' ? 1 : -1);
    const delta = stepOf(metric.startValue) * magnitude * dir;
    setMetricsState(prev => {
      const next = (prev[metric.id] ?? metric.startValue) + delta;
      const clamped = metric.startValue <= 120 ? Math.min(100, Math.max(0, next)) : Math.max(0, next);
      return { ...prev, [metric.id]: Math.round(clamped) };
    });
  };

  const executeAction = () => {
    addLog(`Executing action: ${tooling.actionLabel}...`, 'warning');
    setTimeout(() => {
      nudge(rewardMetric, 'good', 0.5);
      nudge(riskMetric, 'good', 0.5);
      addLog(`Action completed. ${tooling.actionDesc}`, 'success');
      setActionFeedback(`${tooling.actionLabel} succeeded. ${rewardMetric?.name} improved.`);
      setTimeout(() => setActionFeedback(null), 3000);
    }, 1500);
  };

  const acceptMission = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, missionAccepted: true } : m));
    addLog('Mission Accepted. Track progress in the Dashboard.', 'info');
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, missionCompleted: true, missionAccepted: false, status: 'completed' as const } : m));
    nudge(rewardMetric, 'good', 1.5);
    nudge(riskMetric, 'good', 0.8);
    addLog(`Mission complete. ${rewardMetric?.name} up, ${riskMetric?.name} eased.`, 'success');
  };

  const resolveMissionOption = (missionId: string, option: MissionOption) => {
    // Map the option's authored effects onto this career's actual metrics by sign.
    nudge(rewardMetric, 'good', option.budgetEffect >= 0 ? 1.2 : 0.6);
    if (option.budgetEffect < 0) nudge(rewardMetric, 'bad', 0.5);
    nudge(riskMetric, option.riskEffect <= 0 ? 'good' : 'bad', 0.9);
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, missionCompleted: true, missionAccepted: false, status: 'completed' as const } : m));
    addLog(option.outcomeText, option.riskEffect <= 0 ? 'success' : 'warning');
  };

  const sendAdvisorMessage = async () => {
    if (!activeAdvisor || !advisorInput.trim() || advisorLoading) return;
    const advisor = activeAdvisor;
    const message = advisorInput.trim();
    setAdvisorInput('');
    setAdvisorThreads(prev => ({ ...prev, [advisor.id]: [...(prev[advisor.id] || []), { from: 'player', text: message }] }));
    setAdvisorLoading(true);
    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisor: { name: advisor.name, role: advisor.role },
          careerName: config.name,
          userMessage: message,
          metrics: metricsState
        })
      });
      const data = await res.json();
      setAdvisorThreads(prev => ({ ...prev, [advisor.id]: [...(prev[advisor.id] || []), { from: 'advisor', text: data.text || 'No response received.' }] }));
    } catch {
      setAdvisorThreads(prev => ({ ...prev, [advisor.id]: [...(prev[advisor.id] || []), { from: 'advisor', text: '📡 Connection lost. The channel is temporarily unreachable.' }] }));
    } finally {
      setAdvisorLoading(false);
    }
  };

  const requestDirectives = async () => {
    if (generatingMissions) return;
    setGeneratingMissions(true);
    addLog('Requesting new directives from management...', 'info');
    try {
      const res = await fetch('/api/ai/generate-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerName: config.name, metrics: metricsState })
      });
      const incoming = await res.json();
      if (Array.isArray(incoming) && incoming.length > 0) {
        const mapped: Mission[] = incoming.map((m: any, idx: number) => ({
          id: m.id || `gen_${Date.now()}_${idx}`,
          careerId: config.id,
          sender: `${m.sender || 'Management'} <${(m.senderRole || 'hq').toLowerCase().replace(/\s+/g, '.')}@corp.local>`,
          subject: m.subject || 'New Directive',
          content: m.content || '',
          status: 'unread' as const,
          timestamp: m.receivedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          objective: undefined,
          missionRewardBudget: m.missionRewardBudget,
          options: Array.isArray(m.options) ? m.options : undefined
        }));
        setMissions(prev => [...mapped, ...prev]);
        addLog(`${mapped.length} new transmission(s) received.`, 'success');
      }
    } catch {
      addLog('Failed to reach management. Directive channel offline.', 'error');
    } finally {
      setGeneratingMissions(false);
    }
  };

  const activeMissions = missions.filter(m => m.missionAccepted && !m.missionCompleted);

  const renderWorkspace = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardWorkspace config={config} type={config.id} activeMissions={activeMissions} />;
      case 'emails':
      case 'inbox':
        return <InboxWorkspace config={config} missions={missions} setMissions={setMissions} acceptMission={acceptMission} completeMission={completeMission} resolveOption={resolveMissionOption} onRequestDirectives={requestDirectives} generating={generatingMissions} />;
      case 'cli': return <CliWorkspace careerId={config.id} />;
      case 'topology': return <TopologyWorkspace />;
      case 'editor': return <EditorWorkspace config={config} />;
      case 'terminal': return config.id === 'investment-manager' ? <StockCandlestickWorkspace /> : <TerminalFeedWorkspace config={config} />;
      case 'sql': return <SqlWorkspace careerId={config.id} />;
      case 'dag': return <DagViewerWorkspace config={config} />;
      case 'tickets': return config.id === 'spy-manager' ? <FieldIntelWorkspace config={config} /> : <TicketingWorkspace config={config} />;
      case 'desk': return <TradeDeskWorkspace config={config} />;
      case 'accounts': return <OffshoreAccountsWorkspace config={config} />;
      case 'darkweb': return <DarkWebWorkspace config={config} />;
      case 'botnet': return <TopologyWorkspace />;
      case 'map': return <AssetMapWorkspace config={config} />;
      case 'social': return <SocialFeedWorkspace config={config} />;
      case 'marketing': return <DashboardWorkspace config={config} type="marketing" activeMissions={activeMissions} />;
      case 'excel': return <ExcelWorkspace config={config} />;
      case 'financial': return <DashboardWorkspace config={config} type="financial" activeMissions={activeMissions} />;
      case 'dashboards': return <VisualAnalysisWorkspace />;
      case 'ad': return <ActiveDirectoryWorkspace />;
      case 'inventory': return <ExcelWorkspace config={config} />;
      case 'logs': return <TerminalFeedWorkspace config={config} />;
    }

    switch (config.layoutType) {
      case 'cli': return <CliWorkspace careerId={config.id} />;
      case 'sql': return <SqlWorkspace careerId={config.id} />;
      case 'editor': return <EditorWorkspace config={config} />;
      case 'ticketing': return config.id === 'spy-manager' ? <FieldIntelWorkspace config={config} /> : <TicketingWorkspace config={config} />;
      case 'dag_viewer': return <DagViewerWorkspace config={config} />;
      case 'terminal_feed': return <TerminalFeedWorkspace config={config} />;
      default: return <div className="p-20 text-zinc-400 font-mono text-center flex-1 h-full w-full">Module currently offline. Please contact administrator.</div>;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col relative w-full">
      <div className="absolute top-4 left-4 z-[999]">
         <button 
           onClick={() => navigate('/')}
           className="flex items-center gap-2 bg-black/50 hover:bg-white/10 text-white px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer backdrop-blur-md border border-white/10 shadow-xl"
         >
           <ArrowLeft className="w-4 h-4" /> Exit
         </button>
      </div>

      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <header className="h-[72px] bg-[#0a0f1c]/80 backdrop-blur-3xl flex items-center justify-between pl-24 pr-4 lg:px-6 lg:pl-28 shrink-0 z-50 sticky top-0 shadow-sm border-b border-white/5" id="cyber-header">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-zinc-50 shadow-lg shadow-indigo-500/20 text-base shrink-0">
              {config.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <h1 className="text-[14px] lg:text-[16px] font-semibold tracking-tight text-zinc-50 truncate">
                {config.name} <span className="hidden sm:inline text-zinc-500 font-normal ml-1 text-[11px] lg:text-sm">Workstation v2.1</span>
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SIMULATION ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5 lg:gap-8">
            <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-0.5">
              {config.metrics.map(metric => (
                 <React.Fragment key={metric.id}>
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest leading-none col-start-1">{metric.name}</span>
                    <span className={`text-[13px] font-mono font-bold leading-none ${METRIC_COLOR_CLASSES[metric.color] || 'text-zinc-400'} col-start-2`}>
                      {metric.id === 'budget' || metric.id === 'compute' || metric.id === 'aum' || metric.id === 'laundered' ? '$' : ''}{(metricsState[metric.id] ?? metric.startValue).toLocaleString()}
                    </span>
                 </React.Fragment>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-10" id="applet-body-wrap">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-[250px] bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5" id="sleek-sidebar-left">
            <div className="p-4 flex-1">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4">Active Stakeholders</h2>
              <div className="space-y-2">
                {tooling.stakeholders.map(per => (
                  <button
                    key={per.id}
                    onClick={() => setActiveAdvisor(per)}
                    aria-label={`Open chat with ${per.name}, ${per.role}`}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-[16px] border text-left transition-all cursor-pointer shadow-sm ${
                      activeAdvisor?.id === per.id ? 'bg-indigo-600/20 border-indigo-500/40' : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-lg shadow-inner">
                      {per.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate text-zinc-200">{per.name}</p>
                      <p className="text-[11px] font-mono tracking-wide truncate text-zinc-500">{per.role}</p>
                    </div>
                    <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20">
               <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3">System Health</h2>
               <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Network</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">SECURE</span>
                 </div>
                 <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">VPN Tunnel</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">ACTIVE</span>
                 </div>
               </div>
            </div>
          </aside>

          <div className="order-1 lg:order-none lg:flex-1 min-w-0 w-full p-4 lg:p-6 lg:overflow-y-auto relative flex flex-col" id="sleek-center-viewport">
            <div className="flex items-center justify-center gap-1 p-1 bg-black/40 border border-white/10 backdrop-blur-2xl rounded-xl w-full sm:w-fit sm:mx-auto mb-4 shadow-2xl relative z-20 overflow-x-auto shrink-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
              {config.sidebarTabs.map(tab => {
                const Icon = (Icons as any)[tab.icon] || Icons.Square;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-label={tab.label}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={`relative px-3 py-2.5 sm:py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap flex-1 sm:flex-none ${
                      activeTab === tab.id ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/50' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline-block">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 w-full flex flex-col" style={{ zoom: 0.85 }}>
              <AnimatePresence mode="wait">
                 {renderWorkspace()}
              </AnimatePresence>
            </div>
          </div>

          <aside className="order-2 lg:order-none w-full lg:w-[260px] xl:w-[300px] bg-slate-900/40 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5" id="sleek-sidebar-right">
            <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-200 flex items-center gap-2"><History className="w-4 h-4 opacity-50" /> Live Logs</h2>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1.5 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Network</span>
            </div>
            
            <div className="lg:flex-1 lg:overflow-y-auto p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-[12px] font-mono leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5 max-h-64 overflow-y-auto">
                {logs.slice(0, 15).map((log, i) => (
                  <div key={log.id} className={`flex gap-2 ${log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-zinc-400'}`}>
                    <span className="opacity-50 shrink-0">[{log.timestamp}]</span>
                    <span className="break-words">{log.message}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-2">
                 <h3 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-widest font-mono">Module Status</h3>
                 <div className="flex flex-col gap-1">
                   {tooling.systemChecks.map((check, i) => (
                     <div key={i} className="flex justify-between text-[12px]">
                        <span className="text-zinc-400">{check.label}</span>
                        <span className={`font-mono font-bold ${check.color}`}>{check.status}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 p-4">
               <button 
                 onClick={executeAction} 
                 className="w-full flex items-center justify-center gap-2 font-semibold text-[13px] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl transition cursor-pointer"
               >
                 <tooling.actionIcon className="w-4 h-4" /> {tooling.actionLabel}
               </button>
               {actionFeedback && (
                  <div className="mt-3 p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[12px] leading-relaxed text-center font-bold">
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> {actionFeedback}
                  </div>
               )}
            </div>
          </aside>
        </main>
      </div>

      <AnimatePresence>
        {activeAdvisor && (
          <AdvisorChat
            advisor={activeAdvisor}
            thread={advisorThreads[activeAdvisor.id] || []}
            loading={advisorLoading}
            input={advisorInput}
            onInputChange={setAdvisorInput}
            onSend={sendAdvisorMessage}
            onClose={() => setActiveAdvisor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

