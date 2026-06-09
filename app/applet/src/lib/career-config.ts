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
    sidebarTabs: [{id: 'inbox', label: 'Inbox', icon: 'Mail'}, {id: 'cli', label: 'Terminal', icon: 'Terminal'}, {id: 'topology', label: 'Network', icon: 'Network'}]
  },
  'copywriter': {
    id: 'copywriter',
    name: 'Copywriter', 
    tier: 'free', 
    layoutType: 'editor',
    metrics: [{id: 'sanity', name: 'Sanity', startValue: 100, color: 'blue'}, {id: 'approval', name: 'Client Approval', startValue: 0, color: 'emerald'}],
    sidebarTabs: [{id: 'inbox', label: 'Slack', icon: 'MessageSquare'}, {id: 'editor', label: 'Drafts', icon: 'PenTool'}, {id: 'briefs', label: 'Creative Briefs', icon: 'FileText'}]
  },
  'economist': {
    id: 'economist',
    name: 'Economist', 
    tier: 'free', 
    layoutType: 'terminal_feed',
    metrics: [{id: 'credibility', name: 'Credibility', startValue: 50, color: 'violet'}, {id: 'market', name: 'Market Sentiment', startValue: 50, color: 'amber'}],
    sidebarTabs: [{id: 'inbox', label: 'Internal Comms', icon: 'Mail'}, {id: 'terminal', label: 'Bloomberg Terminal', icon: 'TrendingUp'}, {id: 'reports', label: 'Publications', icon: 'BookOpen'}]
  },
  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst', 
    tier: 'free', 
    layoutType: 'sql',
    metrics: [{id: 'compute', name: 'Query Cost', startValue: 5000, color: 'orange'}, {id: 'accuracy', name: 'Data Integrity', startValue: 100, color: 'emerald'}],
    sidebarTabs: [{id: 'inbox', label: 'Jira Tickets', icon: 'CheckSquare'}, {id: 'sql', label: 'SQL IDE', icon: 'Database'}, {id: 'dashboards', label: 'Dashboards', icon: 'PieChart'}]
  },
  'data-engineer': {
    id: 'data-engineer',
    name: 'Data Engineer', 
    tier: 'free', 
    layoutType: 'dag_viewer',
    metrics: [{id: 'uptime', name: 'Pipeline Uptime', startValue: 99, color: 'emerald'}, {id: 'tech_debt', name: 'Tech Debt', startValue: 80, color: 'rose'}],
    sidebarTabs: [{id: 'inbox', label: 'PagerDuty', icon: 'Bell'}, {id: 'dag', label: 'Airflow DAGs', icon: 'GitMerge'}, {id: 'logs', label: 'Server Logs', icon: 'AlignLeft'}]
  },
  'sysadmin': {
    id: 'sysadmin',
    name: 'IT / Sysadmin', 
    tier: 'free', 
    layoutType: 'ticketing',
    metrics: [{id: 'sla', name: 'SLA Breach %', startValue: 0, color: 'rose'}, {id: 'patience', name: 'Patience', startValue: 10, color: 'blue'}],
    sidebarTabs: [{id: 'tickets', label: 'ServiceNow', icon: 'LifeBuoy'}, {id: 'ad', label: 'Active Directory', icon: 'Users'}, {id: 'inventory', label: 'Asset Management', icon: 'Monitor'}]
  }
};
