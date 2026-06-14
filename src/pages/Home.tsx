import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, TrendingUp, Star, ChevronRight, Trophy, Building2, Handshake, CheckCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BusinessProfile } from '../types';

function useIntersectionObserver() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('animate-in');
      }),
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  return ref;
}

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useIntersectionObserver();
  return (
    <div ref={ref} className={`fade-section ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<BusinessProfile[]>([]);

  useEffect(() => {
    supabase
      .from('business_profiles')
      .select('*')
      .eq('is_founding_member', true)
      .eq('membership_status', 'active')
      .order('profile_views', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setFeaturedBusinesses(data);
      });
  }, []);

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400/10 border border-gold-400/20 rounded-full mb-8">
              <Star size={14} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Premium Membership Now Available</span>
              <ChevronRight size={14} className="text-gold-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Connecting Local{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                Businesses
              </span>{' '}
              With Local Teams
            </h1>

            <p className="text-slate-300 text-xl sm:text-2xl leading-relaxed mb-10 max-w-3xl">
              Helping businesses grow community visibility while supporting youth and high school athletics through meaningful, lasting sponsorships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-lg rounded-2xl transition-all shadow-xl shadow-gold-500/25 hover:shadow-gold-400/35 hover:scale-105"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold text-lg rounded-2xl transition-all"
              >
                Explore Marketplace
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-xl">
              {[
                { label: 'Businesses', value: 'Growing' },
                { label: 'Teams', value: 'Nationwide' },
                { label: 'Partnerships', value: 'Forming' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-gold-400 mb-1">{s.value}</div>
                  <div className="text-slate-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-gold-400/50 rounded-full" />
        </div>
      </section>

      {/* Why GS Works */}
      <FadeSection>
        <section className="py-24 bg-navy-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">The GS Advantage</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Why GS Advertising Works</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Three powerful pillars that make every sponsorship meaningful for both businesses and teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: 'Local Exposure',
                  color: 'from-blue-500/20 to-blue-600/10',
                  border: 'border-blue-500/20',
                  iconColor: 'text-blue-400',
                  description: 'Unlike national advertising platforms, GS Advertising connects your business directly to your local community. When your brand appears on a youth soccer jersey or a high school basketball banner, it reaches parents, coaches, players, and community members who live, work, and shop right in your area. This hyper-targeted exposure builds genuine brand recognition where it matters most — with real local customers who support businesses that support their kids.'
                },
                {
                  icon: Users,
                  title: 'Team Support',
                  color: 'from-gold-500/20 to-gold-600/10',
                  border: 'border-gold-500/20',
                  iconColor: 'text-gold-400',
                  description: "Every sponsorship through GS Advertising directly impacts student-athletes. Sponsorship funds help teams purchase equipment, cover tournament fees, afford travel costs, and invest in uniforms that instill pride. When a business sponsors a team, they're not just buying advertising — they're investing in the next generation of community leaders. The goodwill generated by sponsoring local youth programs creates lasting positive associations for your brand that money can't buy elsewhere."
                },
                {
                  icon: Handshake,
                  title: 'Lasting Partnerships',
                  color: 'from-emerald-500/20 to-emerald-600/10',
                  border: 'border-emerald-500/20',
                  iconColor: 'text-emerald-400',
                  description: "The relationships formed through GS Advertising aren't limited to a single season. Businesses that invest in local teams build ongoing connections with coaches, parents, and school communities that renew year after year. As teams grow, as athletes graduate and become adults in the community, the businesses that supported them are remembered and recommended. GS Advertising is designed to facilitate these long-term partnerships that evolve from simple sponsorships into genuine community pillars."
                },
              ].map((card, i) => (
                <div key={i} className={`relative bg-gradient-to-br ${card.color} border ${card.border} rounded-3xl p-8 hover:scale-105 transition-transform duration-300 group`}>
                  <div className={`w-14 h-14 rounded-2xl bg-navy-950/50 border ${card.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <card.icon size={28} className={card.iconColor} />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Mission */}
      <FadeSection>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">Building Stronger Communities Through Partnership</h2>
                <div className="space-y-6">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    At GS Advertising & Connections, we believe that local businesses and youth athletic programs are both pillars of strong communities — and that connecting them creates opportunities that benefit everyone. Our mission is to create a sustainable ecosystem where businesses gain meaningful local visibility, and youth sports teams receive the financial support they need to thrive, compete, and grow.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    We're dedicated to ensuring that every student-athlete has access to the resources they need to compete at their highest level. Every sponsorship on our platform represents more than just advertising — it represents a community investing in its youth, a business becoming a genuine local institution, and a partnership that builds social capital that lasts for years. We're not just a platform; we're a movement to strengthen the bonds between local commerce and community athletics.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  {['Community Impact', 'Local Growth', 'Youth Athletics', 'Lasting Bonds'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gold-400/10 border border-gold-400/20 rounded-full text-gold-400 text-sm font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Trophy, title: 'Youth Athletes', desc: 'Supported with equipment and competition funding' },
                  { icon: Building2, title: 'Local Businesses', desc: 'Growing visibility through community investment' },
                  { icon: Users, title: 'Coaches & Parents', desc: 'Connected to businesses that share their values' },
                  { icon: Shield, title: 'Community Trust', desc: 'Built through authentic, lasting partnerships' },
                ].map((item, i) => (
                  <div key={i} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6 hover:border-gold-400/30 transition-colors">
                    <item.icon size={24} className="text-gold-400 mb-3" />
                    <h4 className="text-white font-semibold mb-2 text-sm">{item.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* About Us */}
      <FadeSection>
        <section className="py-24 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent rounded-3xl" />
                  <img
                    src="https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Youth sports team"
                    className="w-full h-80 object-cover rounded-3xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center">
                        <Star size={20} className="text-gold-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">Premium Member</div>
                        <div className="text-slate-400 text-xs">Exclusive platform recognition</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">Why We Built This Platform</h2>
                <div className="space-y-6">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    GS Advertising & Connections was created out of a firsthand understanding of two persistent challenges: youth sports teams perpetually struggling to find adequate sponsorship funding, and local businesses searching for advertising channels that actually reach their community. Traditional advertising — billboards, radio spots, digital banners — misses the authentic local connection that drives real customer loyalty. Meanwhile, talented athletes miss opportunities because their teams lack basic resources.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    We built this platform to eliminate these parallel struggles by creating a dedicated marketplace that connects businesses specifically seeking community visibility with teams specifically seeking community support. By bringing both sides together in one professional platform, we've created a streamlined environment where partnerships form quickly, relationships develop naturally, and both businesses and teams achieve outcomes they couldn't reach alone. GS Advertising & Connections isn't just solving a business problem — it's building the infrastructure for stronger local communities everywhere.
                  </p>
                </div>
                <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                  Read More About Us <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* How It Works */}
      <FadeSection>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">How It Works</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Four simple steps to connect businesses with teams and build lasting community partnerships.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', icon: Building2, title: 'Create Account', desc: 'Businesses and teams create professional profiles highlighting what they offer and what they need.', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                { step: '02', icon: Star, title: 'Post Opportunities', desc: 'Businesses create detailed sponsorship listings — jersey sponsorships, banners, tournaments, and more.', color: 'text-gold-400', bg: 'bg-gold-400/10', border: 'border-gold-400/20' },
                { step: '03', icon: Users, title: 'Teams Apply', desc: "Teams browse opportunities and apply with their story, showcasing why they're the perfect fit.", color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                { step: '04', icon: Handshake, title: 'Partnership Formed', desc: 'Businesses review applications, connect with teams, and partnerships are finalized on both sides.', color: 'text-gold-400', bg: 'bg-gold-400/10', border: 'border-gold-400/20' },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  {i < 3 && <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-10" />}
                  <div className={`${item.bg} border ${item.border} rounded-3xl p-8 hover:scale-105 transition-transform duration-300`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center`}>
                        <item.icon size={24} className={item.color} />
                      </div>
                      <span className={`text-4xl font-black ${item.color} opacity-30`}>{item.step}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Featured Premium Businesses */}
      {featuredBusinesses.length > 0 && (
        <FadeSection>
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Premium Partners</p>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Featured Community Sponsors</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our Premium Members are leading businesses committed to supporting local athletics and community growth.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredBusinesses.map(biz => (
                  <div key={biz.id} className="bg-navy-900/80 border border-gold-400/20 hover:border-gold-400/40 rounded-2xl p-6 transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                        {biz.logo_url ? (
                          <img src={biz.logo_url} alt={biz.business_name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Building2 size={20} className="text-gold-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">{biz.business_name}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <MapPin size={10} />
                          <span className="truncate">{biz.city}, {biz.state}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">{biz.description || 'Community-focused business'}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gold-400/10 border border-gold-400/30 rounded text-gold-400 text-xs font-bold">Premium</span>
                      <span className="text-slate-500 text-xs">{biz.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeSection>
      )}

      {/* Premium Member Program */}
      <FadeSection>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-gold-500/15 via-gold-400/5 to-transparent border border-gold-400/30 rounded-3xl p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gold-400/20 border border-gold-400/40 rounded-full">
                    <Star size={14} className="text-gold-400" fill="currentColor" />
                    <span className="text-gold-400 text-sm font-bold">Premium Member Program</span>
                  </div>
                  <span className="text-slate-400 text-sm">$30/Month</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                      Upgrade to{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                        Premium
                      </span>
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                      Take your sponsorship presence to the next level. Premium members receive exclusive platform recognition, priority placement in the marketplace, and dedicated homepage features that set them apart from the competition.
                    </p>
                    <Link to="/payment?plan=premium" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-lg rounded-2xl transition-all shadow-xl shadow-gold-500/25 hover:scale-105">
                      Get Premium — $30/mo
                      <ArrowRight size={20} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Premium Member Badge',
                      'Priority Marketplace Placement',
                      'Featured Homepage Placement',
                      'Dedicated Recognition Page',
                      'Early Supporter Recognition',
                      '$30/Month Membership',
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 bg-navy-950/40 border border-gold-400/20 rounded-xl p-4">
                        <CheckCircle size={18} className="text-gold-400 flex-shrink-0" />
                        <span className="text-white text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* CTA */}
      <FadeSection>
        <section className="py-24 bg-navy-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-slate-400 text-xl mb-10">
              Whether you're a business looking to grow your community presence or a team looking for support, GS Advertising & Connections has a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?type=business" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-lg rounded-2xl transition-all shadow-xl shadow-gold-500/25 hover:scale-105">
                <Building2 size={20} />
                I'm a Business
              </Link>
              <Link to="/register?type=team" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-2xl transition-all">
                <Trophy size={20} />
                I'm a Team
              </Link>
            </div>
          </div>
        </section>
      </FadeSection>
    </div>
  );
}
