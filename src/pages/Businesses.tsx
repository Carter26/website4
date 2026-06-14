import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Globe, Building2, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BusinessProfile } from '../types';

const CATEGORIES = ['All', 'Restaurant', 'Auto Shop', 'Gym', 'Insurance', 'Real Estate', 'Medical', 'Retail', 'Other'];

export default function Businesses() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [filtered, setFiltered] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('membership_status', 'active')
        .order('is_founding_member', { ascending: false })
        .order('created_at', { ascending: false });
      if (data) { setBusinesses(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...businesses];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(b => b.business_name.toLowerCase().includes(s) || b.description?.toLowerCase().includes(s));
    }
    if (category !== 'All') result = result.filter(b => b.category === category);
    if (location) {
      const loc = location.toLowerCase();
      result = result.filter(b => b.city?.toLowerCase().includes(loc) || b.state?.toLowerCase().includes(loc));
    }
    setFiltered(result);
  }, [businesses, search, category, location]);

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Business Directory</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Local Business Sponsors</h1>
          <p className="text-slate-400 text-lg mb-8">Discover active businesses investing in their local communities through sports sponsorships.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-navy-900/80 border border-white/10 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm" placeholder="Search businesses..." />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-navy-900/80 border border-white/10 rounded-xl text-white text-sm outline-none min-w-36">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={location} onChange={e => setLocation(e.target.value)} className="px-4 py-3 bg-navy-900/80 border border-white/10 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm" placeholder="City or State" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="bg-navy-900/50 border border-white/5 rounded-3xl h-48 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Building2 size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No Businesses Found</h3>
            <p className="text-slate-400">Try adjusting your search or check back soon as more businesses join.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(business => (
              <div key={business.id} className="group bg-navy-900/80 border border-white/10 hover:border-gold-400/30 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center">
                    {business.logo_url ? (
                      <img src={business.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Building2 size={24} className="text-gold-400" />
                    )}
                  </div>
                  {business.is_founding_member && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-gold-400/10 border border-gold-400/20 rounded-lg">
                      <Star size={11} className="text-gold-400" fill="currentColor" />
                      <span className="text-gold-400 text-xs font-bold">Premium</span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-gold-100 transition-colors">{business.business_name}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs">{business.category}</span>
                  {business.city && (
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin size={11} />{business.city}, {business.state}
                    </div>
                  )}
                </div>
                {business.description && (
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{business.description}</p>
                )}
                <div className="flex items-center justify-between">
                  {business.website && (
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs transition-colors">
                      <Globe size={12} />Website
                    </a>
                  )}
                  <Link to="/marketplace" className="ml-auto text-gold-400 hover:text-gold-300 text-sm font-semibold transition-colors">
                    View Listings →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
