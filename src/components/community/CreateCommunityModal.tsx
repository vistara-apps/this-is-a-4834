import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Hash, Users, Tag } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { Community } from '../../types';
import { stripeService } from '../../services/stripeService';

const createCommunitySchema = z.object({
  name: z.string().min(3, 'Community name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.string().min(1, 'Please add at least one tag'),
});

type CreateCommunityFormData = z.infer<typeof createCommunitySchema>;

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommunityFormData>({
    resolver: zodResolver(createCommunitySchema),
  });

  const onSubmit = async (data: CreateCommunityFormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check subscription limits
      const limits = stripeService.getSubscriptionLimits(user.subscriptionTier);
      const userCreatedCommunities = user.createdCommunities.length;

      if (userCreatedCommunities >= limits.maxCreatedCommunities) {
        if (user.subscriptionTier === 'free') {
          setError('Free users cannot create communities. Upgrade to Pro or Premium to create communities.');
          return;
        } else if (user.subscriptionTier === 'pro' && userCreatedCommunities >= 5) {
          setError('Pro users can create up to 5 communities. Upgrade to Premium for unlimited communities.');
          return;
        }
      }

      // Create new community
      const newCommunity: Community = {
        communityId: `comm-${Date.now()}`,
        name: data.name,
        description: data.description,
        topicTags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        members: [user.userId],
        creationDate: new Date().toISOString().split('T')[0],
        adminUserId: user.userId,
        avatar: data.name.substring(0, 2).toUpperCase(),
        memberCount: 1
      };

      // Add community to state (in a real app, this would be an API call)
      dispatch({ type: 'CREATE_COMMUNITY', payload: newCommunity });
      
      // Update user's created communities
      const updatedUser = {
        ...user,
        createdCommunities: [...user.createdCommunities, newCommunity.communityId],
        joinedCommunities: [...user.joinedCommunities, newCommunity.communityId]
      };
      
      // Update localStorage (in a real app, this would be handled by the backend)
      localStorage.setItem('user', JSON.stringify(updatedUser));

      reset();
      onClose();
      
      // Show success message
      alert(`Community "${data.name}" created successfully! 🎉`);
      
      // Reload to reflect changes
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create community');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark-text">Create Community</h2>
          <button
            onClick={handleClose}
            className="text-dark-textMuted hover:text-dark-text"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
              Community Name
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textMuted w-5 h-5" />
              <Input
                {...register('name')}
                type="text"
                placeholder="e.g., AI Entrepreneurs"
                className="pl-10"
                error={errors.name?.message}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark-text mb-2">
              Description
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-dark-textMuted w-5 h-5" />
              <Input
                {...register('description')}
                variant="textarea"
                placeholder="Describe what your community is about..."
                className="pl-10 min-h-[100px]"
                error={errors.description?.message}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-dark-text mb-2">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-textMuted w-5 h-5" />
              <Input
                {...register('tags')}
                type="text"
                placeholder="AI, Startups, Machine Learning (comma-separated)"
                className="pl-10"
                error={errors.tags?.message}
              />
            </div>
            <p className="text-sm text-dark-textMuted mt-1">
              Separate tags with commas to help others discover your community
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>

        {user?.subscriptionTier === 'free' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Free Plan Limitation:</strong> Upgrade to Pro or Premium to create communities and unlock advanced features.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
