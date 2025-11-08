export interface TrendingTopic {
  id: string;
  title: string;
  category: 'tiktok' | 'instagram' | 'youtube' | 'news';
  engagement: string;
  timeAgo: string;
  source: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  script: string;
  hook: string;
  cta: string;
  viralScore?: number;
  viralAnalysis?: ViralAnalysis;
  createdAt: number;
  niche?: string;
}

export interface ViralAnalysis {
  score: number;
  hookStrength: number;
  emotionalImpact: number;
  formatSimilarity: number;
  suggestions: {
    hook?: string;
    visual?: string;
    cta?: string;
  };
}
