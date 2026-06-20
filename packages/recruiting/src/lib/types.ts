export interface User {
  id: number;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
}

export interface TokenResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface TechnologyScore {
  technology: string;
  score: number;
}

export interface Assessment {
  id: number;
  user_id: number;
  score: number;
  created_at: string;
  compatibility_score: number;
  recommendation: string;
  seniority: string;
  technology_scores: TechnologyScore[];
}

export interface PillarScore {
  technology: string;
  pillar: string;
  score: number;
}

export interface CandidateRanking {
  id: number;
  name: string;
  email: string;
  role: string;
  compatibility_score: number;
  seniority: string;
  recommendation: string;
}

export interface Insights {
  candidate: {
    id: number;
    name: string;
    email: string;
    compatibility_score: number;
    seniority: string;
    recommendation: string;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    risk_analysis: string;
    suggested_role: string;
    interview_focus: string[];
  };
}

export interface Analytics {
  total_candidates: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  seniority_distribution: Record<string, number>;
  recommendation_distribution: Record<string, number>;
}
