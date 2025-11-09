export interface TrendingTopic {
  id: string;
  title: string;
  category:
    | 'tiktok'
    | 'instagram'
    | 'youtube'
    | 'news'
    | 'x'
    | 'spotify'
    | 'instagramHashtags'
    | 'tiktokHashtags';
  engagement: string;
  timeAgo: string;
  source: string;
  link: string;
  domain: string;
  description: string;
  previewImage: string;
  highlights: string[];
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
