import { MissionOption } from '../types';

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
  options?: MissionOption[];
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
  },
  {
    id: 'm2-cyber',
    careerId: 'cyber-architect',
    sender: 'HR Compliance <hr@crushload.net>',
    subject: 'Mandatory: Phishing Awareness Quarter',
    content: "Reminder: 40% of staff clicked the fake 'Free Pizza Friday' phishing test. Legal says we need that under 10% before the audit. Please do something about the humans.",
    status: 'unread',
    timestamp: '01:20 PM',
    objective: "Improve security posture before the compliance audit.",
    missionRewardBudget: 1200,
    options: [
      { id: 'opt-cyber-training', text: 'Run company-wide security training (boring but effective)', riskEffect: -8, budgetEffect: -800, moraleEffect: -5, outcomeText: 'Click rate drops to 9%. Staff complain about the 90-minute video.' },
      { id: 'opt-cyber-shame', text: 'Publish a "Wall of Clickers" leaderboard', riskEffect: -3, budgetEffect: 0, moraleEffect: -15, outcomeText: 'Click rate drops slightly. HR opens three new complaints. About you.' }
    ]
  },
  {
    id: 'm2-copywriter',
    careerId: 'copywriter',
    sender: 'Don Draper <cd@crushload.net>',
    subject: 'The tagline is "fine". Fine is death.',
    content: "Client wants the rebrand tagline by EOD. They rejected 'Innovation Delivered', 'Delivering Innovation', and 'Innovatively Delivered'. They want something 'completely different but exactly the same'.",
    status: 'unread',
    timestamp: '02:40 PM',
    objective: "Draft a new tagline in the editor before 5 PM."
  },
  {
    id: 'm2-economist',
    careerId: 'economist',
    sender: 'Chief Editor <editor@crushload.net>',
    subject: 'Hot take needed: rates UP or DOWN?',
    content: "The Fed speaks tomorrow. I need a forecast column tonight. Doesn't matter which direction — just be confident. Hedge in the last paragraph like always.",
    status: 'unread',
    timestamp: '06:05 PM',
    objective: "Publish a confident-yet-deniable rate forecast.",
    missionRewardBudget: 900,
    options: [
      { id: 'opt-econ-hawk', text: 'Predict a hike (hawkish, citing sticky core inflation)', riskEffect: 5, budgetEffect: 0, moraleEffect: 5, outcomeText: 'Column trends. Half the comments call you a genius, half a doom-monger. Perfect.' },
      { id: 'opt-econ-dove', text: 'Predict a cut (dovish, citing cooling labor market)', riskEffect: 5, budgetEffect: 0, moraleEffect: 5, outcomeText: 'Column trends. A bond trader DMs you a single skull emoji.' }
    ]
  },
  {
    id: 'm2-analyst',
    careerId: 'data-analyst',
    sender: 'Sarah PM <pm@crushload.net>',
    subject: 'Quick favor: can you "directionally" confirm my hypothesis?',
    content: "I already told leadership the new onboarding flow improved retention. Can you pull numbers that show that? If the numbers don't show that, can you check different numbers?",
    status: 'unread',
    timestamp: '04:55 PM',
    objective: "Query retention data in the SQL IDE."
  },
  {
    id: 'm2-engineer',
    careerId: 'data-engineer',
    sender: 'Data Science <ds@crushload.net>',
    subject: 'Why is the feature store 6 hours stale?',
    content: "Our churn model is predicting that customers who cancelled yesterday might cancel. Kafka lag on ml.features.stream is 8900. Please unblock before the model embarrasses us in the demo.",
    status: 'unread',
    timestamp: '09:30 AM',
    objective: "Check kafka_topics lag in the SQL bench and clear the backlog."
  },
  {
    id: 'm2-sysadmin',
    careerId: 'sysadmin',
    sender: 'Angry CEO <ceo@crushload.net>',
    subject: 'MY PRINTER',
    content: "The boardroom printer says 'PC LOAD LETTER'. Investors arrive in 45 minutes. I do not care what a PC Load Letter is. Make paper come out of the machine.",
    status: 'unread',
    timestamp: '08:15 AM',
    objective: "Resolve the executive printer incident.",
    missionRewardBudget: 700,
    options: [
      { id: 'opt-sys-fix', text: 'Walk to the boardroom and refill Tray 2', riskEffect: -5, budgetEffect: 0, moraleEffect: 8, outcomeText: 'Paper comes out of the machine. The CEO calls you a wizard. You died inside a little.' },
      { id: 'opt-sys-swap', text: 'Swap in the marketing department\'s printer quietly', riskEffect: 2, budgetEffect: -150, moraleEffect: 3, outcomeText: 'Crisis averted. Marketing will notice on Monday. That is a Monday problem.' }
    ]
  },
  {
    id: 'm2-investment-manager',
    careerId: 'investment-manager',
    sender: 'Risk Committee <risk@crushload.net>',
    subject: 'Your tech exposure breached the 35% limit',
    content: "Concentration alert: the fund is 48% in a single AI chipmaker. Either trim the position or write a one-page memo explaining why the limit doesn't apply to you. Again.",
    status: 'unread',
    timestamp: '10:50 AM',
    objective: "Rebalance the portfolio on the trade desk."
  },
  {
    id: 'm2-crypto-laundry',
    careerId: 'crypto-laundry',
    sender: 'Mule Network <ops@anonymous>',
    subject: 'Mule #44 posted his new car on Instagram',
    content: "Geotagged. Outside the drop bank. Wearing the conference lanyard. The task force follows that account. We need to cauterize this branch of the network tonight.",
    status: 'unread',
    timestamp: '01:30 AM',
    objective: "Re-route flows around the burned mule in the mixer topology."
  },
  {
    id: 'm2-cyber-activist',
    careerId: 'cyber-activist',
    sender: 'Legion <anon@legion.net>',
    subject: 'Leak drop coordination — 48h window',
    content: "We have 400GB of MegaCorpGov internal memos. Journalists are standing by. We need mirrors seeded and the onion drop live before their legal team wakes up.",
    status: 'unread',
    timestamp: '03:10 AM',
    objective: "Prepare distribution infrastructure for the drop."
  },
  {
    id: 'm2-spy-manager',
    careerId: 'spy-manager',
    sender: 'Asset "Fox" <encrypted>',
    subject: '⠀',
    content: "Checked in late. Was followed — lost them in the market. The package is secure but my usual route is compromised. Requesting new exfil corridor and a week of radio silence.",
    status: 'unread',
    timestamp: '11:58 PM',
    objective: "Plot a new extraction corridor on the asset map."
  }
];
