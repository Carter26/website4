import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Users, TrendingUp, AlertCircle, CheckCircle, X, DollarSign, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Listing, Application } from '../../types';

const LISTING_TYPES = ['Jersey Sponsorship', 'Banner Sponsorship', 'Tournament Sponsorship', 'Social Media Promotion', 'Community Event Sponsorship', 'Custom Sponsorship'];

type Tab = 'overview' | 'listings' | 'applications' | 'subscription';

export default function BusinessDashboard() {
  const { user, businessProfile, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editListing, setEditListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [listingsRes, appsRes] = await Promise.all([
      supabase.from('listings').select('*').eq('business_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('applications').select('*, listing:listings(*), team:team_profiles(*)').in(
        'listing_id',
        listings.length > 0 ? listings.map(l => l.id) : ['00000000-0000-0000-0000-000000000000']
      ),
    ]);
    if (listingsRes.data) {
      setListings(listingsRes.data);
      const { data: apps } = await supabase
        .from('applications')
        .select('*, listing:listings(*), team:team_profiles(*)')
        .in('listing_id', listingsRes.data.length > 0 ? listingsRes.data.map((l: Listing) => l.id) : ['00000000-0000-0000-0000-000000000000'])
        .order('created_at', { ascending: false });
      if (apps) setApplications(apps);
    }
    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const updateApplicationStatus = async (appId: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', appId);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: status as Application['status'] } : a));
  };

  const isExpiringSoon = businessProfile?.expiration_date
    ? new Date(businessProfile.expiration_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
    : false;
  const daysUntilExpiry = businessProfile?.expiration_date
    ? Math.ceil((new Date(businessProfile.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'listings', label: 'Listings', icon: Eye },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">{businessProfile?.business_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                businessProfile?.membership_status === 'active' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                businessProfile?.membership_status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {businessProfile?.membership_status?.toUpperCase() || 'PENDING'}
              </span>
              {businessProfile?.is_founding_member && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gold-400/10 border border-gold-400/30 text-gold-400">PREMIUM MEMBER</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/profile" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all">
              Edit Profile
            </Link>
            {businessProfile?.membership_status === 'active' && (
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl transition-all">
                <Plus size={16} />New Listing
              </button>
            )}
          </div>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && daysUntilExpiry !== null && daysUntilExpiry > 0 && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
            <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-400 text-sm">
              {daysUntilExpiry === 1
                ? 'Your subscription expires tomorrow! Renew now to prevent your listings from becoming hidden.'
                : `Your subscription expires in ${daysUntilExpiry} days.`}
            </p>
            <Link to="/payment" className="ml-auto px-4 py-2 bg-amber-400/20 border border-amber-400/40 text-amber-400 text-sm font-semibold rounded-xl hover:bg-amber-400/30 transition-colors whitespace-nowrap">
              Renew Now
            </Link>
          </div>
        )}

        {businessProfile?.membership_status !== 'active' && (
          <div className="flex items-center gap-3 bg-gold-400/5 border border-gold-400/20 rounded-2xl p-4 mb-6">
            <AlertCircle size={20} className="text-gold-400 flex-shrink-0" />
            <p className="text-gold-400 text-sm">
              {businessProfile?.membership_status === 'pending'
                ? 'Your account is pending. Subscribe to activate your listings and appear in the marketplace.'
                : 'Your subscription has expired. Renew to reactivate your listings.'}
            </p>
            <Link to="/payment" className="ml-auto px-4 py-2 bg-gold-400/20 border border-gold-400/40 text-gold-400 text-sm font-semibold rounded-xl hover:bg-gold-400/30 transition-colors whitespace-nowrap">
              Subscribe Now
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-navy-900/50 border border-white/10 rounded-2xl p-1 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-gold-500/20 border border-gold-400/30 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Listings', value: listings.length, icon: Eye, color: 'blue' },
                { label: 'Active Listings', value: listings.filter(l => l.is_active).length, icon: CheckCircle, color: 'emerald' },
                { label: 'Applications', value: applications.length, icon: Users, color: 'gold' },
                { label: 'Profile Views', value: businessProfile?.profile_views || 0, icon: TrendingUp, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                  <div className={`w-10 h-10 rounded-xl ${stat.color === 'gold' ? 'bg-gold-400/10' : stat.color === 'blue' ? 'bg-blue-400/10' : stat.color === 'emerald' ? 'bg-emerald-400/10' : 'bg-purple-400/10'} flex items-center justify-center mb-3`}>
                    <stat.icon size={18} className={stat.color === 'gold' ? 'text-gold-400' : stat.color === 'blue' ? 'text-blue-400' : stat.color === 'emerald' ? 'text-emerald-400' : 'text-purple-400'} />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Recent Applications</h3>
              {applications.length === 0 ? (
                <p className="text-slate-400 text-sm">No applications yet. Create listings to start receiving applications.</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map(app => (
                    <ApplicationRow key={app.id} app={app} onUpdate={updateApplicationStatus} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {tab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Listings</h2>
              {businessProfile?.membership_status === 'active' && (
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl">
                  <Plus size={16} />Create Listing
                </button>
              )}
            </div>
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/50 border border-white/5 rounded-2xl">
                <Plus size={32} className="text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">No Listings Yet</h3>
                <p className="text-slate-400 text-sm mb-4">Create your first sponsorship listing to connect with teams.</p>
                {businessProfile?.membership_status !== 'active' && (
                  <Link to="/payment" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-sm inline-block">Activate Subscription</Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-navy-900/80 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-white font-bold">{listing.title}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => setEditListing(listing)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deleteListing(listing.id)} className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        {listing.sponsorship_amount && (
                          <span className="text-gold-400 font-bold">${listing.sponsorship_amount.toLocaleString()}</span>
                        )}
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs">{listing.listing_type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Eye size={12} />{listing.views} views
                      </div>
                    </div>
                    {businessProfile?.membership_status !== 'active' && (
                      <p className="text-amber-400 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />Hidden (subscription required)</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Team Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/50 border border-white/5 rounded-2xl">
                <Users size={32} className="text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">No Applications Yet</h3>
                <p className="text-slate-400 text-sm">Applications from teams will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{app.team_name}</h3>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-slate-400 text-sm mb-1">Applied to: <span className="text-slate-300">{(app as Application & { listing?: Listing }).listing?.title}</span></p>
                        {app.requested_amount && (
                          <p className="text-gold-400 text-sm font-semibold mb-2">Requested: ${app.requested_amount.toLocaleString()}</p>
                        )}
                        {app.reason && <p className="text-slate-400 text-sm mb-2">{app.reason}</p>}
                        {app.contact_info && <p className="text-slate-500 text-xs">Contact: {app.contact_info}</p>}
                      </div>
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateApplicationStatus(app.id, 'accepted')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-sm font-semibold rounded-xl transition-all">
                            <CheckCircle size={14} />Accept
                          </button>
                          <button onClick={() => updateApplicationStatus(app.id, 'declined')} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-semibold rounded-xl transition-all">
                            <X size={14} />Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {tab === 'subscription' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Subscription Management</h2>
            <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {businessProfile?.plan_type === 'premium' ? 'Premium Membership' : 'Business Membership'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {businessProfile?.plan_type === 'premium' ? '$30 per month' : '$20 per month'}
                  </p>
                </div>
                <StatusBadge status={businessProfile?.membership_status || 'pending'} large />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-950/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Activated</p>
                  <p className="text-white font-semibold text-sm">{businessProfile?.activation_date ? new Date(businessProfile.activation_date).toLocaleDateString() : 'Not yet activated'}</p>
                </div>
                <div className="bg-navy-950/50 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Expires</p>
                  <p className="text-white font-semibold text-sm">{businessProfile?.expiration_date ? new Date(businessProfile.expiration_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {[
                  'Marketplace Visibility',
                  'Unlimited Sponsorship Listings',
                  'Team Application Management',
                  'Analytics Dashboard',
                  ...(businessProfile?.plan_type === 'premium'
                    ? ['Premium Member Badge', 'Priority Placement', 'Featured Homepage Placement', 'Dedicated Recognition Page']
                    : ['Priority Placement']),
                ].map(b => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={15} className={businessProfile?.plan_type === 'premium' ? 'text-gold-400' : 'text-emerald-400'} />
                    <span className="text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
              <Link to={businessProfile?.plan_type === 'premium' ? '/payment?plan=premium' : '/payment'} className="flex items-center justify-center gap-2 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all">
                {businessProfile?.membership_status === 'active' ? 'Renew Subscription' : 'Subscribe Now'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Listing Modal */}
      {(showCreateModal || editListing) && (
        <ListingModal
          listing={editListing}
          businessId={user!.id}
          onClose={() => { setShowCreateModal(false); setEditListing(null); }}
          onSave={() => { setShowCreateModal(false); setEditListing(null); loadData(); }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status, large = false }: { status: string; large?: boolean }) {
  const classes = `${large ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs'} rounded-lg font-bold ${
    status === 'active' || status === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
    status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
    status === 'declined' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
    status === 'saved' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
    'bg-slate-500/10 border border-slate-500/30 text-slate-400'
  }`;
  return <span className={classes}>{status.toUpperCase()}</span>;
}

function ApplicationRow({ app, onUpdate }: { app: Application; onUpdate: (id: string, status: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-navy-950/50 rounded-xl">
      <div>
        <p className="text-white text-sm font-semibold">{app.team_name}</p>
        <p className="text-slate-400 text-xs">{(app as Application & { listing?: Listing }).listing?.title}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={app.status} />
        {app.status === 'pending' && (
          <>
            <button onClick={() => onUpdate(app.id, 'accepted')} className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <CheckCircle size={13} />
            </button>
            <button onClick={() => onUpdate(app.id, 'declined')} className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
              <X size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ListingModal({ listing, businessId, onClose, onSave }: { listing: Listing | null; businessId: string; onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState(listing?.title || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [amount, setAmount] = useState(listing?.sponsorship_amount?.toString() || '');
  const [spots, setSpots] = useState(listing?.available_spots?.toString() || '1');
  const [benefits, setBenefits] = useState(listing?.benefits || '');
  const [contact, setContact] = useState(listing?.contact_info || '');
  const [requirements, setRequirements] = useState(listing?.application_requirements || '');
  const [type, setType] = useState(listing?.listing_type || 'Custom Sponsorship');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data = {
      business_id: businessId,
      title,
      description,
      sponsorship_amount: amount ? parseFloat(amount) : null,
      available_spots: parseInt(spots) || 1,
      benefits,
      contact_info: contact,
      application_requirements: requirements,
      listing_type: type,
      is_active: true,
    };
    const { error } = listing
      ? await supabase.from('listings').update(data).eq('id', listing.id)
      : await supabase.from('listings').insert(data);
    setSaving(false);
    if (error) setError(error.message);
    else onSave();
  };

  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-bold text-xl">{listing ? 'Edit Listing' : 'Create New Listing'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"><X size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"><AlertCircle size={15} />{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Listing Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required className={inputClass} placeholder="e.g. Jersey Sponsorship for Youth Basketball" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Listing Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
                {LISTING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Sponsorship Amount ($)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} placeholder="500" step="0.01" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Available Spots</label>
              <input type="number" value={spots} onChange={e => setSpots(e.target.value)} className={inputClass} min="1" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Contact Info</label>
              <input value={contact} onChange={e => setContact(e.target.value)} className={inputClass} placeholder="Email or phone" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required className={`${inputClass} h-24 resize-none`} placeholder="Describe this sponsorship opportunity..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Benefits Offered</label>
              <textarea value={benefits} onChange={e => setBenefits(e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Logo on jerseys, social media mentions, banner at games..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Application Requirements</label>
              <textarea value={requirements} onChange={e => setRequirements(e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Team size, age group, sport, location requirements..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all">
              {saving ? 'Saving...' : listing ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
