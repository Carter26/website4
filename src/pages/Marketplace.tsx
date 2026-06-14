import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Tag, ArrowRight, X, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Listing, BusinessProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['All', 'Restaurant', 'Auto Shop', 'Gym', 'Insurance', 'Real Estate', 'Medical', 'Retail', 'Other'];
const LISTING_TYPES = ['All', 'Jersey Sponsorship', 'Banner Sponsorship', 'Tournament Sponsorship', 'Social Media Promotion', 'Community Event Sponsorship', 'Custom Sponsorship'];
const BUDGET_OPTIONS = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500–$1,000', min: 500, max: 1000 },
  { label: '$1,000–$2,500', min: 1000, max: 2500 },
  { label: '$2,500–$5,000', min: 2500, max: 5000 },
  { label: '$5,000+', min: 5000, max: Infinity },
];

interface ListingWithBusiness extends Listing {
  business: BusinessProfile;
}

export default function Marketplace() {
  const [listings, setListings] = useState<ListingWithBusiness[]>([]);
  const [filtered, setFiltered] = useState<ListingWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [listingType, setListingType] = useState('All');
  const [budget, setBudget] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*, business:business_profiles(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const sorted = (data as ListingWithBusiness[]).sort((a, b) => {
        const aPremium = a.business?.is_founding_member ? 1 : 0;
        const bPremium = b.business?.is_founding_member ? 1 : 0;
        return bPremium - aPremium;
      });
      setListings(sorted);
      setFiltered(sorted);
    }
    setLoading(false);
  };

  const applyFilters = useCallback(() => {
    let result = [...listings];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(s) ||
        l.business?.business_name.toLowerCase().includes(s) ||
        l.description?.toLowerCase().includes(s)
      );
    }

    if (category !== 'All') {
      result = result.filter(l => l.business?.category === category);
    }

    if (listingType !== 'All') {
      result = result.filter(l => l.listing_type === listingType);
    }

    if (budget > 0) {
      const opt = BUDGET_OPTIONS[budget];
      result = result.filter(l => {
        const amt = l.sponsorship_amount || 0;
        return amt >= opt.min && (opt.max === Infinity || amt <= opt.max);
      });
    }

    if (locationFilter) {
      const loc = locationFilter.toLowerCase();
      result = result.filter(l =>
        l.business?.city?.toLowerCase().includes(loc) ||
        l.business?.state?.toLowerCase().includes(loc)
      );
    }

    setFiltered(result);
  }, [listings, search, category, listingType, budget, locationFilter]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setListingType('All');
    setBudget(0);
    setLocationFilter('');
  };

  const hasActiveFilters = search || category !== 'All' || listingType !== 'All' || budget > 0 || locationFilter;

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Sponsorship Marketplace</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Browse Opportunities</h1>
            <p className="text-slate-400 text-lg">Discover sponsorship opportunities from local businesses supporting youth and high school athletics.</p>
          </div>

          {/* Search */}
          <div className="mt-8 flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-900/80 border border-white/10 focus:border-gold-400/50 rounded-2xl text-white placeholder-slate-500 outline-none transition-colors"
                placeholder="Search businesses, listings..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 border rounded-2xl font-medium text-sm transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-gold-400/10 border-gold-400/40 text-gold-400'
                  : 'bg-navy-900/80 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <Filter size={18} />
              <span className="hidden sm:block">Filters</span>
              {hasActiveFilters && <span className="w-5 h-5 rounded-full bg-gold-400 text-navy-950 text-xs font-bold flex items-center justify-center">!</span>}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 bg-navy-900/80 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 bg-navy-950 border border-white/10 rounded-xl text-white text-sm outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Listing Type</label>
                  <select value={listingType} onChange={e => setListingType(e.target.value)} className="w-full px-3 py-2.5 bg-navy-950 border border-white/10 rounded-xl text-white text-sm outline-none">
                    {LISTING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Budget Range</label>
                  <select value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full px-3 py-2.5 bg-navy-950 border border-white/10 rounded-xl text-white text-sm outline-none">
                    {BUDGET_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                  <input
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-navy-950 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 outline-none"
                    placeholder="City or State"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                  <X size={16} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-slate-400 text-sm">
            {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'opportunity' : 'opportunities'} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-navy-900/50 border border-white/5 rounded-3xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5" />
                  <div className="space-y-2">
                    <div className="w-32 h-3 rounded bg-white/5" />
                    <div className="w-20 h-2 rounded bg-white/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 rounded bg-white/5" />
                  <div className="w-3/4 h-3 rounded bg-white/5" />
                  <div className="w-1/2 h-3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gold-400" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No Opportunities Found</h3>
            <p className="text-slate-400 mb-6">{hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'No active listings yet. Check back soon!'}</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="px-6 py-3 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-xl font-medium hover:bg-gold-500/20 transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <ListingCard key={listing.id} listing={listing} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing, user }: { listing: ListingWithBusiness; user: unknown }) {
  const business = listing.business;

  return (
    <div className="group bg-navy-900/80 border border-white/10 hover:border-gold-400/30 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold-500/5">
      {/* Business Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
          {business?.logo_url ? (
            <img src={business.logo_url} alt={business.business_name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Building2 size={20} className="text-gold-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{business?.business_name}</p>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <MapPin size={11} />
            <span className="truncate">{business?.city}, {business?.state}</span>
          </div>
        </div>
        {business?.is_founding_member && (
          <div className="ml-auto flex-shrink-0 px-2 py-1 bg-gold-400/10 border border-gold-400/30 rounded-lg">
            <span className="text-gold-400 text-xs font-bold">Premium</span>
          </div>
        )}
      </div>

      {/* Listing Info */}
      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-gold-100 transition-colors">{listing.title}</h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{listing.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-medium">
          <Tag size={11} />{listing.listing_type}
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs">
          {business?.category}
        </span>
      </div>

      {/* Amount & CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <DollarSign size={16} className="text-gold-400" />
          <span className="text-gold-400 font-bold text-lg">
            {listing.sponsorship_amount
              ? `$${listing.sponsorship_amount.toLocaleString()}`
              : 'Contact for details'}
          </span>
        </div>
        <Link
          to={user ? `/listing/${listing.id}` : '/login'}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-gold-500/20"
        >
          Apply <ArrowRight size={14} />
        </Link>
      </div>

      {listing.available_spots && listing.available_spots > 0 && (
        <p className="text-slate-500 text-xs mt-3">{listing.available_spots} spot{listing.available_spots !== 1 ? 's' : ''} available</p>
      )}
    </div>
  );
}
