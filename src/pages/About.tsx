import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Target, Users, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">About GS Advertising & Connections</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Bridging the gap between local businesses and youth athletics through meaningful, community-driven partnerships.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-3xl font-black text-white mb-6">Building Community Through Partnership</h2>
            <div className="space-y-5 text-slate-400 leading-relaxed">
              <p>GS Advertising & Connections was founded with a singular vision: to create a professional, trusted platform where local businesses can meaningfully invest in the communities they serve, and where youth athletic programs can access the resources they need to thrive. We believe that the relationship between local commerce and community sports is one of the most powerful social contracts in American life — and we built this platform to nurture, formalize, and scale that relationship.</p>
              <p>Our mission goes beyond transactions. Every sponsorship facilitated through GS Advertising & Connections represents a business becoming part of a team's story — a story told in uniforms, banners, tournament programs, and the memories of young athletes who grow up knowing that their community invested in them. We exist to make those connections possible, professional, and lasting.</p>
            </div>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Youth sports"
              className="w-full h-72 object-cover rounded-3xl mb-6"
            />
          </div>
        </div>

        {/* Why We Built This */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <img
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Business community"
              className="w-full h-72 object-cover rounded-3xl"
            />
          </div>
          <div>
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">Why We Built This</p>
            <h2 className="text-3xl font-black text-white mb-6">Solving Real Problems in Real Communities</h2>
            <div className="space-y-5 text-slate-400 leading-relaxed">
              <p>The challenges that led to GS Advertising & Connections are universal: youth sports coaches running fundraiser after fundraiser just to afford basic equipment; local businesses spending advertising dollars on platforms with no connection to their actual community; parents watching their children miss opportunities because their team couldn't afford tournament fees or proper uniforms. These are solvable problems — they just require the right bridge.</p>
              <p>We recognized that businesses want to support their communities — they simply lack a direct, professional channel to do so. And we saw teams with incredible stories, dedicated athletes, and passionate coaches who just needed someone to notice them. GS Advertising & Connections is that bridge. We provide the infrastructure, the trust framework, and the marketplace that turns good intentions into real partnerships that benefit everyone involved.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="text-3xl font-black text-white">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Community First', desc: 'Every decision we make prioritizes the health and strength of local communities.', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
              { icon: Target, title: 'Purpose-Driven', desc: 'We connect businesses and teams with shared values, not just shared interests.', color: 'text-gold-400', bg: 'bg-gold-400/10', border: 'border-gold-400/20' },
              { icon: Users, title: 'Inclusive Growth', desc: 'Our platform is designed to help organizations of all sizes thrive together.', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
              { icon: Zap, title: 'Real Impact', desc: "We measure success by the tangible difference made in athletes' lives.", color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
            ].map((v, i) => (
              <div key={i} className={`${v.bg} border ${v.border} rounded-3xl p-8`}>
                <v.icon size={32} className={`${v.color} mb-4`} />
                <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-400/20 rounded-3xl p-12">
          <h2 className="text-3xl font-black text-white mb-4">Join Our Growing Community</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Whether you're a business ready to invest in your community or a team looking for support, there's a place for you on GS Advertising & Connections.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-2xl transition-all">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl transition-all hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
