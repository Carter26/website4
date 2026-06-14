import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, BookmarkCheck, Eye, Clock, CheckCircle, X, ArrowRight, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Application, Listing, BusinessProfile } from '../../types';

type Tab = 'overview' | 'applications' | 'saved';

interface ApplicationWithDetails extends Application {
  listing?: Listing & { business?: BusinessProfile };
}

export default function TeamDashboard() {
  const { user, teamProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [savedListings, setSavedListings] = useState<Array<{ id: string; listing: Listing & { business?: BusinessProfile } }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [appsRes, savedRes] = await Promise.all([
      supabase
        .from('applications')
        .select('*, listing:listings(*, business:business_profiles(*))')
        .eq('team_id', user!.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('saved_listings')
        .select('*, listing:listings(*, business:business_profiles(*))')
        .eq('team_id', user!.id)
        .order('created_at', { ascending: false }),
    ]);
    if (appsRes.data) setApplications(appsRes.data);
    if (savedRes.data) setSavedListings(savedRes.data);
    setLoading(false);
  };

  const unsaveListing = async (savedId: string) => {
    await supabase.from('saved_listings').delete().eq('id', savedId);
    setSavedListings(prev => prev.filter(s => s.id !== savedId));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'applications', label: 'My Applications', icon: Clock, count: applications.length },
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedListings.length },
  ];

  const pending = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">{teamProfile?.team_name}</h1>
            <p className="text-slate-400 mt-1">{teamProfile?.sport} · {teamProfile?.age_group} · {teamProfile?.city}, {teamProfile?.state}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/profile" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all">
              Edit Profile
            </Link>
            <Link to="/marketplace" className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl transition-all">
              <Search size={16} />Browse Opportunities
            </Link>
          </div>
        </div>

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
              {t.count !== undefined && t.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-400 text-xs font-bold flex items-center justify-center">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Applications', value: applications.length, color: 'blue', icon: Clock },
                { label: 'Accepted', value: accepted, color: 'emerald', icon: CheckCircle },
                { label: 'Saved Opportunities', value: savedListings.length, color: 'gold', icon: Bookmark },
              ].map((stat, i) => (
                <div key={i} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                  <div className={`w-10 h-10 rounded-xl ${stat.color === 'gold' ? 'bg-gold-400/10' : stat.color === 'blue' ? 'bg-blue-400/10' : 'bg-emerald-400/10'} flex items-center justify-center mb-3`}>
                    <stat.icon size={18} className={stat.color === 'gold' ? 'text-gold-400' : stat.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'} />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Team Profile Card */}
            <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">{teamProfile?.team_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs">{teamProfile?.sport}</span>
                    {teamProfile?.age_group && <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs">{teamProfile.age_group}</span>}
                    {teamProfile?.athlete_count && <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs">{teamProfile.athlete_count} Athletes</span>}
                  </div>
                </div>
                <Link to="/profile" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all">Edit</Link>
              </div>
              {teamProfile?.bio ? (
                <p className="text-slate-400 leading-relaxed">{teamProfile.bio}</p>
              ) : (
                <p className="text-slate-500 text-sm">No bio yet. <Link to="/profile" className="text-gold-400 hover:text-gold-300">Add one</Link></p>
              )}
            </div>

            {applications.length > 0 && (
              <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Recent Applications</h3>
                  <button onClick={() => setTab('applications')} className="text-gold-400 hover:text-gold-300 text-sm font-semibold transition-colors">View All</button>
                </div>
                <div className="space-y-3">
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-navy-950/50 rounded-xl">
                      <div>
                        <p className="text-white text-sm font-semibold">{app.listing?.title}</p>
                        <p className="text-slate-400 text-xs">{app.listing?.business?.business_name}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applications */}
        {tab === 'applications' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">My Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/50 border border-white/5 rounded-2xl">
                <Clock size={32} className="text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">No Applications Yet</h3>
                <p className="text-slate-400 text-sm mb-4">Browse the marketplace to find sponsorship opportunities.</p>
                <Link to="/marketplace" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-sm inline-flex items-center gap-2">
                  Browse Marketplace <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                          <Building2 size={20} className="text-gold-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{app.listing?.title}</h3>
                          <p className="text-slate-400 text-sm">{app.listing?.business?.business_name} · {app.listing?.business?.city}, {app.listing?.business?.state}</p>
                          {app.requested_amount && (
                            <p className="text-gold-400 text-sm font-semibold">Requested: ${app.requested_amount.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        <Link to={`/listing/${app.listing_id}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>
                    {app.status === 'accepted' && (
                      <div className="mt-4 flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <p className="text-emerald-400 text-sm">Congratulations! This business accepted your application. Check their contact info to get started.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved */}
        {tab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Saved Opportunities</h2>
            {savedListings.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/50 border border-white/5 rounded-2xl">
                <Bookmark size={32} className="text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">No Saved Opportunities</h3>
                <p className="text-slate-400 text-sm mb-4">Save listings from the marketplace to revisit them later.</p>
                <Link to="/marketplace" className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-sm inline-flex items-center gap-2">
                  Browse Marketplace <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedListings.map(saved => (
                  <div key={saved.id} className="bg-navy-900/80 border border-white/10 hover:border-gold-400/20 rounded-2xl p-6 transition-colors group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-white font-bold group-hover:text-gold-100 transition-colors">{saved.listing?.title}</h3>
                        <p className="text-slate-400 text-sm">{saved.listing?.business?.business_name}</p>
                      </div>
                      <button onClick={() => unsaveListing(saved.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{saved.listing?.description}</p>
                    <div className="flex items-center justify-between">
                      {saved.listing?.sponsorship_amount && (
                        <span className="text-gold-400 font-bold">${saved.listing.sponsorship_amount.toLocaleString()}</span>
                      )}
                      <Link to={`/listing/${saved.listing?.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-gold-500/10 border border-gold-400/30 text-gold-400 hover:bg-gold-500/20 text-sm font-semibold rounded-xl transition-all ml-auto">
                        View <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 text-xs rounded-lg font-bold ${
      status === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
      status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
      status === 'declined' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
      'bg-slate-500/10 border border-slate-500/30 text-slate-400'
    }`}>
      {status.toUpperCase()}
    </span>
  );
}
