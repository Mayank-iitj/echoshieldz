export type AlertLevel = 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL';

export interface AnalysisResponse {
  call_id: string;
  risk_score: number;
  alert_level: string;
  scam_type: string;
  transcript: string;
  explanation: string;
  latency_ms: number;
  top_signals: {
    nlp_confidence: number;
    voice_stress: number;
    synthetic_voice: number;
    caller_reputation: number;
    script_match: number;
  };
}

export interface ReputationResponse {
  phone_number: string;
  reputation_score: number;
  reported_count: number;
  top_scam_type: string | null;
  analysis_cache: Record<string, unknown>;
}

export interface RiskSignals {
  scam_label: string;
  nlp_confidence: number;
  stress_score: number;
  synthetic_probability: number;
  deepfake_probability: number;
  caller_reputation_score: number;
  reported_count: number;
  script_match_score: number;
  matched_template: string | null;
}

export interface CallSession {
  call_id: string;
  phone_number: string;
  start_time: Date;
  risk_score: number;
  alert_level: AlertLevel;
  transcript: string;
  scam_type: string;
}

export interface WebSocketMessage {
  type: 'risk_update' | 'session_closed' | 'error' | 'pong';
  call_id: string;
  risk_score?: number;
  alert_level?: string;
  scam_type?: string;
  transcript?: string;
  explanation?: string;
  top_signals?: Record<string, number>;
  chunk_number?: number;
}

export interface FeedbackRequest {
  call_id: string;
  phone_number?: string;
  was_scam: boolean;
  user_notes?: string;
  predicted_risk_score?: number;
  predicted_scam_label?: string;
}

export interface DashboardStats {
  total_calls: number;
  scams_detected: number;
  false_positives: number;
  avg_risk_score: number;
  top_scams: { type: string; count: number }[];
}

export interface CallHistoryItem {
  id: string;
  phone_number: string;
  timestamp: Date;
  risk_score: number;
  alert_level: AlertLevel;
  scam_type: string;
  was_reported: boolean;
}