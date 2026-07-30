export type RoleName = 'ADMINISTRATOR' | 'SOC_ANALYST' | 'AUDITOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  username: string;
  role: RoleName;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  ipAddress: string;
  model: string;
  firmwareVersion: string;
  vdom: string;
  location?: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  lastSeenAt: string;
}

export interface FirewallLog {
  id: string;
  deviceId?: string;
  timestamp: string;
  devname?: string;
  devid?: string;
  logid?: string;
  type?: string;
  subtype?: string;
  level?: string;
  vd?: string;
  srcip?: string;
  dstip?: string;
  srcport?: number;
  dstport?: number;
  proto?: number;
  action?: string;
  policyid?: number;
  polname?: string;
  user?: string;
  srcintf?: string;
  dstintf?: string;
  sentbyte?: string;
  rcvdbyte?: string;
  duration?: number;
  app?: string;
  service?: string;
  sessionid?: string;
  tranip?: string;
  trport?: number;
  srccountry?: string;
  dstcountry?: string;
  msg?: string;
  raw: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  sourceIp?: string;
  destIp?: string;
  details?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  fileUrl: string;
  format: 'PDF' | 'CSV';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: { username: string; email: string };
  action: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalLogs: number;
  allowedCount: number;
  deniedCount: number;
  threatEventsCount: number;
  topSrcIps: Array<{ ip: string; count: number }>;
  topDstIps: Array<{ ip: string; count: number }>;
  topApps: Array<{ name: string; count: number }>;
  topUsers: Array<{ username: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  queueStats: {
    queueLength: number;
    totalReceived: number;
    totalProcessed: number;
  };
}
