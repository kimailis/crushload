import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, Server, HardDrive, Terminal as TerminalIcon, Mail, Users, HelpCircle, Briefcase, Code, AlertTriangle, Cpu, Coins, RefreshCw, CheckCircle, TrendingDown, TrendingUp, XCircle, Send, Lock, Unlock, AlertCircle, Clock, ChevronRight, UserCheck, Zap, LayoutDashboard, Play, History, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ArchNode, SecurityMetric, SecurityEvent, Email, Employee, LogEntry } from '../types';
import { getInitialCiscoState, parseCiscoCommand, CiscoDeviceState } from '../utils';
import { INITIAL_NODES, INITIAL_METRICS, INITIAL_EVENTS, INITIAL_EMAILS, INITIAL_EMPLOYEES, INITIAL_LOGS } from '../data';

export default function CyberSecSim() {
  const [nodes, setNodes] = useState<ArchNode[]>(INITIAL_NODES);
  const [metrics, setMetrics] = useState<SecurityMetric>(INITIAL_METRICS);
  const [alerts, setAlerts] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture' | 'emails' | 'terminal'>('dashboard');
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(INITIAL_NODES[1]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['SecOps Subsystem Online. Connecting to core... OK.']);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const [ciscoSession, setCiscoSession] = useState<CiscoDeviceState | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const addLog = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      message,
      type
    }, ...prev]);
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setTerminalHistory(prev => [...prev, `pm-user@secops-node:~$ ${trimmed}`]);
    const parts = trimmed.toLowerCase().split(' ');
    const command = parts[0];

    if (trimmed === 'cisco connect gateway') {
      setCiscoSession(getInitialCiscoState('gateway'));
      setTerminalHistory(prev => [...prev, 'Connecting to Gateway-Router via console line...', 'Connected.']);
      return;
    }

    switch (command) {
      case 'help':
        setTerminalHistory(prev => [...prev, `Available Commands:\nscan                  - Run vulnerability scan on all architecture nodes\nstatus                - Core metric dump\nblock [IP]            - Null-route source IP address at WAF\npatch [NODE_TAG]      - Auto-deploy hotfix to selected node\ncisco connect gateway - Launch IOS emulation for DMZ config\nclear                 - Clear console window`]);
        break;
      case 'clear':
        setTerminalHistory(['SecOps Subsystem Online. Connecting to core... OK.']);
        break;
      case 'scan':
        setTerminalHistory(prev => [...prev, 'Commencing Nmap / Nessus aggregate scan...', 'Analyzing open ports & signatures...']);
        nodes.forEach(n => {
          setTimeout(() => {
            setTerminalHistory(prev => [...prev, `[${n.id.toUpperCase()}] ${n.name}: ${n.openPorts.length} ports open. ${n.isPatched ? 'Secure.' : 'VULNERABILITY DETECTED: ' + n.vulnerability}`]);
          }, 300);
        });
        addLog('Completed baseline topology scan via console.', 'info');
        break;
      case 'status':
        setTerminalHistory(prev => [...prev, 
          `SECURITY POSTURE INDEX: ${metrics.posture}%`,
          `GLOBAL RISK: ${metrics.riskScore}%`,
          `DEFENSE BUDGET: $${metrics.budget.toLocaleString()}`
        ]);
        break;
      case 'block':
        if (parts[1]) blockIpAddress(parts[1]);
        else setTerminalHistory(prev => [...prev, `Error: Specify target IP (e.g., block 45.33.22.1)`]);
        break;
      case 'patch':
        if (parts[1]) patchNode(parts[1]);
        else setTerminalHistory(prev => [...prev, `Error: Specify target node tag (e.g., patch waf)`]);
        break;
      default:
        setTerminalHistory(prev => [...prev, `Command not found: ${command}. Type 'help' for directory.`]);
    }
  };

  const handleTerminalExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput) return;
    if (ciscoSession) {
      setTerminalHistory(prev => [...prev, `> ${terminalInput}`]);
      if (terminalInput.trim().toLowerCase() === 'exit' && ciscoSession.mode === 'user') {
        setCiscoSession(null);
        setTerminalHistory(prev => [...prev, 'Session closed. Return to local shell.']);
      } else {
        const result = parseCiscoCommand(terminalInput, ciscoSession);
        setCiscoSession(result.newState);
        if (result.output) setTerminalHistory(prev => [...prev, result.output]);
      }
    } else {
      executeCommand(terminalInput);
    }
    setTerminalInput('');
  };

  const blockIpAddress = (targetIp: string) => {
    const alertFound = alerts.find(a => a.sourceIp === targetIp && a.status === 'active');
    if (alertFound) {
      setAlerts(prev => prev.map(a => a.id === alertFound.id ? { ...a, status: 'mitigated' } : a));
      const reward = alertFound.mitigationCost;
      setMetrics(prev => ({
        ...prev,
        budget: prev.budget + reward,
        riskScore: Math.max(0, prev.riskScore - (alertFound.severity === 'critical' ? 15 : 5))
      }));
      setTerminalHistory(prev => [...prev, `[WAF CONTROLLER] Rule applied. Traffic from ${targetIp} dropped.`]);
      addLog(`Blocked malicious IP [${targetIp}]. Recouped $${reward} operational credit.`, 'success');
    } else {
      setTerminalHistory(prev => [...prev, `[WAF ERROR] No active incident corresponds to ${targetIp}.`]);
    }
  };

  const patchNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      setTerminalHistory(prev => [...prev, `[ERROR] Node tag '${nodeId}' not located in topology.`]);
      return;
    }
    if (node.isPatched) {
      setTerminalHistory(prev => [...prev, `[INFO] Node ${node.name} is already operating on latest patch level.`]);
      return;
    }
    setTerminalHistory(prev => [...prev, `[SYSTEM] Applying zero-day patch to ${node.name}...`]);
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === nodeId ? { 
        ...n, isPatched: true, vulnerability: 'Resolved (Hotpatched)', health: 100, baseDefense: n.baseDefense + 10
      } : n));
      setMetrics(prev => ({
        ...prev, posture: Math.min(100, prev.posture + 5), riskScore: Math.max(0, prev.riskScore - 10)
      }));
      setTerminalHistory(prev => [...prev, `[SUCCESS] ${node.name} vulnerability sealed.`]);
      addLog(`Successfully hotpatched ${node.name}. Defense posture improved.`, 'success');
    }, 800);
  };

  const upgradeNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || metrics.budget < node.costToUpgrade || node.upgradeLevel >= 3) return;
    setMetrics(prev => ({
      ...prev,
      budget: prev.budget - node.costToUpgrade,
      posture: Math.min(100, prev.posture + 12),
      riskScore: Math.max(0, prev.riskScore - 8)
    }));
    setNodes(prev => prev.map(n => n.id === nodeId ? {
      ...n,
      upgradeLevel: n.upgradeLevel + 1,
      health: 100,
      baseDefense: n.baseDefense + 20,
      costToUpgrade: Math.round(n.costToUpgrade * 1.5)
    } : n));
    addLog(`Hardware/Software Upgrade finalized for ${node.name} to Level ${node.upgradeLevel + 1}`, 'success');
  };

  const triggerSimAttackCheck = () => {
    setSimulationStatus("Simulating targeted adversary penetration attempt...");
    setSimulationSuccess(null);
    addLog("Simulated adversarial test launched: Assessing network resistance...", "warning");
    setTimeout(() => {
      const defenseProbability = metrics.posture / 100;
      if (Math.random() < defenseProbability) {
        setSimulationSuccess(true);
        setSimulationStatus("Defense Successful! Your architecture withstood the breach attempt.");
        addLog("Defenses held against simulation.", "success");
      } else {
        setSimulationSuccess(false);
        setSimulationStatus("Breach detected! Defenses failed the penetration test. Upgrade nodes and patch vulnerabilities.");
        addLog("Critical failure during architectural breach simulation.", "error");
      }
    }, 1500);
  };

  const acceptMission = (emailId: string) => {
    setEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, missionAccepted: true, isRead: true };
      }
      return e;
    }));
    addLog('Mission Accepted. See Dashboard for details and reward parameters.', 'info');
  };

  const completeMission = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;
    setMetrics(prev => ({
      ...prev,
      budget: prev.budget + (email.missionRewardBudget || 0),
      morale: Math.max(10, Math.min(100, prev.morale + 10))
    }));
    setEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, missionCompleted: true, missionAccepted: false, isRead: true };
      }
      return e;
    }));
    addLog(`Mission accomplished! Budget rewarded: $${email.missionRewardBudget?.toLocaleString()}`, 'success');
    setSelectedEmail(null);
  };

  const activeMissions = emails.filter(e => e.missionAccepted && !e.missionCompleted);

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[#0a0f1c] z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh]">
        <header className="h-[72px] bg-[#0a0f1c]/80 backdrop-blur-3xl flex items-center justify-between pl-24 pr-4 lg:px-6 lg:pl-28 shrink-0 z-50 sticky top-0 shadow-sm border-b border-white/5" id="cyber-header">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-zinc-50 shadow-lg shadow-blue-500/20 text-base lg:text-lg shrink-0">
              S
            </div>
            <h1 className="text-[15px] lg:text-[17px] font-semibold tracking-tight text-zinc-50 truncate">
              SecOps <span className="hidden sm:inline">Architect</span> <span className="text-zinc-500 font-normal ml-1 text-[11px] lg:text-sm">v1.8.0</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5 lg:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[12px] uppercase tracking-widest text-zinc-200">Global Risk Index</span>
              <div className="flex items-center gap-3">
                <div className="w-24 md:w-32 h-1.5 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-500 ${metrics.riskScore > 65 ? 'bg-rose-500' : metrics.riskScore > 40 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${metrics.riskScore}%` }}
                  />
                </div>
                <span className={`text-[12px] font-mono font-bold ${metrics.riskScore > 65 ? 'text-rose-400' : metrics.riskScore > 40 ? 'text-amber-400' : 'text-blue-400'}`}>
                  {metrics.riskScore > 65 ? 'HIGH' : metrics.riskScore > 40 ? 'MED' : 'LOW'} ({metrics.riskScore}%)
                </span>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/10 backdrop-blur-md"></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <span className="text-[12px] text-zinc-400 font-medium">Budget</span>
              <span className="text-[12px] text-zinc-400 font-medium">Posture</span>
              <span className="text-[13px] font-mono text-amber-400 font-semibold">${metrics.budget.toLocaleString()}</span>
              <span className="text-[13px] font-mono text-indigo-400 font-semibold">{metrics.posture}%</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-10" id="applet-body-wrap">
          <aside className="order-3 lg:order-none w-full lg:w-[220px] xl:w-64 bg-slate-900/40 backdrop-blur-3xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-r border-white/5" id="sleek-sidebar-left">
            <div className="p-4">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-400 mb-3">Active Stakeholders</h2>
              <div className="space-y-2">
                {[
                  { id: 'ops', name: 'Chloe Lin', role: 'Security Ops SRE', avatar: '👩‍💻' },
                  { id: 'executive', name: 'Evelyn Chase', role: 'Chief Executive', avatar: '🏢' },
                  { id: 'finance', name: 'Marcus Sterling', role: 'CFO / Management', avatar: '💼' },
                  { id: 'pr', name: 'Rachel Zane', role: 'Public Relations', avatar: '👩‍💼' }
                ].map(per => (
                  <div key={per.id} className="w-full flex items-center gap-3 p-2.5 rounded-[20px] bg-white/5 border border-white/5 text-left transition-all">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-lg">
                      {per.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium truncate text-zinc-50">{per.name}</p>
                      <p className="text-[12px] truncate text-zinc-400">{per.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 lg:flex-1 lg:overflow-y-auto border-t border-white/5">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-400 mb-3">Response Team</h2>
              <div className="space-y-2">
                {employees.map(emp => (
                  <div key={emp.id} className="bg-white/5 backdrop-blur-md rounded-[20px] p-3 flex flex-col gap-2 border border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{emp.avatar}</span>
                        <span className="text-zinc-100 text-[13px] font-medium">{emp.name}</span>
                      </div>
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-semibold">Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="order-1 lg:order-none lg:flex-1 w-full p-4 lg:p-6 lg:overflow-y-auto relative flex flex-col" id="sleek-center-viewport">
            <div className="flex items-center justify-center gap-2 p-2 bg-white/5 border border-white/5 backdrop-blur-2xl rounded-2xl w-full sm:w-fit sm:mx-auto mb-5 shadow-xl relative z-20 overflow-x-auto shrink-0 [scrollbar-width:none]">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'architecture', label: 'Infra', icon: Server },
                { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
                { id: 'emails', label: 'Mail', icon: Mail }
              ].map(tab => {
                const Icon = tab.icon;
                const unreadCount = tab.id === 'emails' ? emails.filter(e => !e.isRead).length : 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-4 py-3 sm:py-2 text-[13px] font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-1 sm:flex-none ${
                      activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" /> <span className="hidden sm:inline-block">{tab.label}</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 sm:-top-1 sm:-right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl rounded-[28px] p-6">
                      <h2 className="text-lg font-semibold text-zinc-50 flex items-center gap-3 mb-4"><ActivityIcon className="text-indigo-400 w-5 h-5" /> Threat Landscape</h2>
                      <div className="flex flex-col gap-4">
                        <p className="text-[13px] text-zinc-200">Active threat events: <span className="font-bold text-rose-400">{alerts.filter(a => a.status === 'active').length}</span></p>
                        {alerts.filter(a => a.status === 'active').length > 0 ? (
                          alerts.filter(a => a.status === 'active').map(a => (
                            <div key={a.id} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex justify-between items-center">
                              <div>
                                <h4 className="text-[14px] font-bold text-rose-400">{a.title}</h4>
                                <span className="text-[12px] text-rose-300 opacity-80">{a.timestamp}</span>
                              </div>
                              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                            </div>
                          ))
                        ) : (
                          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-emerald-400">
                            <CheckCircle className="w-8 h-8 opacity-80 mx-auto mb-2" />
                            <span className="text-sm font-medium">No Active Threats</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl rounded-[28px] p-6">
                       <h2 className="text-lg font-semibold text-zinc-50 flex items-center gap-3 mb-4"><Briefcase className="text-indigo-400 w-5 h-5" /> Ongoing Missions</h2>
                      {activeMissions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-60 min-h-[140px]">
                          <Check className="w-8 h-8 mb-2 text-zinc-400" />
                          <span className="text-[14px]">No active missions. Check Mailbox.</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {activeMissions.map(m => (
                             <div key={m.id} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-[14px] font-bold text-zinc-50">{m.subject}</h4>
                                  <span className="text-[12px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">${m.missionRewardBudget?.toLocaleString()} Reward</span>
                                </div>
                                {m.missionHint && (
                                  <p className="text-[13px] text-zinc-300 font-mono bg-black/20 p-2 rounded-lg border border-white/5">
                                    <Zap className="inline w-3 h-3 text-amber-400 mr-1.5" />{m.missionHint}
                                  </p>
                                )}
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[28px] p-6 flex flex-col gap-4">
                     <h2 className="text-lg font-semibold text-zinc-50 flex items-center gap-3"><ActivityIcon className="text-emerald-400 w-5 h-5" /> Recent Operations</h2>
                     <div className="bg-black/20 rounded-2xl border border-white/5 p-4 max-h-[150px] overflow-y-auto font-mono text-[13px] flex flex-col gap-2">
                         {logs.slice(0, 4).map(l => (
                           <div key={l.id} className={l.type === 'error' ? 'text-rose-400' : l.type === 'success' ? 'text-emerald-400' : 'text-zinc-400'}>
                             [{l.timestamp}] {l.message}
                           </div>
                         ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'emails' && (
                <motion.div key="emails" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row lg:h-[75vh] lg:min-h-[600px] overflow-hidden bg-white/5 border border-white/5 backdrop-blur-3xl rounded-[28px] shadow-2xl">
                  <div className="w-full lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col bg-slate-900/40 h-[250px] lg:h-full">
                    <div className="p-4 lg:p-5 border-b border-white/5 shrink-0"><h2 className="text-lg font-semibold text-zinc-50 flex items-center gap-2"><Mail className="w-5 h-5 text-indigo-400" /> Inbox</h2></div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-2 space-y-1">
                      {emails.map(mail => {
                        const isSelected = selectedEmail?.id === mail.id;
                        return (
                          <button
                            key={mail.id}
                            onClick={() => {
                              setSelectedEmail(mail);
                              if (!mail.isRead) setEmails(prev => prev.map(e => e.id === mail.id ? { ...e, isRead: true } : e));
                            }}
                            className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer relative ${isSelected ? 'bg-indigo-600 shadow-md text-white' : 'hover:bg-white/5 text-zinc-300'}`}
                          >
                            {!mail.isRead && !isSelected && <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>}
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-xl">{mail.senderAvatar}</span>
                              <span className={`text-[14px] leading-none ${isSelected ? 'font-bold' : 'font-medium'} ${!mail.isRead && !isSelected ? 'text-zinc-50 font-bold' : ''}`}>{mail.sender}</span>
                            </div>
                            <span className={`text-[13px] block truncate pl-[32px] ${!mail.isRead && !isSelected ? 'text-zinc-100 font-semibold' : 'opacity-80'}`}>{mail.subject}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col h-[400px] lg:h-full bg-[#0a0f1c]/50 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {selectedEmail ? (
                      <div className="p-8 max-w-3xl mx-auto w-full flex flex-col">
                        <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-sm border border-white/5">{selectedEmail.senderAvatar}</div>
                            <div>
                              <h3 className="text-lg font-bold text-zinc-50">{selectedEmail.sender}</h3>
                              <p className="text-[13px] text-zinc-400">{selectedEmail.senderRole}</p>
                            </div>
                          </div>
                          <span className="text-[12px] text-zinc-400 font-mono py-1 px-3 bg-white/5 rounded-full border border-white/5">{selectedEmail.receivedAt}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-50 mb-6 font-serif tracking-tight">{selectedEmail.subject}</h2>
                        <div className="text-[14px] text-zinc-300 leading-relaxed space-y-4 mb-8 whitespace-pre-line bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner">{selectedEmail.content}</div>
                        {selectedEmail.missionActive && (
                           <div className="mt-4 p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-3xl">
                             <div className="flex items-center gap-3 mb-4"><ShieldAlert className="text-indigo-400 w-6 h-6" /><h3 className="text-zinc-50 font-semibold text-lg">Action Required</h3></div>
                             <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl mb-6 border border-white/5">
                               <span className="text-[13px] text-zinc-300 font-mono">Operations Reward Budget:</span>
                               <span className="text-[16px] text-amber-400 font-bold font-mono">${selectedEmail.missionRewardBudget?.toLocaleString()}</span>
                             </div>
                             {!selectedEmail.missionAccepted && !selectedEmail.missionCompleted ? (
                               <button onClick={() => acceptMission(selectedEmail.id)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-2xl transition cursor-pointer shadow-lg hover:shadow-indigo-500/20"><Briefcase className="w-5 h-5" /> Accept Mission Directive</button>
                             ) : selectedEmail.missionAccepted && !selectedEmail.missionCompleted ? (
                               <button onClick={() => completeMission(selectedEmail.id)} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-2xl transition cursor-pointer shadow-lg hover:shadow-emerald-500/20"><CheckCircle className="w-5 h-5" /> Mark Mission Completed</button>
                             ) : (
                               <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold py-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Check className="w-5 h-5" /> Mission Accomplished</div>
                             )}
                           </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-60"><Mail className="w-16 h-16 mb-4 text-zinc-500" /><h3 className="text-lg font-medium text-zinc-300">Select an email to view contents</h3></div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'architecture' && (
                <motion.div key="arch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col-reverse lg:flex-row lg:h-[75vh] lg:min-h-[500px] gap-5 w-full max-w-7xl mx-auto">
                  <div className="flex-1 bg-white/5 border border-white/5 backdrop-blur-3xl shadow-2xl rounded-[28px] p-4 lg:p-6 lg:overflow-y-auto">
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-50 mb-6 flex items-center gap-2"><Server className="w-5 h-5 text-indigo-400" /> Topology & Infrastructure</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {nodes.map(node => (
                        <button key={node.id} onClick={() => setSelectedNode(node)} className={`p-4 rounded-[20px] border border-white/5 flex flex-col gap-2 transition cursor-pointer text-left ${selectedNode?.id === node.id ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 hover:bg-white/10'}`}>
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[14px] font-bold text-zinc-50 pr-2 leading-tight">{node.name}</span>
                            {node.vulnerability !== 'Resolved (Hotpatched)' && node.vulnerability.length > 5 ? <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> : <Shield className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                          <div className="text-[12px] text-zinc-400 mt-1 uppercase font-mono tracking-wider">Level {node.upgradeLevel}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full lg:w-[360px] bg-white/5 border border-white/5 backdrop-blur-3xl shadow-2xl rounded-[28px] p-4 lg:p-6 shrink-0 lg:overflow-y-auto">
                    {selectedNode ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><HardDrive className="w-6 h-6 text-zinc-200" /></div>
                          <div><h3 className="text-zinc-50 font-bold">{selectedNode.name}</h3><span className="text-[12px] text-zinc-400 uppercase font-mono tracking-widest">{selectedNode.category}</span></div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                          <p className="text-[13px] text-zinc-300 leading-relaxed">{selectedNode.description}</p>
                          <div className="h-px bg-white/10 w-full" />
                          <div className="flex flex-col gap-2 font-mono text-[12px]">
                            <div className="flex justify-between"><span className="text-zinc-400">Health</span><span className="text-emerald-400">{selectedNode.health}%</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Firmware</span><span className="text-zinc-200">v{selectedNode.patchLevel}.0</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Open Ports</span><span className="text-zinc-200">{selectedNode.openPorts.join(', ')}</span></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {!selectedNode.isPatched && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
                              <h4 className="text-[13px] font-bold text-rose-400 mb-1 flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Critical Defect</h4>
                              <p className="text-[12px] text-rose-300/80 mb-3">{selectedNode.vulnerability}</p>
                               <button onClick={() => patchNode(selectedNode.id)} className="w-full bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-bold py-2 rounded-xl transition cursor-pointer">Deploy Zero-Day Patch</button>
                            </div>
                          )}
                          <button disabled={metrics.budget < selectedNode.costToUpgrade || selectedNode.upgradeLevel >= 3} onClick={() => upgradeNode(selectedNode.id)} className="w-full flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-indigo-900/50 rounded-2xl transition cursor-pointer">
                             <div className="text-left flex flex-col gap-0.5"><span className="text-[13px] font-semibold text-white">Upgrade Capability</span><span className="text-[11px] text-indigo-200 font-mono">Increase Defense by +20</span></div>
                             <span className="bg-black/20 font-mono font-bold text-amber-300 text-[12px] px-2.5 py-1 rounded-lg">${selectedNode.costToUpgrade}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-60 min-h-[300px]"><HardDrive className="w-12 h-12 text-zinc-500 mb-3" /><span className="text-[14px]">Select an infra node to view</span></div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'terminal' && (
                <motion.div key="terminal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 lg:h-[75vh] min-h-[350px] lg:min-h-[500px] w-full max-w-5xl mx-auto flex flex-col bg-[#050505] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative">
                   <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                     <TerminalIcon className="w-4 h-4 text-zinc-400" />
                     <span className="text-[12px] font-mono text-zinc-300 tracking-wider">SEC-OPS REMOTE SHELL (root)</span>
                     {ciscoSession && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 rounded-full font-mono font-bold uppercase ml-auto border border-amber-500/20 hidden sm:inline-block">Serial Interface Emulation Active</span>}
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] text-emerald-400/90 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                      {terminalHistory.map((item, idx) => (<div key={idx} className="whitespace-pre-wrap">{item || ' '}</div>))}
                      <div ref={terminalBottomRef} />
                   </div>
                   <form onSubmit={handleTerminalExecute} className="w-full bg-[#0a0a0a] p-3 flex items-center gap-2 border-t border-white/5 shrink-0 focus-within:ring-1 focus-within:ring-white/10">
                     {ciscoSession ? (
                      <span className="text-amber-400 font-mono font-bold pl-2 truncate shrink-0">
                        {ciscoSession.mode === 'user' && `${ciscoSession.hostname}>`}
                        {ciscoSession.mode === 'privileged' && `${ciscoSession.hostname}#`}
                        {ciscoSession.mode === 'global-config' && `${ciscoSession.hostname}(config)#`}
                      </span>
                     ) : (
                      <span className="text-emerald-500 font-mono font-bold pl-2 truncate shrink-0">pm-user@secops:~$</span>
                     )}
                     <input type="text" value={terminalInput} onChange={e => setTerminalInput(e.target.value)} placeholder={ciscoSession ? "Enter IOS command..." : "Execute tool or 'help'"} className="flex-1 bg-transparent text-emerald-300 font-mono text-[16px] lg:text-[13px] outline-none placeholder-zinc-700 ml-1 rounded-none" />
                     <button type="submit" className="hidden">send</button>
                   </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <aside className="order-2 lg:order-none w-full lg:w-[260px] xl:w-[300px] bg-slate-900/40 backdrop-blur-3xl shadow-xl flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-white/5" id="sleek-sidebar-right">
            <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
              <h2 className="text-[13px] font-semibold tracking-tight text-zinc-200 flex items-center gap-2"><History className="w-4 h-4 opacity-50" /> Live Logs</h2>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1.5 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Network</span>
            </div>
            <div className="lg:flex-1 lg:overflow-y-auto p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-[12px] font-mono leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/5 max-h-64 overflow-y-auto">
                {logs.slice(0, 10).map((log, i) => (
                  <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-zinc-400'}`}>
                    <span className="opacity-50 shrink-0">[{log.timestamp}]</span>
                    <span className="break-words">{log.message}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-2">
                 <h3 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-widest font-mono">System Integrity</h3>
                 <div className="flex flex-col gap-1">
                   <div className="flex justify-between text-[12px]"><span className="text-zinc-400">WAF Filters</span><span className="text-emerald-400">ONLINE</span></div>
                   <div className="flex justify-between text-[12px]"><span className="text-zinc-400">Auth Subsystem</span><span className="text-emerald-400">ONLINE</span></div>
                   <div className="flex justify-between text-[12px]"><span className="text-zinc-400">Database Guard</span><span className="text-amber-400">VULNERABLE</span></div>
                 </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <button onClick={triggerSimAttackCheck} className="w-full flex items-center justify-center gap-2 font-semibold text-[13px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-3 rounded-2xl transition cursor-pointer border border-rose-500/20"><ShieldAlert className="w-4 h-4" /> Simulate Breach</button>
                 {simulationStatus && (
                    <div className={`mt-3 p-3 rounded-xl border text-[12px] leading-relaxed text-center ${simulationSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                      {simulationStatus}
                    </div>
                 )}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function ActivityIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
}
