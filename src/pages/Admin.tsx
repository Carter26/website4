import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CheckCircle, X, AlertCircle, Users, Building2, FileText, Eye, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { PaymentConfirmation, BusinessProfile, TeamProfile, Listing } from '../types';

type Tab = 'payments' | 'businesses' | 'teams' | 'listings' | 'stats';

export default function Admin() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('payments');
  const [payments, setPayments] = useState<PaymentConfirmation[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [teams, setTeams] = useState<TeamProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ businesses: 0, teams: 0, listings: 0, payments: 0 });

  if (!profile) return null;
  if (profile.account_type !== 'admin') return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [paymentsRes, bizRes, teamsRes, listingsRes] = await Promise.all([
      supabase.from('payment_confirmations').select('*').order('created_at', { ascending: false }),
      supabase.from('business_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('team_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
    ]);
    if (paymentsRes.data) setPayments(paymentsRes.data);
    if (bizRes.data) setBusinesses(bizRes.data);
    if (teamsRes.data) setTeams(teamsRes.data);
    if (listingsRes.data) setListings(listingsRes.data);
    setStats({
      businesses: bizRes.data?.length || 0,
      teams: teamsRes.data?.length || 0,
      listings: listingsRes.data?.length || 0,
      payments: paymentsRes.data?.filter(p => p.status === 'pending').length || 0,
    });
    setLoading(false);
  };

  const approvePayment = async (payment: PaymentConfirmation) => {
    const activationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    await supabase.from('payment_confirmations').update({ status: 'approved' }).eq('id', payment.id);

    const updateData: any = {
      membership_status: 'active',
      activation_date: activationDate.toISOString(),
      expiration_date: expirationDate.toISOString(),
      plan_type: payment.plan_type,
    };

    if (payment.plan_type === 'premium') {
      updateData.is_founding_member = true;
    }

    await supabase.from('business_profiles').update(updateData).eq('id', payment.business_id);
    await supabase.from('notifications').insert({
      user_id: payment.business_id,
      title: 'Membership Activated!',
      message: 'Your GS Advertising membership is now active. Your listings are now visible in the marketplace.',
      link: '/dashboard',
    });
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'approved' } : p));
    setBusinesses(prev => prev.map(b => b.id === payment.business_id ? { ...b, membership_status: 'active', plan_type: payment.plan_type, ...(payment.plan_type === 'premium' ? { is_founding_member: true } : {}) } : b));
  };

  const rejectPayment = async (paymentId: string) => {
    await supabase.from('payment_confirmations').update({ status: 'rejected' }).eq('id', paymentId);
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
  };

  const toggleBusinessStatus = async (business: BusinessProfile) => {
    const newStatus = business.membership_status === 'suspended' ? 'active' : 'suspended';
    await supabase.from('business_profiles').update({ membership_status: newStatus }).eq('id', business.id);
    setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, membership_status: newStatus } : b));
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'payments', label: 'Payments', icon: FileText, badge: stats.payments },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'listings', label: 'Listings', icon: Eye },
    { id: 'stats', label: 'Statistics', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
            <Shield size={20} className="text-gold-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Manage your platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-navy-900/50 border border-white/10 rounded-2xl p-1 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-gold-500/20 border border-gold-400/30 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={15} />{t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500/80 text-white text-xs font-bold flex items-center justify-center">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Payments */}
            {tab === 'payments' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Payment Confirmations</h2>
                {payments.length === 0 ? (
                  <div className="text-center py-12 bg-navy-900/50 border border-white/5 rounded-2xl">
                    <p className="text-slate-400">No payment confirmations yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map(p => (
                      <div key={p.id} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{p.business_name}</h3>
                              <StatusBadge status={p.status} />
                            </div>
                            <p className="text-slate-400 text-sm">Email: {p.account_email}</p>
                            <p className="text-slate-400 text-sm">Method: <span className="capitalize text-slate-300">{p.payment_method}</span> · Date: {new Date(p.date_paid).toLocaleDateString()}</p>
                            {p.transaction_id && <p className="text-slate-400 text-sm">Transaction ID: {p.transaction_id}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {p.screenshot_url && (
                              <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm rounded-xl transition-all">
                                <Eye size={14} />Screenshot
                              </a>
                            )}
                            {p.status === 'pending' && (
                              <>
                                <button onClick={() => approvePayment(p)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-sm font-semibold rounded-xl transition-all">
                                  <CheckCircle size={14} />Approve
                                </button>
                                <button onClick={() => rejectPayment(p.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-semibold rounded-xl transition-all">
                                  <X size={14} />Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Businesses */}
            {tab === 'businesses' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Businesses ({businesses.length})</h2>
                <div className="space-y-3">
                  {businesses.map(b => (
                    <div key={b.id} className="flex items-center justify-between gap-4 bg-navy-900/80 border border-white/10 rounded-2xl p-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold">{b.business_name}</p>
                          <StatusBadge status={b.membership_status} />
                          {b.is_founding_member && <span className="px-2 py-0.5 bg-gold-400/10 border border-gold-400/20 rounded text-gold-400 text-xs">Premium</span>}
                        </div>
                        <p className="text-slate-400 text-sm">{b.category} · {b.city}, {b.state}</p>
                        {b.expiration_date && <p className="text-slate-500 text-xs">Expires: {new Date(b.expiration_date).toLocaleDateString()}</p>}
                      </div>
                      <button
                        onClick={() => toggleBusinessStatus(b)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${b.membership_status === 'suspended' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'}`}
                      >
                        {b.membership_status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams */}
            {tab === 'teams' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Teams ({teams.length})</h2>
                <div className="space-y-3">
                  {teams.map(t => (
                    <div key={t.id} className="flex items-center justify-between gap-4 bg-navy-900/80 border border-white/10 rounded-2xl p-5">
                      <div>
                        <p className="text-white font-semibold">{t.team_name}</p>
                        <p className="text-slate-400 text-sm">{t.sport} · {t.age_group} · {t.city}, {t.state}</p>
                        {t.athlete_count && <p className="text-slate-500 text-xs">{t.athlete_count} athletes</p>}
                      </div>
                    </div>
                  ))}
                  {teams.length === 0 && <p className="text-slate-400 text-center py-8">No teams yet.</p>}
                </div>
              </div>
            )}

            {/* Listings */}
            {tab === 'listings' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">All Listings ({listings.length})</h2>
                <div className="space-y-3">
                  {listings.map(l => (
                    <div key={l.id} className="flex items-center justify-between gap-4 bg-navy-900/80 border border-white/10 rounded-2xl p-5">
                      <div>
                        <p className="text-white font-semibold">{l.title}</p>
                        <p className="text-slate-400 text-sm">{l.listing_type} {l.sponsorship_amount ? `· $${l.sponsorship_amount.toLocaleString()}` : ''}</p>
                        <p className="text-slate-500 text-xs">{l.views} views · {l.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                      <button onClick={() => deleteListing(l.id)} className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {listings.length === 0 && <p className="text-slate-400 text-center py-8">No listings yet.</p>}
                </div>
              </div>
            )}

            {/* Stats */}
            {tab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Platform Statistics</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Businesses', value: stats.businesses, color: 'blue' },
                    { label: 'Total Teams', value: stats.teams, color: 'gold' },
                    { label: 'Total Listings', value: stats.listings, color: 'emerald' },
                    { label: 'Pending Payments', value: stats.payments, color: 'red' },
                    { label: 'Active Businesses', value: businesses.filter(b => b.membership_status === 'active').length, color: 'emerald' },
                    { label: 'Premium Members', value: businesses.filter(b => b.is_founding_member).length, color: 'gold' },
                    { label: 'Suspended', value: businesses.filter(b => b.membership_status === 'suspended').length, color: 'red' },
                    { label: 'Approved Payments', value: payments.filter(p => p.status === 'approved').length, color: 'blue' },
                  ].map((s, i) => (
                    <div key={i} className="bg-navy-900/80 border border-white/10 rounded-2xl p-6">
                      <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                      <p className="text-slate-400 text-sm">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded font-bold ${
      status === 'active' || status === 'approved' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
      status === 'pending' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
      status === 'rejected' || status === 'suspended' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
      'bg-slate-500/10 border border-slate-500/20 text-slate-400'
    }`}>{status.toUpperCase()}</span>
  );
}
