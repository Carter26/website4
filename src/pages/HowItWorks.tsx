import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Search, Handshake, ArrowRight, CheckCircle } from 'lucide-react';

const STEPS_BUSINESS = [
  { title: 'Create a Free Business Account', desc: "Sign up as a business, fill in your profile with your business name, category, location, and description. Your profile helps teams understand who you are and what you're about before they even apply.", tip: 'A complete, professional profile receives significantly more applications.' },
  { title: 'Subscribe to Activate Your Listings', desc: 'For just $20/month (or $30/month for Premium), activate your subscription via PayPal or Cash App. Submit your payment confirmation and our team will activate your account within 24 hours.', tip: 'Upgrade to Premium ($30/mo) for a badge, priority placement, and homepage recognition.' },
  { title: 'Create Sponsorship Listings', desc: "Once active, create detailed sponsorship listings. Specify the sponsorship type (jersey, banner, tournament, etc.), the amount you're offering, what teams receive in exchange, and any requirements.", tip: 'Businesses with multiple diverse listing types receive the most applications.' },
  { title: 'Review and Respond to Applications', desc: 'Teams that are interested in your opportunity will apply directly through the platform. Review their profiles, team descriptions, and reasons for applying, then accept, decline, or save their applications.', tip: 'Respond to applications promptly to build your reputation on the platform.' },
  { title: 'Build the Partnership', desc: "Once you've accepted an application, you'll have the team's contact information to coordinate the sponsorship details. This is where the real relationship begins.", tip: 'The most successful sponsors maintain the relationship beyond a single season.' },
];

const STEPS_TEAM = [
  { title: 'Create a Free Team Account', desc: 'Sign up as a team and fill in your profile. Include your team name, sport, age group, city, state, number of athletes, and a compelling team bio. This is your first impression to potential sponsors.', tip: "A detailed bio explaining your team's story dramatically increases acceptance rates." },
  { title: 'Browse the Marketplace', desc: "Explore active sponsorship opportunities from local businesses. Use filters to find listings by category, location, budget, and sponsorship type to find the best matches for your team.", tip: 'Filter by location to find businesses in your immediate community.' },
  { title: 'Save Opportunities', desc: "Found something that looks promising but aren't ready to apply? Save it to revisit later. Your saved listings are available in your dashboard anytime.", tip: 'Saving and comparing multiple opportunities helps you identify the best fits.' },
  { title: 'Submit Compelling Applications', desc: "When you're ready to apply, tell the business about your team, why you need the sponsorship, how it will be used, and what they can expect in return. Be specific, sincere, and professional.", tip: 'Specific, genuine applications outperform generic ones every time.' },
  { title: 'Receive and Confirm Sponsorship', desc: "If a business accepts your application, you'll receive a notification. Reach out via the contact information provided and begin coordinating the details of your sponsorship agreement.", tip: 'Follow up with sponsors throughout the season to build lasting relationships.' },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Process Guide</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">How It Works</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">A step-by-step guide to connecting businesses with teams on GS Advertising & Connections.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Building2, label: 'Businesses Register', num: '01' },
            { icon: PlusCircle, label: 'Create Listings', num: '02' },
            { icon: Search, label: 'Teams Browse & Apply', num: '03' },
            { icon: Handshake, label: 'Partnerships Form', num: '04' },
          ].map((s, i) => (
            <div key={i} className="relative bg-navy-900/80 border border-white/10 rounded-3xl p-8 text-center">
              {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gold-400/30" />}
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-4">
                <s.icon size={24} className="text-gold-400" />
              </div>
              <p className="text-5xl font-black text-gold-400/20 mb-2">{s.num}</p>
              <p className="text-white font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Business Steps */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
              <Building2 size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">For Businesses</p>
              <h2 className="text-2xl font-black text-white">Your Path to Community Sponsorship</h2>
            </div>
          </div>
          <div className="space-y-6">
            {STEPS_BUSINESS.map((step, i) => (
              <div key={i} className="flex gap-6 bg-navy-900/50 border border-white/10 hover:border-blue-400/20 rounded-2xl p-6 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 font-black">{i + 1}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 p-3 bg-blue-400/5 border border-blue-400/10 rounded-xl">
                    <CheckCircle size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-400 text-sm">{step.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/register?type=business" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-2xl transition-all">
              Register as a Business <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Team Steps */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
              <Search size={20} className="text-gold-400" />
            </div>
            <div>
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider">For Teams</p>
              <h2 className="text-2xl font-black text-white">Your Path to Finding Sponsors</h2>
            </div>
          </div>
          <div className="space-y-6">
            {STEPS_TEAM.map((step, i) => (
              <div key={i} className="flex gap-6 bg-navy-900/50 border border-white/10 hover:border-gold-400/20 rounded-2xl p-6 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 font-black">{i + 1}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 p-3 bg-gold-400/5 border border-gold-400/10 rounded-xl">
                    <CheckCircle size={14} className="text-gold-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gold-400 text-sm">{step.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/register?type=team" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-2xl transition-all">
              Register Your Team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
