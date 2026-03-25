import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin';
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Timestamp;
}

export interface UsageRecord {
  id: string;
  userId: string;
  type: 'chat' | 'video';
  count: number;
  date: string; // YYYY-MM-DD
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Timestamp;
}

export interface PlanInfo {
  id: SubscriptionPlan;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const PLANS: PlanInfo[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 20,
    description: 'For individuals getting started with Jessica AI',
    features: [
      'Personal AI assistant access',
      'Standard conversations',
      'Basic task support',
      'Account dashboard',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    description: 'For power users and growing businesses',
    features: [
      'Advanced AI assistance',
      'Memory and personalization',
      'Workflow support tools',
      'Priority support',
      'Billing dashboard',
      'Enhanced usage controls'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 200,
    description: 'For teams, agencies, and advanced platform users',
    features: [
      'Full Jessica AI access',
      'Admin controls',
      'Team and client management',
      'Platform-level insights',
      'Advanced billing controls',
      'Priority onboarding',
      'Premium support'
    ]
  }
];
