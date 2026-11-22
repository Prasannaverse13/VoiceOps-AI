/**
 * Application state enumeration.
 * Represents the lifecycle phases of the VoiceOps AI UI.
 */
export enum AppState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  RESPONDING = 'RESPONDING',
  ERROR = 'ERROR',
}

/**
 * Log entry for UI / backend actions.
 * - `action`   : description of the performed action.
 * - `timestamp`: exact time the action occurred.
 * - `status`   : severity level of the log entry.
 */
export interface LogEntry {
  /** Human‑readable description of the action. */
  action: string;
  /** ISO‑8601 timestamp when the entry was created. */
  timestamp: Date;
  /** Log severity. */
  status: 'info' | 'success' | 'warning' | 'error';
}

/**
 * Configuration for audio streams.
 * - `sampleRate` : samples per second (Hz).
 * - `channels`   : number of audio channels (e.g., 1 = mono, 2 = stereo).
 */
export interface AudioConfig {
  /** Sample rate in Hertz. */
  sampleRate: number;
  /** Number of audio channels. */
  channels: number;
}

/**
 * Health status of the backend system.
 */
export enum SystemHealth {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
}

/**
 * Deployment status of the running service.
 */
export enum DeploymentStatus {
  DEPLOYED = 'DEPLOYED',
  ROLLING = 'ROLLING',
  FAILED = 'FAILED',
}

/**
 * System status snapshot.
 * Strongly typed fields with appropriate primitive types.
 */
export interface SystemStatus {
  /** Overall health of the system. */
  health: SystemHealth;
  /** Measured latency in milliseconds. */
  latencyMs: number;
  /** Error rate as a percentage (0‑100). */
  errorRate: number;
  /** Timestamp of the last deployment. */
  lastDeployment: Date;
  /** Current deployment state. */
  deploymentStatus: DeploymentStatus;
  /** Whether an incident is currently active. */
  incidentActive: boolean;
  /** Timestamp of the last status update. */
  updatedAt: Date;
}