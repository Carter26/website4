import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, Building2, Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Step = 'type' | 'credentials' | 'profile';

const SPORTS = ['Baseball','Basketball','Cheer','Cross Country','Football','Golf','Gymnastics','Hockey','Lacrosse','Soccer','Softball','Swimming','Tennis','Track & Field','Volleyball','Wrestling','Other'];
const AGE_GROUPS = ['8U','10U','12U','14U','16U','18U','High School','College','Adult'];
const BUDGET_RANGES = ['Under $500','$500–$1,000','$1,000–$2,500','$2,500–$5,000','$5,000–$10,000','$10,000+'];
const CATEGORIES = ['Restaurant','Auto Shop','Gym','Insurance','Real Estate','Medical','Retail','Other'];

export default function Register() {
  const [params] = useSearchParams();
  const [step, setStep] = useState<Step>('type');
  const [accountType, setAccountType] = useState<'business' | 'team'>(
    params.get('type') === 'business' ? 'business' : params.get('type') === 'team' ? 'team' : 'business'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetRange, setBudgetRange] = useState('$500–$1,000');

  // Team fields
  const [teamName, setTeamName] = useState('');
  const [sport, setSport] = useState('Basketball');
  const [ageGroup, setAgeGroup] = useState('14U');
  const [teamBio, setTeamBio] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [teamState, setTeamState] = useState('');
  const [athleteCount, setAthleteCount] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    let profileData: Record<string, unknown>;
    if (accountType === 'business') {
      profileData = {
        business_name: businessName,
        category,
        description,
        city,
        state,
        website: website || null,
        phone,
        budget_range: budgetRange,
      };
    } else {
      profileData = {
        team_name: teamName,
        sport,
        age_group: ageGroup,
        bio: teamBio,
        city: teamCity,
        state: teamState,
        athlete_count: athleteCount ? parseInt(athleteCount) : null,
      };
    }

    const { error } = await signUp(email, password, accountType, profileData);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-black text-navy-950 text-xl">GS</div>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Your Account</h1>
          <p className="text-slate-400">Join GS Advertising & Connections today</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(['type', 'credentials', 'profile'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-gold-400' : i < ['type','credentials','profile'].indexOf(step) ? 'text-emerald-400' : 'text-slate-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step === s ? 'border-gold-400 bg-gold-400/10 text-gold-400' :
                  i < ['type','credentials','profile'].indexOf(step) ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' :
                  'border-slate-700 text-slate-600'
                }`}>
                  {i < ['type','credentials','profile'].indexOf(step) ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block capitalize">{s === 'type' ? 'Account Type' : s === 'credentials' ? 'Credentials' : 'Profile'}</span>
              </div>
              {i < 2 && <div className={`flex-1 max-w-12 h-px ${i < ['type','credentials','profile'].indexOf(step) ? 'bg-emerald-400/40' : 'bg-slate-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Account Type */}
          {step === 'type' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose Your Account Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setAccountType('business')}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all hover:scale-102 ${
                    accountType === 'business'
                      ? 'border-gold-400 bg-gold-400/10'
                      : 'border-white/10 hover:border-white/20 bg-navy-950/50'
                  }`}
                >
                  {accountType === 'business' && <CheckCircle size={20} className="absolute top-4 right-4 text-gold-400" />}
                  <Building2 size={32} className={accountType === 'business' ? 'text-gold-400' : 'text-slate-400'} />
                  <h3 className="text-white font-bold mt-3 mb-1">Business Account</h3>
                  <p className="text-slate-400 text-sm">Create sponsorship opportunities and connect with local teams</p>
                  <ul className="mt-4 space-y-1">
                    {['Post sponsorship listings', 'Manage applications', 'View analytics'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-slate-400 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />{f}
                      </li>
                    ))}
                  </ul>
                </button>

                <button
                  onClick={() => setAccountType('team')}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                    accountType === 'team'
                      ? 'border-gold-400 bg-gold-400/10'
                      : 'border-white/10 hover:border-white/20 bg-navy-950/50'
                  }`}
                >
                  {accountType === 'team' && <CheckCircle size={20} className="absolute top-4 right-4 text-gold-400" />}
                  <Trophy size={32} className={accountType === 'team' ? 'text-gold-400' : 'text-slate-400'} />
                  <h3 className="text-white font-bold mt-3 mb-1">Team Account</h3>
                  <p className="text-slate-400 text-sm">Browse opportunities and apply for sponsorships</p>
                  <ul className="mt-4 space-y-1">
                    {['Browse listings', 'Apply for sponsorships', 'Save opportunities'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-slate-400 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />{f}
                      </li>
                    ))}
                  </ul>
                </button>
              </div>
              <button
                onClick={() => setStep('credentials')}
                className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 'credentials' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Account Credentials</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={`${inputClass} pr-12`} placeholder="Minimum 6 characters" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={inputClass} placeholder="Repeat password" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('type')} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">Back</button>
                <button
                  onClick={() => {
                    setError('');
                    if (!email || !password || !confirmPassword) { setError('Please fill all fields'); return; }
                    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
                    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
                    setStep('profile');
                  }}
                  className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Profile */}
          {step === 'profile' && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-white mb-6">{accountType === 'business' ? 'Business' : 'Team'} Profile</h2>

              {accountType === 'business' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Business Name *</label>
                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} required className={inputClass} placeholder="Your Business Name" />
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Sponsorship Budget</label>
                    <select value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className={inputClass}>
                      {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input value={city} onChange={e => setCity(e.target.value)} required className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input value={state} onChange={e => setState(e.target.value)} required className={inputClass} placeholder="State" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label className={labelClass}>Website (Optional)</label>
                    <input value={website} onChange={e => setWebsite(e.target.value)} className={inputClass} placeholder="https://yourbusiness.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Business Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="Tell teams about your business..." />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Team Name *</label>
                    <input value={teamName} onChange={e => setTeamName(e.target.value)} required className={inputClass} placeholder="Your Team Name" />
                  </div>
                  <div>
                    <label className={labelClass}>Sport *</label>
                    <select value={sport} onChange={e => setSport(e.target.value)} className={inputClass}>
                      {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Age Group</label>
                    <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} className={inputClass}>
                      {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input value={teamCity} onChange={e => setTeamCity(e.target.value)} required className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input value={teamState} onChange={e => setTeamState(e.target.value)} required className={inputClass} placeholder="State" />
                  </div>
                  <div>
                    <label className={labelClass}>Number of Athletes</label>
                    <input type="number" value={athleteCount} onChange={e => setAthleteCount(e.target.value)} className={inputClass} placeholder="15" min="1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Team Bio</label>
                    <textarea value={teamBio} onChange={e => setTeamBio(e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="Tell businesses about your team..." />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('credentials')} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">Back</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />Creating...</span> : <><span>Create Account</span><ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
