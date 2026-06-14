-- Add sponsor_scope to listings so businesses can target sports teams or all seekers
ALTER TABLE listings ADD COLUMN sponsor_scope TEXT DEFAULT 'all' CHECK (sponsor_scope IN ('all', 'sports_only'));

-- Add organization_type to team_profiles to support non-team sponsor seekers
ALTER TABLE team_profiles ADD COLUMN organization_type TEXT DEFAULT 'sports_team' CHECK (organization_type IN ('sports_team', 'organization', 'individual', 'event'));

-- Make sport nullable so non-sports orgs can leave it blank
ALTER TABLE team_profiles ALTER COLUMN sport DROP NOT NULL;
ALTER TABLE team_profiles ALTER COLUMN sport SET DEFAULT '';

-- Add member_count as a generic version of athlete_count for non-sports orgs
ALTER TABLE team_profiles ADD COLUMN member_count INT;

-- Add category field for non-sports organizations
ALTER TABLE team_profiles ADD COLUMN organization_category TEXT;
