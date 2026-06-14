import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Tag, Users, CheckCircle, Building2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Listing, BusinessProfile } from '../types';

interface ListingWithBusiness extends Listing { business: BusinessProfile; }

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, teamProfile } = useAuth();
  const [listing, setListing] = useState<ListingWithBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appDescription, setAppDescription] = useState('');
  const [appReason, setAppReason] = useState('');
  const [appContact, setAppContact] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');

  useEffect(() => {
    if (id) loadListing(id);
  }, [id]);

  const loadListing = async (listingId: string) => {
    const { data } = await supabase
      .from('listings')
      .select('*, business:business_profiles(*)')
      .eq('id', listingId)
      .single();
    if (data) {
      setListing(data);
      await supabase.from('listings').update({ views: (data.views || 0) + 1 }).eq('id', listingId);
      if (user && profile?.account_type === 'team') {
        const { data: app } = await supabase.from('applications').select('id').eq('listing_id', listingId).eq('team_id', user.id).maybeSingle();
        if (app) setApplied(true);
      }
    }
    setLoading(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !teamProfile || !listing) return;
    setApplying(true);
    setError('');
    const { error } = await supabase.from('applications').insert({
      listing_id: listing.id,
      team_id: user.id,
      team_name: teamProfile.team_name,
      team_description: appDescription,
      reason: appReason,
      contact_info: appContact,
      requested_amount: requestedAmount ? parseFloat(requestedAmount) : null,
      status: 'pending',
    });
    setApplying(false);
    if (error) {
      setError(error.message);
    } else {
      setApplied(true);
      setShowForm(false);
      setSuccess('Your application has been submitted!');
      await supabase.from('notifications').insert({
        user_id: listing.business_id,
        title: 'New Application Received',
        message: `${teamProfile.team_name} applied to "${listing.title}"`,
        link: `/dashboard`,
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-white text-xl font-bold mb-4">Listing Not Found</h2>
        <Link to="/marketplace" className="text-gold-400 hover:text-gold-300">Back to Marketplace</Link>
      </div>
    </div>
  );

  const business = listing.business;
  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} />Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-semibold">{listing.listing_type}</span>
                {business?.is_founding_member && (
                  <span className="px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-lg text-gold-400 text-xs font-bold">Premium Business</span>
                )}
              </div>
              <h1 className="text-3xl font-black text-white mb-4">{listing.title}</h1>
              <p className="text-slate-300 leading-relaxed">{listing.description}</p>
            </div>

            {listing.benefits && (
              <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-bold text-lg mb-4">What You'll Receive</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{listing.benefits}</p>
              </div>
            )}

            {listing.application_requirements && (
              <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-bold text-lg mb-4">Application Requirements</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{listing.application_requirements}</p>
              </div>
            )}

            {listing.contact_info && (
              <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-bold text-lg mb-4">Contact Information</h3>
                <p className="text-slate-300">{listing.contact_info}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Card */}
            <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center">
                  {business?.logo_url ? (
                    <img src={business.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <Building2 size={24} className="text-gold-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold">{business?.business_name}</h3>
                  <p className="text-slate-400 text-sm">{business?.category}</p>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={14} className="text-gold-400" />
                  {business?.city}, {business?.state}
                </div>
                {listing.sponsorship_amount && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={14} className="text-gold-400" />
                    <span className="text-gold-400 font-bold">${listing.sponsorship_amount.toLocaleString()}</span>
                  </div>
                )}
                {listing.available_spots && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Users size={14} className="text-gold-400" />
                    {listing.available_spots} spot{listing.available_spots !== 1 ? 's' : ''} available
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Tag size={14} className="text-gold-400" />
                  {listing.listing_type}
                </div>
              </div>

              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <p className="text-emerald-400 text-sm">{success}</p>
                </div>
              )}

              {!user ? (
                <Link to="/login" className="w-full block py-3.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-center transition-all">
                  Sign In to Apply
                </Link>
              ) : profile?.account_type === 'team' ? (
                applied ? (
                  <div className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold">
                    <CheckCircle size={18} />Application Submitted
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all"
                  >
                    {showForm ? 'Cancel' : 'Apply Now'}
                  </button>
                )
              ) : profile?.account_type === 'business' ? (
                <p className="text-center text-slate-400 text-sm">Business accounts cannot apply</p>
              ) : null}
            </div>

            {/* Application Form */}
            {showForm && profile?.account_type === 'team' && !applied && (
              <form onSubmit={handleApply} className="bg-navy-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="text-white font-bold text-lg">Your Application</h3>
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <AlertCircle size={16} className="text-red-400" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Team Description *</label>
                  <textarea required value={appDescription} onChange={e => setAppDescription(e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Tell about your team..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Why You Need This Sponsorship *</label>
                  <textarea required value={appReason} onChange={e => setAppReason(e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Explain how this sponsorship would help..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Requested Amount (Optional)</label>
                  <input type="number" value={requestedAmount} onChange={e => setRequestedAmount(e.target.value)} className={inputClass} placeholder="0.00" step="0.01" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Information *</label>
                  <input required value={appContact} onChange={e => setAppContact(e.target.value)} className={inputClass} placeholder="Email or phone" />
                </div>
                <button type="submit" disabled={applying} className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
