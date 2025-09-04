import React, { useState } from 'react';
import { MessageSquare, Heart, Share, MoreHorizontal, Send } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { TextArea } from './ui/Input';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from '../utils/dateUtils';

export function CommunityFeed() {
  const { state, dispatch } = useApp();
  const { posts, comments, activeCommunity, communities, user } = state;
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const activeCommunityData = communities.find(c => c.communityId === activeCommunity);
  const communityPosts = posts.filter(post => 
    activeCommunity ? post.communityId === activeCommunity : true
  );

  const handleCreatePost = () => {
    if (!newPost.trim() || !user || !activeCommunity) return;

    dispatch({
      type: 'CREATE_POST',
      payload: {
        communityId: activeCommunity,
        authorUserId: user.userId,
        authorUsername: user.username,
        content: newPost,
      }
    });
    setNewPost('');
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim() || !user) return;

    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        postId,
        authorUserId: user.userId,
        authorUsername: user.username,
        content: newComment,
      }
    });
    setNewComment('');
  };

  const handleReaction = (postId: string, reaction: string) => {
    dispatch({
      type: 'REACT_TO_POST',
      payload: { postId, reaction }
    });
  };

  const getPostComments = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Community Header */}
        {activeCommunityData && (
          <div className="text-center py-8">
            <Avatar 
              fallback={activeCommunityData.avatar || activeCommunityData.name.slice(0, 2)} 
              size="lg" 
            />
            <h1 className="text-2xl font-bold text-dark-text mt-3">{activeCommunityData.name}</h1>
            <p className="text-dark-textMuted mt-1">{activeCommunityData.description}</p>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <span className="text-sm text-dark-textMuted">
                {activeCommunityData.memberCount.toLocaleString()} members
              </span>
              <div className="flex space-x-1">
                {activeCommunityData.topicTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Post */}
        {activeCommunity && (
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar 
                  fallback={user?.avatar || user?.username.slice(0, 2).toUpperCase() || 'U'} 
                />
                <div className="flex-1">
                  <TextArea
                    placeholder="Share your thoughts with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {communityPosts.map((post) => (
            <Card key={post.postId}>
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar fallback={post.authorUsername.slice(0, 2).toUpperCase()} />
                    <div>
                      <p className="font-medium text-dark-text">{post.authorUsername}</p>
                      <p className="text-sm text-dark-textMuted">
                        {formatDistanceToNow(new Date(post.timestamp))} ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="text-dark-text mb-4 leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center space-x-4 pt-3 border-t border-dark-border">
                  <div className="flex items-center space-x-1">
                    {Object.entries(post.reactions).map(([reaction, count]) => (
                      <Button
                        key={reaction}
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1"
                        onClick={() => handleReaction(post.postId, reaction)}
                      >
                        <span className="mr-1">{reaction}</span>
                        <span className="text-xs">{count}</span>
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(post.postId, '👍')}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      React
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(showComments === post.postId ? null : post.postId)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {post.commentCount} Comments
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments === post.postId && (
                  <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
                    {getPostComments(post.postId).map((comment) => (
                      <div key={comment.commentId} className="flex space-x-3">
                        <Avatar 
                          fallback={comment.authorUsername.slice(0, 2).toUpperCase()} 
                          size="sm" 
                        />
                        <div className="flex-1">
                          <div className="bg-dark-bg rounded-lg p-3">
                            <p className="font-medium text-dark-text text-sm">
                              {comment.authorUsername}
                            </p>
                            <p className="text-dark-text mt-1">{comment.content}</p>
                          </div>
                          <p className="text-xs text-dark-textMuted mt-1">
                            {formatDistanceToNow(new Date(comment.timestamp))} ago
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex space-x-3">
                      <Avatar 
                        fallback={user?.avatar || user?.username.slice(0, 2).toUpperCase() || 'U'} 
                        size="sm" 
                      />
                      <div className="flex-1 flex space-x-2">
                        <TextArea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.postId)}
                          disabled={!newComment.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {communityPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-dark-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-text mb-2">No posts yet</h3>
            <p className="text-dark-textMuted">
              {activeCommunity 
                ? "Be the first to share something with this community!" 
                : "Join a community to start seeing posts."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}