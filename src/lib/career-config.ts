export type LayoutType = 'cli' | 'sql' | 'editor' | 'ticketing' | 'dag_viewer' | 'terminal_feed';

export interface CareerConfig {
  id: string;
  name: string;
  tier: 'free' | 'paid';
  layoutType: LayoutType;
  metrics: { id: string, name: string, startValue: number, color: string }[];
  sidebarTabs: { id: string, label: string, icon: string }[];
}

export const CAREER_MAP: Record<string, CareerConfig> = {
  'cyber-architect': {
    id: 'cyber-architect',
    name: 'Cyber Security Architect', 
    tier: 'free', 
    layoutType: 'cli',
    metrics: [{id: 'budget', name: 'Budget', startValue: 100000, color: 'emerald'}, {id: 'risk', name: 'Threat Level', startValue: 10, color: 'rose'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'cli', label: 'Terminal', icon: 'Terminal'}, {id: 'topology', label: 'Network', icon: 'Network'}]
  },
  'copywriter': {
    id: 'copywriter',
    name: 'Copywriter', 
    tier: 'free', 
    layoutType: 'editor',
    metrics: [{id: 'sanity', name: 'Sanity', startValue: 100, color: 'blue'}, {id: 'approval', name: 'Client Approval', startValue: 0, color: 'emerald'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'editor', label: 'Drafts', icon: 'PenTool'}, {id: 'social', label: 'Social Feed', icon: 'Users'}]
  },
  'economist': {
    id: 'economist',
    name: 'Economist', 
    tier: 'free', 
    layoutType: 'terminal_feed',
    metrics: [{id: 'credibility', name: 'Credibility', startValue: 50, color: 'violet'}, {id: 'market', name: 'Market Sentiment', startValue: 50, color: 'amber'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'excel', label: 'Excel', icon: 'Database'}, {id: 'terminal', label: 'Bloomberg Terminal', icon: 'TrendingUp'}]
  },
  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst', 
    tier: 'free', 
    layoutType: 'sql',
    metrics: [{id: 'compute', name: 'Query Cost', startValue: 5000, color: 'orange'}, {id: 'accuracy', name: 'Data Integrity', startValue: 100, color: 'emerald'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'sql', label: 'SQL IDE', icon: 'Database'}, {id: 'dashboards', label: 'Visual Analysis', icon: 'BarChart'}]
  },
  'data-engineer': {
    id: 'data-engineer',
    name: 'Data Engineer', 
    tier: 'free', 
    layoutType: 'dag_viewer',
    metrics: [{id: 'uptime', name: 'Pipeline Uptime', startValue: 99, color: 'emerald'}, {id: 'tech_debt', name: 'Tech Debt', startValue: 80, color: 'rose'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'dag', label: 'Airflow DAGs', icon: 'GitMerge'}, {id: 'sql', label: 'SQL Execution Bench', icon: 'Database'}]
  },
  'sysadmin': {
    id: 'sysadmin',
    name: 'IT / Sysadmin', 
    tier: 'free', 
    layoutType: 'ticketing',
    metrics: [{id: 'sla', name: 'SLA Breach %', startValue: 0, color: 'rose'}, {id: 'patience', name: 'Patience', startValue: 10, color: 'blue'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'tickets', label: 'ServiceNow', icon: 'LifeBuoy'}, {id: 'ad', label: 'Active Directory', icon: 'Users'}, {id: 'cli', label: 'Router/Server CLI', icon: 'Terminal'}]
  },
  'investment-manager': {
    id: 'investment-manager',
    name: 'Investment Portfolio Mgr',
    tier: 'paid',
    layoutType: 'terminal_feed',
    metrics: [{id: 'aum', name: 'AUM ($M)', startValue: 500, color: 'emerald'}, {id: 'risk', name: 'Risk Exposure', startValue: 85, color: 'rose'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'terminal', label: 'Stocks & Visuals', icon: 'TrendingUp'}, {id: 'desk', label: 'Asset Analysis', icon: 'BarChart3'}]
  },
  'crypto-laundry': {
    id: 'crypto-laundry',
    name: 'Crypto Laundry Manager',
    tier: 'paid',
    layoutType: 'dag_viewer',
    metrics: [{id: 'laundered', name: 'Cleaned ($M)', startValue: 12, color: 'emerald'}, {id: 'heat', name: 'Heat Level', startValue: 45, color: 'rose'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'dag', label: 'Mixer Topology', icon: 'GitMerge'}, {id: 'accounts', label: 'Routing Network', icon: 'Database'}, {id: 'darkweb', label: 'Onion Market', icon: 'Eye'}]
  },
  'cyber-activist': {
    id: 'cyber-activist',
    name: 'Hacker / Cyber Activist',
    tier: 'paid',
    layoutType: 'cli',
    metrics: [{id: 'notoriety', name: 'Notoriety', startValue: 1500, color: 'violet'}, {id: 'botnet', name: 'Botnet Nodes', startValue: 45000, color: 'amber'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'cli', label: 'Root Shell', icon: 'Terminal'}, {id: 'darkweb', label: 'Dark Web', icon: 'Layers'}, {id: 'botnet', label: 'C2 Server', icon: 'Network'}]
  },
  'spy-manager': {
    id: 'spy-manager',
    name: 'Spy Network Manager',
    tier: 'paid',
    layoutType: 'ticketing',
    metrics: [{id: 'intel', name: 'Intel Value', startValue: 90, color: 'emerald'}, {id: 'cover', name: 'Blown Covers', startValue: 2, color: 'rose'}],
    sidebarTabs: [{id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard'}, {id: 'emails', label: 'Email', icon: 'Mail'}, {id: 'tickets', label: 'Field Intel', icon: 'ShieldAlert'}, {id: 'map', label: 'Global Assets', icon: 'Map'}]
  }
};
