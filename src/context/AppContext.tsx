import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Community, Post, Comment, BusinessIdea } from '../types';
import { mockUser, mockCommunities, mockPosts, mockComments, mockBusinessIdeas } from '../data/mockData';

interface AppState {
  user: User | null;
  communities: Community[];
  posts: Post[];
  comments: Comment[];
  businessIdeas: BusinessIdea[];
  activeCommunity: string | null;
  showAITools: boolean;
  loading: boolean;
}

type AppAction = 
  | { type: 'SET_ACTIVE_COMMUNITY'; payload: string | null }
  | { type: 'TOGGLE_AI_TOOLS' }
  | { type: 'JOIN_COMMUNITY'; payload: string }
  | { type: 'LEAVE_COMMUNITY'; payload: string }
  | { type: 'CREATE_POST'; payload: Omit<Post, 'postId' | 'timestamp' | 'reactions' | 'commentCount'> }
  | { type: 'ADD_COMMENT'; payload: Omit<Comment, 'commentId' | 'timestamp'> }
  | { type: 'REACT_TO_POST'; payload: { postId: string; reaction: string } }
  | { type: 'ADD_BUSINESS_IDEA'; payload: BusinessIdea }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: mockUser,
  communities: mockCommunities,
  posts: mockPosts,
  comments: mockComments,
  businessIdeas: mockBusinessIdeas,
  activeCommunity: 'comm-1',
  showAITools: false,
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_COMMUNITY':
      return { ...state, activeCommunity: action.payload, showAITools: false };
    
    case 'TOGGLE_AI_TOOLS':
      return { ...state, showAITools: !state.showAITools, activeCommunity: null };
    
    case 'JOIN_COMMUNITY':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          joinedCommunities: [...state.user.joinedCommunities, action.payload]
        },
        communities: state.communities.map(community =>
          community.communityId === action.payload
            ? { ...community, members: [...community.members, state.user!.userId], memberCount: community.memberCount + 1 }
            : community
        )
      };
    
    case 'LEAVE_COMMUNITY':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          joinedCommunities: state.user.joinedCommunities.filter(id => id !== action.payload)
        },
        communities: state.communities.map(community =>
          community.communityId === action.payload
            ? { 
                ...community, 
                members: community.members.filter(id => id !== state.user!.userId),
                memberCount: Math.max(0, community.memberCount - 1)
              }
            : community
        )
      };
    
    case 'CREATE_POST':
      const newPost: Post = {
        ...action.payload,
        postId: `post-${Date.now()}`,
        timestamp: new Date().toISOString(),
        reactions: {},
        commentCount: 0
      };
      return {
        ...state,
        posts: [newPost, ...state.posts]
      };
    
    case 'ADD_COMMENT':
      const newComment: Comment = {
        ...action.payload,
        commentId: `comment-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      return {
        ...state,
        comments: [...state.comments, newComment],
        posts: state.posts.map(post =>
          post.postId === action.payload.postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        )
      };
    
    case 'REACT_TO_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.postId === action.payload.postId
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  [action.payload.reaction]: (post.reactions[action.payload.reaction] || 0) + 1
                }
              }
            : post
        )
      };
    
    case 'ADD_BUSINESS_IDEA':
      return {
        ...state,
        businessIdeas: [action.payload, ...state.businessIdeas]
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}