export type AccountType = 'business' | 'team' | 'admin';

export type MembershipStatus = 'pending' | 'active' | 'expired' | 'suspended';

export type ListingType =
  | 'Jersey Sponsorship'
  | 'Banner Sponsorship'
  | 'Tournament Sponsorship'
  | 'Social Media Promotion'
  | 'Community Event Sponsorship'
  | 'Custom Sponsorship';

export type BusinessCategory =
  | 'Restaurant'
  | 'Auto Shop'
  | 'Gym'
  | 'Insurance'
  | 'Real Estate'
  | 'Medical'
  | 'Retail'
  | 'Other';

export interface Profile {
  id: string;
  email: string;
  account_type: AccountType;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  business_name: string;
  logo_url: string | null;
  category: BusinessCategory;
  description: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  phone: string | null;
  budget_range: string | null;
  membership_status: MembershipStatus;
  activation_date: string | null;
  expiration_date: string | null;
  is_founding_member: boolean;
  profile_views: number;
  plan_type: 'standard' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface TeamProfile {
  id: string;
  team_name: string;
  sport: string;
  age_group: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  logo_url: string | null;
  photo_url: string | null;
  athlete_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  sponsorship_amount: number | null;
  available_spots: number;
  benefits: string | null;
  contact_info: string | null;
  application_requirements: string | null;
  listing_type: string;
  is_active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  business?: BusinessProfile;
}

export interface Application {
  id: string;
  listing_id: string;
  team_id: string;
  team_name: string;
  team_description: string | null;
  requested_amount: number | null;
  reason: string | null;
  contact_info: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'saved';
  created_at: string;
  updated_at: string;
  listing?: Listing;
  team?: TeamProfile;
}

export interface PaymentConfirmation {
  id: string;
  business_id: string;
  business_name: string;
  account_email: string;
  payment_method: 'paypal' | 'cashapp';
  date_paid: string;
  transaction_id: string | null;
  screenshot_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  plan_type: 'standard' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}
