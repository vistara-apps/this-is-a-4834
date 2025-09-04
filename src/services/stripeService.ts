import { loadStripe, Stripe } from '@stripe/stripe-js';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  tier: SubscriptionTier;
  stripePriceId?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    tier: 'free',
    features: [
      'Join up to 3 communities',
      'Basic AI idea generation (5/month)',
      'Community discussions',
      'Basic profile'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5,
    interval: 'month',
    tier: 'pro',
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'Join unlimited communities',
      'Advanced AI tools (50/month)',
      'Priority support',
      'Create up to 5 communities',
      'Market research summaries',
      'Basic pitch deck outlines'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15,
    interval: 'month',
    tier: 'premium',
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'Unlimited AI tool usage',
      'Exclusive workshops',
      'Direct mentorship access',
      'Advanced market research',
      'Custom pitch deck generation',
      'Technology stack recommendations',
      'Priority community features'
    ]
  }
];

class StripeService {
  private stripe: Stripe | null = null;

  async initialize(): Promise<void> {
    if (!this.stripe) {
      // In production, use your actual Stripe publishable key
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo';
      this.stripe = await loadStripe(publishableKey);
    }
  }

  async createCheckoutSession(planId: string, userId: string): Promise<void> {
    await this.initialize();
    
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan || plan.tier === 'free') {
      throw new Error('Invalid plan selected');
    }

    // In a real app, this would call your backend to create a Stripe checkout session
    // For demo purposes, we'll simulate the flow
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && plan.stripePriceId) {
      try {
        // This would be a call to your backend API
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            userId: userId,
            successUrl: `${window.location.origin}/subscription/success`,
            cancelUrl: `${window.location.origin}/subscription/cancel`,
          }),
        });

        const session = await response.json();
        
        const result = await this.stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } catch (error) {
        console.error('Stripe checkout error:', error);
        // Fall back to mock upgrade for demo
        this.mockUpgrade(planId, userId);
      }
    } else {
      // Demo mode - simulate successful upgrade
      this.mockUpgrade(planId, userId);
    }
  }

  private mockUpgrade(planId: string, userId: string): void {
    // Simulate successful upgrade for demo purposes
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    // Update user's subscription in localStorage (in real app, this would be handled by backend)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.subscriptionTier = plan.tier;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show success message
      alert(`Successfully upgraded to ${plan.name}! 🎉\n\nYou now have access to all ${plan.name} features.`);
      
      // Reload the page to reflect changes
      window.location.reload();
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    // In a real app, this would call your backend to cancel the Stripe subscription
    console.log('Canceling subscription for user:', userId);
    
    // For demo purposes, downgrade to free
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.subscriptionTier = 'free';
      localStorage.setItem('user', JSON.stringify(user));
      
      alert('Subscription canceled. You\'ve been downgraded to the free plan.');
      window.location.reload();
    }
  }

  getSubscriptionLimits(tier: SubscriptionTier) {
    switch (tier) {
      case 'free':
        return {
          maxCommunities: 3,
          maxCreatedCommunities: 0,
          aiGenerationsPerMonth: 5,
          hasAdvancedAI: false,
          hasPrioritySupport: false
        };
      case 'pro':
        return {
          maxCommunities: Infinity,
          maxCreatedCommunities: 5,
          aiGenerationsPerMonth: 50,
          hasAdvancedAI: true,
          hasPrioritySupport: true
        };
      case 'premium':
        return {
          maxCommunities: Infinity,
          maxCreatedCommunities: Infinity,
          aiGenerationsPerMonth: Infinity,
          hasAdvancedAI: true,
          hasPrioritySupport: true
        };
      default:
        return this.getSubscriptionLimits('free');
    }
  }
}

export const stripeService = new StripeService();
