import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, BusinessProfile, TeamProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  businessProfile: BusinessProfile | null;
  teamProfile: TeamProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, accountType: string, profileData: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
      if (profileData.account_type === 'business') {
        const { data: bp } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        setBusinessProfile(bp);
        setTeamProfile(null);
      } else if (profileData.account_type === 'team') {
        const { data: tp } = await supabase
          .from('team_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        setTeamProfile(tp);
        setBusinessProfile(null);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setBusinessProfile(null);
        setTeamProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    accountType: string,
    profileData: Record<string, unknown>
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (!data.user) return { error: new Error('No user returned') };

    const userId = data.user.id;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email,
      account_type: accountType,
    });
    if (profileError) return { error: profileError };

    if (accountType === 'business') {
      const { error: bpError } = await supabase.from('business_profiles').insert({
        id: userId,
        ...profileData,
      });
      if (bpError) return { error: bpError };
    } else if (accountType === 'team') {
      const { error: tpError } = await supabase.from('team_profiles').insert({
        id: userId,
        ...profileData,
      });
      if (tpError) return { error: tpError };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setBusinessProfile(null);
    setTeamProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, businessProfile, teamProfile,
      loading, signUp, signIn, signOut, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
