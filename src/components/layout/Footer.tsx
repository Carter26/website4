import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-black text-navy-950 text-lg">
                GS
              </div>
              <div>
                <div className="text-white font-bold text-sm">GS Advertising</div>
                <div className="text-gold-400 text-xs font-medium tracking-wider">& CONNECTIONS</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting local businesses with youth sports teams, high school athletic programs, and community organizations.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/50 flex items-center justify-center text-slate-400 hover:text-gold-400 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: 'Marketplace', to: '/marketplace' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'About', to: '/about' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:gsadvertisingandconnections@gmail.com" className="text-slate-400 hover:text-white text-sm transition-colors">gsadvertisingandconnections@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">Available via contact form</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">Serving communities nationwide</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">Premium Member Program</p>
              <p className="text-slate-400 text-xs">Upgrade to Premium for priority placement and exclusive recognition.</p>
              <Link to="/pricing" className="text-gold-400 text-xs font-semibold hover:text-gold-300 mt-2 inline-block">Learn More &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} GS Advertising & Connections. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy</Link>
            <Link to="/contact" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
