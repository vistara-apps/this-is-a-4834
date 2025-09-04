import React, { useState } from 'react';
import { Check, Crown, Zap, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { subscriptionPlans, stripeService, SubscriptionPlan } from '../../services/stripeService';
import { useApp } from '../../context/AppContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { state } = useApp();
  const { user } = state;
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!user || plan.tier === 'free') return;

    setIsLoading(plan.id);
    try {
      await stripeService.createCheckoutSession(plan.id, user.userId);
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'premium':
        return <Crown className="w-6 h-6 text-purple-500" />;
      default:
        return <Check className="w-6 h-6 text-green-500" />;
    }
  };

  const isCurrentPlan = (tier: string) => user?.subscriptionTier === tier;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark-text">Choose Your Plan</h2>
            <p className="text-dark-textMuted mt-1">
              Upgrade to unlock advanced AI tools and premium features
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-dark-textMuted hover:text-dark-text"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-6 ${
                isCurrentPlan(plan.tier)
                  ? 'border-primary bg-primary/5'
                  : plan.tier === 'premium'
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                  : 'border-dark-border bg-dark-surface'
              }`}
            >
              {plan.tier === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan(plan.tier) && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="outline" className="bg-primary text-white border-primary">
                    Current Plan
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  {getPlanIcon(plan.tier)}
                </div>
                <h3 className="text-xl font-bold text-dark-text">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-dark-text">
                    ${plan.price}
                  </span>
                  <span className="text-dark-textMuted">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-dark-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.tier === 'premium' ? 'primary' : 'outline'}
                disabled={isCurrentPlan(plan.tier) || isLoading === plan.id}
                onClick={() => handleUpgrade(plan)}
              >
                {isLoading === plan.id
                  ? 'Processing...'
                  : isCurrentPlan(plan.tier)
                  ? 'Current Plan'
                  : plan.tier === 'free'
                  ? 'Free Forever'
                  : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-dark-textMuted">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          {user?.subscriptionTier !== 'free' && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel your subscription?')) {
                  stripeService.cancelSubscription(user.userId);
                }
              }}
              className="text-sm text-red-500 hover:text-red-600 mt-2"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
