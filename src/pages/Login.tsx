import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Invalid email or password');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-black text-navy-950 text-xl">GS</div>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your GS Advertising account</p>
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />Signing In...</span>
              ) : (
                <><span>Sign In</span><ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
