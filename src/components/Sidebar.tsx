import React from 'react';
import { Home, Users, Sparkles, Settings, Plus, Hash } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { state, dispatch } = useApp();
  const { user, communities, activeCommunity, showAITools } = state;

  const joinedCommunities = communities.filter(c => 
    user?.joinedCommunities.includes(c.communityId)
  );

  const handleCommunityClick = (communityId: string) => {
    dispatch({ type: 'SET_ACTIVE_COMMUNITY', payload: communityId });
  };

  const handleAIToolsClick = () => {
    dispatch({ type: 'TOGGLE_AI_TOOLS' });
  };

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-dark-text">NicheConnect</h1>
            <p className="text-xs text-dark-textMuted">Build communities</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${!activeCommunity && !showAITools ? 'bg-dark-bg' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_COMMUNITY', payload: null })}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${showAITools ? 'bg-dark-bg' : ''}`}
            onClick={handleAIToolsClick}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Tools
            <Badge variant="default" className="ml-auto">Pro</Badge>
          </Button>
        </div>

        {/* Communities Section */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-dark-textMuted uppercase tracking-wide">
              Communities
            </h3>
            <Button variant="ghost" size="sm" className="p-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {joinedCommunities.map((community) => (
              <Button
                key={community.communityId}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  activeCommunity === community.communityId ? 'bg-dark-bg' : ''
                }`}
                onClick={() => handleCommunityClick(community.communityId)}
              >
                <Hash className="w-4 h-4 mr-2 text-dark-textMuted" />
                <span className="truncate">{community.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Discover Section */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-dark-textMuted uppercase tracking-wide mb-2">
            Discover
          </h3>
          <div className="space-y-1">
            {communities
              .filter(c => !user?.joinedCommunities.includes(c.communityId))
              .slice(0, 3)
              .map((community) => (
                <div key={community.communityId} className="flex items-center justify-between p-2 rounded-md hover:bg-dark-bg">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Avatar fallback={community.avatar || community.name.slice(0, 2)} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-dark-text truncate">{community.name}</p>
                      <p className="text-xs text-dark-textMuted">{community.memberCount} members</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="ml-2 px-2 py-1 text-xs"
                    onClick={() => dispatch({ type: 'JOIN_COMMUNITY', payload: community.communityId })}
                  >
                    Join
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center space-x-3">
          <Avatar 
            fallback={user?.avatar || user?.username.slice(0, 2).toUpperCase() || 'U'} 
            status="online" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-text truncate">{user?.username}</p>
            <div className="flex items-center space-x-2">
              <Badge variant={user?.subscriptionTier === 'free' ? 'outline' : 'default'}>
                {user?.subscriptionTier}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}