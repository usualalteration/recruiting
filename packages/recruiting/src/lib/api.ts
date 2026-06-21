import type { User, TokenResponse } from '../types';

export interface ApiClient {
  login: (email: string, password: string) => Promise<TokenResponse>;
  register: (name: string, email: string, password: string) => Promise<TokenResponse>;
  getUser: (token: string) => Promise<User>;
  submitAssessment: (userId: number, answers: Record<string, number[]>, token: string) => Promise<AssessmentResponse>;
  getAssessment: (assessmentId: number) => Promise<AssessmentResponse>;
  getRanking: (params: { limit?: number; offset?: number; min_score?: number; max_score?: number }) => Promise<RankingResponse>;
  getInsights: (candidateId: number) => Promise<InsightsResponse>;
  getAnalytics: () => Promise<AnalyticsResponse>;
}

export interface AssessmentResponse {
  success: boolean;
  assessment_id?: number;
  compatibility_score?: number;
  recommendation?: string;
  seniority?: string;
  technology_scores?: { technology: string; score: number }[];
}

export interface RankingResponse {
  success: boolean;
  candidates?: Candidate[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  compatibility_score: number;
  seniority: string;
  recommendation: string;
}

export interface InsightsResponse {
  success: boolean;
  candidate?: Candidate;
  insights?: {
    strengths: string[];
    weaknesses: string[];
    risk_analysis: string;
    suggested_role: string;
    interview_focus: string[];
  };
}

export interface AnalyticsResponse {
  success: boolean;
  total_candidates?: number;
  average_score?: number;
  top_technologies?: { technology: string; average_score: number }[];
}

export class NuvolarisClient implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(path: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request('v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name: string, email: string, password: string): Promise<TokenResponse> {
    return this.request('v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async getUser(token: string): Promise<User> {
    return this.request('v1/candidate/get', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  async submitAssessment(userId: number, answers: Record<string, number[]>, token: string): Promise<AssessmentResponse> {
    return this.request('v1/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, answers, token })
    });
  }

  async getAssessment(assessmentId: number): Promise<AssessmentResponse> {
    return this.request('v1/assessment/evaluate', {
      method: 'POST',
      body: JSON.stringify({ assessment_id: assessmentId })
    });
  }

  async getRanking(params: { limit?: number; offset?: number; min_score?: number; max_score?: number } = {}): Promise<RankingResponse> {
    const query = new URLSearchParams(params as Record<string, string>);
    return this.request(`v1/ranking/get?${query.toString()}`);
  }

  async getInsights(candidateId: number): Promise<InsightsResponse> {
    return this.request('v1/recruiter/insights', {
      method: 'POST',
      body: JSON.stringify({ candidate_id: candidateId })
    });
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    return this.request('v1/analytics/overview');
  }
}
