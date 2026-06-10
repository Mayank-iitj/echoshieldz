import { AnalysisResponse, ReputationResponse, FeedbackRequest, DashboardStats, CallHistoryItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Call Analysis
  async analyzeCall(
    audioFile: File,
    phoneNumber: string = '',
    callId: string = '',
    durationSec: number = 0
  ): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('phone_number', phoneNumber);
    formData.append('call_id', callId);
    formData.append('duration_sec', durationSec.toString());

    const response = await fetch(`${this.baseUrl}/api/v1/calls/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Caller Reputation
  async getCallerReputation(phoneNumber: string): Promise<ReputationResponse> {
    return this.request<ReputationResponse>(`/api/v1/calls/reputation/${phoneNumber}`);
  }

  async updateCallerReputation(
    phoneNumber: string,
    reputationScore: number,
    scamType?: string
  ): Promise<{ success: boolean }> {
    return this.request('/api/v1/calls/reputation/' + phoneNumber, {
      method: 'POST',
      body: JSON.stringify({
        reputation_score: reputationScore,
        scam_type: scamType,
      }),
    });
  }

  // Feedback
  async submitFeedback(feedback: FeedbackRequest): Promise<{ success: boolean; message: string }> {
    return this.request('/api/v1/calls/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  // Call Session
  async getCallSession(callId: string): Promise<{ risk_score: number; transcript: string; chunk_count: number } | { error: string }> {
    return this.request(`/api/v1/calls/session/${callId}`);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; models_loaded: Record<string, boolean> }> {
    return this.request('/health');
  }

  // Dashboard (mock for now - would connect to actual backend)
  async getDashboardStats(): Promise<DashboardStats> {
    // Mock data - replace with actual API call
    return {
      total_calls: 1247,
      scams_detected: 342,
      false_positives: 23,
      avg_risk_score: 28.5,
      top_scams: [
        { type: 'KYC_FRAUD', count: 127 },
        { type: 'OTP_THEFT', count: 89 },
        { type: 'FAKE_AUTHORITY', count: 67 },
        { type: 'UPI_SCAM', count: 45 },
        { type: 'ACCOUNT_FREEZE', count: 14 },
      ],
    };
  }

  // Call History (mock)
  async getCallHistory(): Promise<CallHistoryItem[]> {
    // Mock data
    return [
      {
        id: '1',
        phone_number: '+919876543210',
        timestamp: new Date(Date.now() - 3600000),
        risk_score: 85.2,
        alert_level: 'CRITICAL',
        scam_type: 'KYC_FRAUD',
        was_reported: true,
      },
      {
        id: '2',
        phone_number: '+918765432109',
        timestamp: new Date(Date.now() - 7200000),
        risk_score: 45.0,
        alert_level: 'SUSPICIOUS',
        scam_type: 'SAFE',
        was_reported: false,
      },
      {
        id: '3',
        phone_number: '+917654321098',
        timestamp: new Date(Date.now() - 10800000),
        risk_score: 92.0,
        alert_level: 'CRITICAL',
        scam_type: 'OTP_THEFT',
        was_reported: true,
      },
    ];
  }
}

export const api = new ApiClient();
export default api;