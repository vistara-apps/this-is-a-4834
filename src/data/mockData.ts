import { User, Community, Post, Comment, BusinessIdea } from '../types';

export const mockUser: User = {
  userId: 'user-1',
  username: 'alexchen',
  email: 'alex@example.com',
  joinedCommunities: ['comm-1', 'comm-2', 'comm-3'],
  createdCommunities: ['comm-1'],
  subscriptionTier: 'free',
  avatar: 'AC'
};

export const mockCommunities: Community[] = [
  {
    communityId: 'comm-1',
    name: 'AI Entrepreneurs',
    description: 'Building the future with artificial intelligence',
    topicTags: ['AI', 'Startups', 'Machine Learning'],
    members: ['user-1', 'user-2', 'user-3'],
    creationDate: '2024-01-15',
    adminUserId: 'user-1',
    avatar: 'AE',
    memberCount: 1247
  },
  {
    communityId: 'comm-2',
    name: 'Python for Data Science',
    description: 'Learn and share Python techniques for data analysis',
    topicTags: ['Python', 'Data Science', 'Analytics'],
    members: ['user-1', 'user-4', 'user-5'],
    creationDate: '2024-01-10',
    adminUserId: 'user-4',
    avatar: 'PD',
    memberCount: 892
  },
  {
    communityId: 'comm-3',
    name: 'Sustainable Business',
    description: 'Building profitable businesses that help the planet',
    topicTags: ['Sustainability', 'Business', 'ESG'],
    members: ['user-1', 'user-6'],
    creationDate: '2024-01-20',
    adminUserId: 'user-6',
    avatar: 'SB',
    memberCount: 456
  },
  {
    communityId: 'comm-4',
    name: 'React Developers',
    description: 'Modern React development and best practices',
    topicTags: ['React', 'Frontend', 'JavaScript'],
    members: ['user-2', 'user-3'],
    creationDate: '2024-01-12',
    adminUserId: 'user-2',
    avatar: 'RD',
    memberCount: 2134
  }
];

export const mockPosts: Post[] = [
  {
    postId: 'post-1',
    communityId: 'comm-1',
    authorUserId: 'user-1',
    authorUsername: 'alexchen',
    content: 'Just discovered an amazing AI tool for market research. It analyzes competitor data and suggests positioning strategies. Anyone else using AI for business intelligence?',
    timestamp: '2024-01-22T10:30:00Z',
    reactions: { '👍': 12, '🚀': 8, '💡': 5 },
    commentCount: 7
  },
  {
    postId: 'post-2',
    communityId: 'comm-1',
    authorUserId: 'user-2',
    authorUsername: 'sarah_dev',
    content: 'Looking for co-founders for an AI-powered productivity app. Need someone with backend experience and business development skills. DM me if interested!',
    timestamp: '2024-01-22T09:15:00Z',
    reactions: { '👍': 18, '🤝': 12 },
    commentCount: 15
  },
  {
    postId: 'post-3',
    communityId: 'comm-2',
    authorUserId: 'user-4',
    authorUsername: 'data_mike',
    content: 'New tutorial series on advanced pandas techniques. Part 1 covers multi-index operations and performance optimization. Link in comments!',
    timestamp: '2024-01-22T08:45:00Z',
    reactions: { '👍': 25, '📚': 15, '🔥': 8 },
    commentCount: 12
  }
];

export const mockComments: Comment[] = [
  {
    commentId: 'comment-1',
    postId: 'post-1',
    authorUserId: 'user-2',
    authorUsername: 'sarah_dev',
    content: 'Which tool are you using? I\'ve been looking for something like this.',
    timestamp: '2024-01-22T10:45:00Z'
  },
  {
    commentId: 'comment-2',
    postId: 'post-1',
    authorUserId: 'user-3',
    authorUsername: 'mike_ai',
    content: 'We built something similar for our startup. Happy to share our experience!',
    timestamp: '2024-01-22T11:00:00Z'
  }
];

export const mockBusinessIdeas: BusinessIdea[] = [
  {
    id: 'idea-1',
    title: 'AI-Powered Study Buddy',
    description: 'An intelligent tutoring system that adapts to individual learning styles and provides personalized explanations for complex topics.',
    market: 'EdTech',
    aiTech: ['Natural Language Processing', 'Adaptive Learning', 'Knowledge Graphs'],
    difficulty: 'intermediate',
    potential: 85
  },
  {
    id: 'idea-2',
    title: 'Smart Campus Navigator',
    description: 'An AI app that helps students navigate campus efficiently, find study spots, and connect with peers based on location and interests.',
    market: 'Campus Life',
    aiTech: ['Computer Vision', 'Recommendation Systems', 'Geolocation AI'],
    difficulty: 'beginner',
    potential: 72
  },
  {
    id: 'idea-3',
    title: 'Research Paper Summarizer',
    description: 'AI tool that reads academic papers and generates concise, understandable summaries tailored to the reader\'s expertise level.',
    market: 'Academic Tools',
    aiTech: ['Large Language Models', 'Document Analysis', 'Knowledge Extraction'],
    difficulty: 'advanced',
    potential: 91
  }
];