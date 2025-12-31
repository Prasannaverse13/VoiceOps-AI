
export enum AppState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  RESPONDING = 'RESPONDING',
  ERROR = 'ERROR'
}

export interface LogEntry {
  action: string;
  timestamp: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
}

export interface SystemStatus {
  health: string;
  latency_ms: number;
  error_rate: number;
  last_deployment: string;
  deployment_status: string;
  incident_active: boolean;
  updated_at: string;
}
