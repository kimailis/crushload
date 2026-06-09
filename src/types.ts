export interface ArchNode {
  id: string;
  name: string;
  category: 'database' | 'gateway' | 'application' | 'authentication';
  description: string;
  health: number;
  isPatched: boolean;
  vulnerability: string;
  baseDefense: number;
  upgradeLevel: number;
  costToUpgrade: number;
  patchLevel: number;
  openPorts: number[];
}

export interface SecurityMetric {
  riskScore: number;
  budget: number;
  posture: number;
  morale: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'mitigated';
  sourceIp: string;
  targetNodeId: string;
  mitigationCost: number;
}

export interface MissionOption {
  id: string;
  text: string;
  riskEffect: number;
  budgetEffect: number;
  moraleEffect: number;
  outcomeText: string;
}

export interface Email {
  id: string;
  sender: string;
  senderRole: string;
  senderAvatar: string;
  subject: string;
  receivedAt: string;
  isRead: boolean;
  content: string;
  missionActive: boolean;
  missionRewardBudget?: number;
  missionAccepted?: boolean;
  missionCompleted?: boolean;
  missionHint?: string;
  options?: MissionOption[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
