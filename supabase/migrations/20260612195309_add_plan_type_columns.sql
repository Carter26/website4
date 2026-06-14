-- Add plan_type column to business_profiles table
ALTER TABLE business_profiles ADD COLUMN plan_type TEXT DEFAULT 'standard' CHECK (plan_type IN ('standard', 'premium'));

-- Add plan_type column to payment_confirmations table
ALTER TABLE payment_confirmations ADD COLUMN plan_type TEXT DEFAULT 'standard' CHECK (plan_type IN ('standard', 'premium'));

-- Add constraint: if plan_type is 'premium', is_founding_member must be true
ALTER TABLE business_profiles ADD CONSTRAINT premium_requires_founding_member 
  CHECK (plan_type != 'premium' OR is_founding_member = true);