import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Save, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Restaurant', 'Auto Shop', 'Gym', 'Insurance', 'Real Estate', 'Medical', 'Retail', 'Other'];
const SPORTS = ['Baseball', 'Basketball', 'Cheer', 'Cross Country', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Lacrosse', 'Soccer', 'Softball', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball', 'Wrestling', 'Other'];
const AGE_GROUPS = ['8U', '10U', '12U', '14U', '16U', '18U', 'High School', 'College', 'Adult'];
const BUDGET_RANGES = ['Under $500', '$500–$1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000+'];

export default function Profile() {
  const { user, profile, businessProfile, teamProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Business fields
  const [businessName, setBusinessName] = useState(businessProfile?.business_name || '');
  const [category, setCategory] = useState(businessProfile?.category || 'Restaurant');
  const [description, setDescription] = useState(businessProfile?.description || '');
  const [city, setCity] = useState(businessProfile?.city || '');
  const [state, setState] = useState(businessProfile?.state || '');
  const [website, setWebsite] = useState(businessProfile?.website || '');
  const [phone, setPhone] = useState(businessProfile?.phone || '');
  const [budgetRange, setBudgetRange] = useState(businessProfile?.budget_range || '');

  // Team fields
  const [teamName, setTeamName] = useState(teamProfile?.team_name || '');
  const [sport, setSport] = useState(teamProfile?.sport || 'Basketball');
  const [ageGroup, setAgeGroup] = useState(teamProfile?.age_group || '');
  const [bio, setBio] = useState(teamProfile?.bio || '');
  const [teamCity, setTeamCity] = useState(teamProfile?.city || '');
  const [teamState, setTeamState] = useState(teamProfile?.state || '');
  const [athleteCount, setAthleteCount] = useState(teamProfile?.athlete_count?.toString() || '');

  if (!user) return <Navigate to="/login" replace />;

  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let err = null;
    if (profile?.account_type === 'business') {
      const { error } = await supabase.from('business_profiles').update({
        business_name: businessName,
        category,
        description,
        city,
        state,
        website: website || null,
        phone,
        budget_range: budgetRange,
      }).eq('id', user.id);
      err = error;
    } else if (profile?.account_type === 'team') {
      const { error } = await supabase.from('team_profiles').update({
        team_name: teamName,
        sport,
        age_group: ageGroup,
        bio,
        city: teamCity,
        state: teamState,
        athlete_count: athleteCount ? parseInt(athleteCount) : null,
      }).eq('id', user.id);
      err = error;
    }

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Profile updated successfully!');
      await refreshProfile();
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Edit Profile</h1>
          <p className="text-slate-400 mt-1">Update your {profile?.account_type} profile information</p>
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <CheckCircle size={18} className="text-emerald-400" />
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="pb-5 mb-5 border-b border-white/10">
              <p className="text-slate-400 text-sm">Account Email: <span className="text-white">{profile?.email}</span></p>
              <p className="text-slate-400 text-sm mt-1">Account Type: <span className="text-white capitalize">{profile?.account_type}</span></p>
            </div>

            {profile?.account_type === 'business' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Business Name *</label>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <select value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    {BUDGET_RANGES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input value={state} onChange={e => setState(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Business Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} h-28 resize-none`} />
                </div>
              </div>
            )}

            {profile?.account_type === 'team' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Team Name *</label>
                  <input value={teamName} onChange={e => setTeamName(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sport</label>
                  <select value={sport} onChange={e => setSport(e.target.value)} className={inputClass}>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Age Group</label>
                  <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input value={teamCity} onChange={e => setTeamCity(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input value={teamState} onChange={e => setTeamState(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Number of Athletes</label>
                  <input type="number" value={athleteCount} onChange={e => setAthleteCount(e.target.value)} className={inputClass} min="1" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Team Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} className={`${inputClass} h-28 resize-none`} />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all mt-6">
              {loading ? 'Saving...' : <><Save size={18} />Save Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
