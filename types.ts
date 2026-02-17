
export enum Severity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface LogEntry {
  timestamp: string;
  severity: Severity;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface Anomaly {
  type: string;
  description: string;
  confidence: number;
  relatedEntries: number[];
}

export interface SecurityThreat {
  category: string;
  riskScore: number;
  details: string;
  mitigation: string;
}

export interface AnalysisResult {
  summary: string;
  parsedLogs: LogEntry[];
  anomalies: Anomaly[];
  securityThreats: SecurityThreat[];
  performanceInsights: {
    metric: string;
    value: string;
    assessment: 'GOOD' | 'FAIR' | 'POOR';
  }[];
  recommendations: string[];
}

export interface ChartData {
  name: string;
  value: number;
}
