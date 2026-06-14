
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('business', 'team', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business profiles
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Restaurant','Auto Shop','Gym','Insurance','Real Estate','Medical','Retail','Other')),
  description TEXT,
  city TEXT,
  state TEXT,
  website TEXT,
  phone TEXT,
  budget_range TEXT,
  membership_status TEXT NOT NULL DEFAULT 'pending' CHECK (membership_status IN ('pending','active','expired','suspended')),
  activation_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  is_founding_member BOOLEAN DEFAULT FALSE,
  profile_views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team profiles
CREATE TABLE team_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  age_group TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  logo_url TEXT,
  photo_url TEXT,
  athlete_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsorship listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sponsorship_amount NUMERIC(10,2),
  available_spots INT DEFAULT 1,
  benefits TEXT,
  contact_info TEXT,
  application_requirements TEXT,
  listing_type TEXT DEFAULT 'Custom',
  is_active BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications from teams to listings
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_description TEXT,
  requested_amount NUMERIC(10,2),
  reason TEXT,
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','saved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment confirmations
CREATE TABLE payment_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  account_email TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal','cashapp')),
  date_paid DATE NOT NULL,
  transaction_id TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved opportunities (teams saving listings)
CREATE TABLE saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES team_profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, listing_id)
);

-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "select_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Business profiles RLS
CREATE POLICY "select_business_profiles" ON business_profiles FOR SELECT USING (true);
CREATE POLICY "insert_own_business_profile" ON business_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_business_profile" ON business_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "delete_own_business_profile" ON business_profiles FOR DELETE USING (auth.uid() = id);

-- Team profiles RLS
CREATE POLICY "select_team_profiles" ON team_profiles FOR SELECT USING (true);
CREATE POLICY "insert_own_team_profile" ON team_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_team_profile" ON team_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "delete_own_team_profile" ON team_profiles FOR DELETE USING (auth.uid() = id);

-- Listings RLS
CREATE POLICY "select_listings" ON listings FOR SELECT USING (true);
CREATE POLICY "insert_own_listings" ON listings FOR INSERT WITH CHECK (auth.uid() = business_id);
CREATE POLICY "update_own_listings" ON listings FOR UPDATE USING (auth.uid() = business_id) WITH CHECK (auth.uid() = business_id);
CREATE POLICY "delete_own_listings" ON listings FOR DELETE USING (auth.uid() = business_id);

-- Applications RLS
CREATE POLICY "select_applications" ON applications FOR SELECT USING (
  auth.uid() = team_id OR
  auth.uid() IN (SELECT business_id FROM listings WHERE id = listing_id)
);
CREATE POLICY "insert_applications" ON applications FOR INSERT WITH CHECK (auth.uid() = team_id);
CREATE POLICY "update_applications" ON applications FOR UPDATE USING (
  auth.uid() = team_id OR
  auth.uid() IN (SELECT business_id FROM listings WHERE id = listing_id)
);
CREATE POLICY "delete_applications" ON applications FOR DELETE USING (auth.uid() = team_id);

-- Payment confirmations RLS
CREATE POLICY "select_own_payment_confirmations" ON payment_confirmations FOR SELECT USING (auth.uid() = business_id);
CREATE POLICY "insert_own_payment_confirmations" ON payment_confirmations FOR INSERT WITH CHECK (auth.uid() = business_id);
CREATE POLICY "update_own_payment_confirmations" ON payment_confirmations FOR UPDATE USING (auth.uid() = business_id);
CREATE POLICY "delete_own_payment_confirmations" ON payment_confirmations FOR DELETE USING (auth.uid() = business_id);

-- Saved listings RLS
CREATE POLICY "select_own_saved_listings" ON saved_listings FOR SELECT USING (auth.uid() = team_id);
CREATE POLICY "insert_own_saved_listings" ON saved_listings FOR INSERT WITH CHECK (auth.uid() = team_id);
CREATE POLICY "update_own_saved_listings" ON saved_listings FOR UPDATE USING (auth.uid() = team_id);
CREATE POLICY "delete_own_saved_listings" ON saved_listings FOR DELETE USING (auth.uid() = team_id);

-- Contact messages RLS
CREATE POLICY "insert_contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "select_contact_messages" ON contact_messages FOR SELECT USING (false);
CREATE POLICY "update_contact_messages" ON contact_messages FOR UPDATE USING (false);
CREATE POLICY "delete_contact_messages" ON contact_messages FOR DELETE USING (false);

-- Notifications RLS
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Admin service role bypass (all policies will be bypassed by service_role key)
-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_profiles_updated_at BEFORE UPDATE ON team_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payment_confirmations_updated_at BEFORE UPDATE ON payment_confirmations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
