export interface Mission {
  id: string;
  careerId: string;
  sender: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'completed';
  timestamp: string;
  objective?: string;
  missionAccepted?: boolean;
  missionCompleted?: boolean;
  missionRewardBudget?: number;
}

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1-cyber',
    careerId: 'cyber-architect',
    sender: 'CTO <cto@crushload.net>',
    subject: 'URGENT: Port 22 open on Prod',
    content: "Why is SSH open to the world on the production database? The CEO is threatening to bring in an external auditor. Close it now before we make the news.",
    status: 'unread',
    timestamp: '09:00 AM',
    objective: "Use the CLI to block port 22 on the db-prod server."
  },
  {
    id: 'm1-copywriter',
    careerId: 'copywriter',
    sender: 'Marketing Director <marketing@crushload.net>',
    subject: 'RE: Synergistic Paradigms',
    content: "The client HATED the last draft. It needs to 'pop'. They want the exact phrase 'Synergistic Paradigms' in the manifesto. Also make it more 'disruptive'.",
    status: 'unread',
    timestamp: '10:15 AM',
    objective: "Write a draft containing the required phrase."
  },
  {
    id: 'm1-economist',
    careerId: 'economist',
    sender: 'Executive Board',
    subject: 'Justify the Layoffs',
    content: "We need to clear 20% headcount. Pull a chart showing that developer salaries are vastly outpacing inflation, or something. Make it look objective.",
    status: 'unread',
    timestamp: '08:30 AM',
    objective: "Generate a chart supporting the RIF."
  },
  {
    id: 'm1-analyst',
    careerId: 'data-analyst',
    sender: 'VP Sales <sales@crushload.net>',
    subject: 'Data is WRONG',
    content: "The dashboard says we made $10. Not $10M. $10. The board meeting is in 20 minutes. Fix the query before I throw my laptop out the window.",
    status: 'unread',
    timestamp: '11:45 AM',
    objective: "Fix the SELECT query in the SQL IDE."
  },
  {
    id: 'm1-engineer',
    careerId: 'data-engineer',
    sender: 'PagerDuty <alerts@pd.com>',
    subject: '[CRITICAL] production_revenue_pipeline_v3 failed',
    content: "Task `join_events` exited with status 1. Error: column 'test_do_not_use' does not exist. Our dashboard is frozen.",
    status: 'unread',
    timestamp: '02:11 AM',
    objective: "Debug the DAG and restart the pipeline."
  },
  {
    id: 'm1-sysadmin',
    careerId: 'sysadmin',
    sender: 'Helpdesk <noreply@crushload.net>',
    subject: 'Ticket INC-4092 created',
    content: "User reports: 'The cup holder on the side of my computer unit is broken and won't go back in. I spilled coffee on the carpet.'",
    status: 'unread',
    timestamp: '03:45 PM',
    objective: "Resolve the cup holder incident."
  },
  {
    id: 'm1-investment-manager',
    careerId: 'investment-manager',
    sender: 'Private Client <client@whale.com>',
    subject: 'Action Needed: Portfolio Shift',
    content: "The market looks unstable. I want to shift 40% of my portfolio into emerging tech markets and hedge against volatility. Execute immediately.",
    status: 'unread',
    timestamp: '07:30 AM',
    objective: "Reallocate $100M into emerging markets."
  },
  {
    id: 'm1-crypto-laundry',
    careerId: 'crypto-laundry',
    sender: 'The Cartel <anonymous>',
    subject: 'New Batch Inbound',
    content: "We have 500 ETH arriving from the recent exchange hack. Need it mixed and split across 5 offshore accounts. Heat is high right now.",
    status: 'unread',
    timestamp: '11:00 PM',
    objective: "Route funds through mixer without triggering alerts."
  },
  {
    id: 'm1-cyber-activist',
    careerId: 'cyber-activist',
    sender: 'Legion <anon@legion.net>',
    subject: 'Operation: Blackout',
    content: "MegaCorpGov has seized our domains. It's time for retaliation. Prep the botnet and initiate a Layer 7 DDoS on their main infrastructure.",
    status: 'unread',
    timestamp: '02:00 AM',
    objective: "Overload target servers with 5M requests/sec."
  },
  {
    id: 'm1-spy-manager',
    careerId: 'spy-manager',
    sender: 'Station Chief <chief@agency.gov>',
    subject: 'Asset Compromised',
    content: "Asset 'Fox' has missed the last two check-ins. Cover may be blown. Initiate complete burn protocol on their safehouse electronics and prep extraction route.",
    status: 'unread',
    timestamp: '04:15 AM',
    objective: "Execute remote wipe and route asset to extraction."
  }
];
