import { ArchNode, SecurityMetric, SecurityEvent, Email, Employee, LogEntry } from './types';

export const INITIAL_NODES: ArchNode[] = [
  {
    id: 'waf-edge',
    name: 'WAF Edge Proxy',
    category: 'gateway',
    description: 'Front-facing Web Application Firewall evaluating incoming HTTPS traffic for malicious payloads and anomalies.',
    health: 100,
    isPatched: true,
    vulnerability: 'Resolved (Hotpatched)',
    baseDefense: 80,
    upgradeLevel: 1,
    costToUpgrade: 5000,
    patchLevel: 3,
    openPorts: [80, 443]
  },
  {
    id: 'core-auth',
    name: 'Identity Provider (IdP)',
    category: 'authentication',
    description: 'Primary authentication component. Processes SAML and OAuth tokens. Contains access control lists.',
    health: 65,
    isPatched: false,
    vulnerability: 'CVE-2023-4412 (Authentication Bypass)',
    baseDefense: 60,
    upgradeLevel: 2,
    costToUpgrade: 7500,
    patchLevel: 1,
    openPorts: [443, 636]
  },
  {
    id: 'db-customer',
    name: 'Customer Data Lake',
    category: 'database',
    description: 'SQL cluster holding PII and hashed credentials. Deepest network segment.',
    health: 90,
    isPatched: true,
    vulnerability: 'Resolved (Hotpatched)',
    baseDefense: 90,
    upgradeLevel: 3,
    costToUpgrade: 15000,
    patchLevel: 4,
    openPorts: [5432, 3306]
  },
  {
    id: 'app-server-1',
    name: 'Main App Node 1',
    category: 'application',
    description: 'Stateless Node.js application server. Processes business logic and triggers database reads/writes.',
    health: 40,
    isPatched: false,
    vulnerability: 'CVE-2024-0019 (RCE in image parser lib)',
    baseDefense: 50,
    upgradeLevel: 1,
    costToUpgrade: 3000,
    patchLevel: 2,
    openPorts: [8080, 22]
  }
];

export const INITIAL_METRICS: SecurityMetric = {
  riskScore: 78,
  budget: 15000,
  posture: 42,
  morale: 85
};

export const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-001',
    timestamp: '14:02:44',
    title: 'Anomalous Data Exfiltration',
    description: 'Unusual outbound traffic spike from Customer Data Lake (db-customer).',
    severity: 'critical',
    status: 'active',
    sourceIp: '188.75.44.11',
    targetNodeId: 'db-customer',
    mitigationCost: 8000
  },
  {
    id: 'evt-002',
    timestamp: '14:05:12',
    title: 'Multiple Failed Login Attempts',
    description: 'Brute force pattern detected targeting Identity Provider.',
    severity: 'high',
    status: 'active',
    sourceIp: '45.33.22.1',
    targetNodeId: 'core-auth',
    mitigationCost: 2000
  }
];

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'msg-001',
    sender: 'CISO Office',
    senderRole: 'Chief Information Security Officer',
    senderAvatar: '👔',
    subject: 'URGENT: Block Attacker IPs at WAF',
    receivedAt: '13:50',
    isRead: false,
    content: "The SOC team noticed brute-force traffic originating from 45.33.22.1 hitting our authentication APIs.\n\nUse the CLI Terminal to null-route this IP at the WAF.\nCommand syntax should be: 'block <IP>'\n\nDo not fail.",
    missionActive: true,
    missionRewardBudget: 2500,
    missionHint: "Terminal Input: block 45.33.22.1"
  },
  {
    id: 'msg-002',
    sender: 'DevOps Automated Alert',
    senderRole: 'Infrastructure Bot',
    senderAvatar: '🤖',
    subject: 'Critical Vulnerabilities Detected in Production',
    receivedAt: '13:58',
    isRead: false,
    content: "Scheduled Nessus scan indicates that the Identity Provider (core-auth) and Main App Node 1 (app-server-1) have missing critical patches.\n\nRun 'scan' in the terminal to verify, then use 'patch <NODE_TAG>' to apply hotfixes to those nodes.",
    missionActive: true,
    missionRewardBudget: 4000,
    missionHint: "Terminal Input: patch core-auth"
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-001', name: 'Alina F.', role: 'Incident Responder', avatar: '👩‍💻', status: 'available' },
  { id: 'emp-002', name: 'Marcus D.', role: 'Penetration Tester', avatar: '🕵️', status: 'available' }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-001', timestamp: '14:00:00', message: 'System startup sequence completed.', type: 'info' },
  { id: 'log-002', timestamp: '14:00:15', message: 'Connected to architecture management grid.', type: 'info' },
  { id: 'log-003', timestamp: '14:05:12', message: 'Authentication flood detected. Raising alert level.', type: 'warning' }
];
