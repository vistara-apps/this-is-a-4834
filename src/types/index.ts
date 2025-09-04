export interface User {
  userId: string;
  username: string;
  email: string;
  joinedCommunities: string[];
  createdCommunities: string[];
  subscriptionTier: 'free' | 'pro' | 'premium';
  avatar?: string;
}

export interface Community {
  communityId: string;
  name: string;
  description: string;
  topicTags: string[];
  members: string[];
  creationDate: string;
  adminUserId: string;
  avatar?: string;
  memberCount: number;
}

export interface Post {
  postId: string;
  communityId: string;
  authorUserId: string;
  authorUsername: string;
  content: string;
  timestamp: string;
  reactions: Record<string, number>;
  commentCount: number;
}

export interface Comment {
  commentId: string;
  postId: string;
  authorUserId: string;
  authorUsername: string;
  content: string;
  timestamp: string;
}

export interface AIGenerationRequest {
  requestId: string;
  userId: string;
  requestType: 'business_idea' | 'market_research' | 'pitch_deck' | 'tech_stack';
  prompt: string;
  result: string;
  timestamp: string;
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  market: string;
  aiTech: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  potential: number;
}