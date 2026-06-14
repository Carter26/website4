
-- Helper function to check if current user is admin (security definer bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND account_type = 'admin'
  );
$$;

-- Admin SELECT policies for all major tables

CREATE POLICY "admin_select_all_profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_select_all_business_profiles" ON business_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_update_all_business_profiles" ON business_profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_select_all_team_profiles" ON team_profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_select_all_listings" ON listings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_delete_all_listings" ON listings
  FOR DELETE USING (public.is_admin());

CREATE POLICY "admin_update_all_listings" ON listings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_select_all_applications" ON applications
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_select_all_payment_confirmations" ON payment_confirmations
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_update_all_payment_confirmations" ON payment_confirmations
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_select_all_contact_messages" ON contact_messages
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_update_all_contact_messages" ON contact_messages
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_insert_notifications" ON notifications
  FOR INSERT WITH CHECK (true);
