import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, ArrowRight, Building2, Trophy } from 'lucide-react';

const BUSINESS_FEATURES = [
  'Full Marketplace Visibility',
  'Unlimited Sponsorship Listings',
  'Team Application Management',
  'Accept / Decline / Save Applications',
  'Analytics Dashboard',
  'Business Profile Page',
  'Direct Team Contact',
  'Email Notifications',
];

const FOUNDING_EXTRAS = [
  'Premium Member Badge on Profile',
  'Priority Marketplace Placement',
  'Featured Homepage Placement',
  'Dedicated Recognition Page',
  'Premium Recognition Status',
  'First Access to New Features',
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Simple Pricing</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Transparent, Affordable Membership</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">One simple plan for businesses. Always free for teams.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Free Team Plan */}
          <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6">
              <Trophy size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-black text-2xl mb-1">Team</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-black text-white">Free</span>
            </div>
            <p className="text-slate-400 text-sm mb-8">Always free for youth and high school athletic programs</p>
            <div className="space-y-3 mb-8">
              {['Browse sponsorship marketplace', 'Apply to unlimited opportunities', 'Save listings for later', 'Team profile page', 'Application status tracking', 'Email notifications'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/register?type=team" className="block w-full py-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-center rounded-2xl transition-all">
              Register Your Team
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-gradient-to-br from-gold-500/15 to-navy-900 border border-gold-400/40 rounded-3xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1.5 bg-gold-500 text-navy-950 text-xs font-black rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center mb-6">
              <Building2 size={24} className="text-gold-400" />
            </div>
            <h3 className="text-white font-black text-2xl mb-1">Business</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-black text-white">$20</span>
              <span className="text-slate-400 text-lg mb-1">/month</span>
            </div>
            <p className="text-slate-400 text-sm mb-8">30-day access · Renew anytime</p>
            <div className="space-y-3 mb-8">
              {BUSINESS_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/register?type=business" className="block w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-center rounded-2xl transition-all shadow-lg shadow-gold-500/20">
              Get Started
            </Link>
          </div>

          {/* Premium Member */}
          <div className="bg-gradient-to-br from-gold-400/10 via-navy-900 to-navy-900 border border-gold-400/30 rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                <Star size={24} className="text-gold-400" fill="currentColor" />
              </div>
              <span className="px-3 py-1 bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-400 text-xs font-bold uppercase">Best Value</span>
            </div>
            <h3 className="text-white font-black text-2xl mb-1">Premium Member</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-black text-white">$30</span>
              <span className="text-slate-400 text-lg mb-1">/month</span>
            </div>
            <p className="text-gold-400 text-sm mb-8 font-medium">All standard features plus exclusive premium perks</p>
            <div className="space-y-3 mb-8">
              {[...BUSINESS_FEATURES, ...FOUNDING_EXTRAS].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle size={16} className={FOUNDING_EXTRAS.includes(f) ? 'text-gold-400 flex-shrink-0' : 'text-emerald-400 flex-shrink-0'} />
                  <span className={`text-sm ${FOUNDING_EXTRAS.includes(f) ? 'text-gold-300 font-medium' : 'text-slate-300'}`}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/payment?plan=premium" className="block w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-center rounded-2xl transition-all flex items-center justify-center gap-2">
              <Star size={16} fill="currentColor" />Get Premium — $30/mo
            </Link>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-navy-900/50 border border-white/10 rounded-3xl p-8 mb-16">
          <h2 className="text-white font-bold text-xl mb-6 text-center">Accepted Payment Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center">
              <div className="text-blue-400 font-bold text-lg mb-2">PayPal</div>
              <p className="text-slate-400 text-sm mb-4">Send $20 or $30 (Premium) to our PayPal link</p>
              <code className="text-blue-400 text-sm bg-blue-500/10 px-3 py-2 rounded-lg block">paypal.me/gsadvertising</code>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <div className="text-emerald-400 font-bold text-lg mb-2">Cash App</div>
              <p className="text-slate-400 text-sm mb-4">Send $20 or $30 (Premium) to our Cash App</p>
              <code className="text-emerald-400 text-sm bg-emerald-500/10 px-3 py-2 rounded-lg block">$GSAdvCon</code>
            </div>
          </div>
          <p className="text-slate-500 text-sm text-center mt-6">After payment, submit a confirmation form and your account will be activated within 24 hours.</p>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-4">Questions About Pricing?</h2>
          <p className="text-slate-400 mb-6">Contact us — we're happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
              Contact Us
            </Link>
            <Link to="/payment" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all">
              Subscribe Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
