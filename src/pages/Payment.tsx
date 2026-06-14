import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ExternalLink, Upload, AlertCircle, DollarSign, CreditCard, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type PaymentMethod = 'paypal' | 'cashapp';

const BENEFITS = [
  'Marketplace Visibility — Your listings appear publicly to all teams',
  'Unlimited Sponsorship Listings — Post as many listings as you need',
  'Team Application Management — Accept, decline, or save applications',
  'Analytics Dashboard — Track profile views, listing views, and applications',
  'Priority Placement — Active members receive priority in search results',
  'Direct Team Connections — Communicate with teams directly',
];

export default function Payment() {
  const { user, businessProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPremium = searchParams.get('plan') === 'premium';
  const planPrice = isPremium ? 30 : 20;
  const planLabel = isPremium ? 'Premium Membership' : 'Business Membership';
  const [method, setMethod] = useState<PaymentMethod>('paypal');
  const [step, setStep] = useState<'choose' | 'confirm'>('choose');
  const [businessName, setBusinessName] = useState(businessProfile?.business_name || '');
  const [accountEmail, setAccountEmail] = useState('');
  const [datePaid, setDatePaid] = useState(new Date().toISOString().split('T')[0]);
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    setError('');

    let screenshotUrl: string | null = null;

    if (screenshotFile) {
      const ext = screenshotFile.name.split('.').pop();
      const path = `payment-screenshots/${user.id}-${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from('uploads')
        .upload(path, screenshotFile, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
        screenshotUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('payment_confirmations').insert({
      business_id: user.id,
      business_name: businessName,
      account_email: accountEmail,
      payment_method: method,
      date_paid: datePaid,
      transaction_id: transactionId || null,
      screenshot_url: screenshotUrl,
      status: 'pending',
      plan_type: isPremium ? 'premium' : 'standard',
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Payment Submitted!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your payment confirmation has been submitted and is pending admin review. Your account will be activated within 24 hours of verification.
          </p>
          <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-6 mb-6 text-left">
            <h4 className="text-white font-semibold mb-3">What happens next?</h4>
            <ol className="space-y-2">
              {['Admin reviews your payment confirmation', 'Your membership is activated (within 24 hours)', 'Your listings become visible in the marketplace', 'Teams start applying to your opportunities'].map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                  <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Membership</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Activate Your Business</h1>
          <p className="text-slate-400 text-lg">Join the marketplace for just <span className="text-gold-400 font-semibold">${planPrice}/month</span> and start connecting with local teams</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8 sticky top-24">
              {isPremium && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gold-400/10 border border-gold-400/20 rounded-xl">
                  <Star size={14} className="text-gold-400" fill="currentColor" />
                  <span className="text-gold-400 text-xs font-bold uppercase tracking-wide">Premium Plan Selected</span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-white mb-1">${planPrice}</div>
                <div className="text-slate-400 text-sm">per month · 30-day access</div>
              </div>
              <div className="space-y-3 mb-6">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300 text-sm">{b}</p>
                  </div>
                ))}
              </div>
              {isPremium && (
                <div className="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
                  <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">Premium Member Benefits</p>
                  <p className="text-slate-400 text-xs">Includes Premium Badge, priority placement, featured homepage placement, and dedicated recognition page.</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-3">
            {step === 'choose' && (
              <div className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h2 className="text-white font-bold text-xl mb-6">Choose Payment Method</h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setMethod('paypal')}
                    className={`p-6 rounded-2xl border-2 text-center transition-all ${method === 'paypal' ? 'border-gold-400 bg-gold-400/10' : 'border-white/10 hover:border-white/20 bg-navy-950/50'}`}
                  >
                    {method === 'paypal' && <CheckCircle size={18} className="text-gold-400 mx-auto mb-2" />}
                    <DollarSign size={32} className={`mx-auto mb-2 ${method === 'paypal' ? 'text-gold-400' : 'text-blue-400'}`} />
                    <p className="text-white font-bold">PayPal</p>
                    <p className="text-slate-400 text-xs mt-1">paypal.me/gsadvertising</p>
                  </button>
                  <button
                    onClick={() => setMethod('cashapp')}
                    className={`p-6 rounded-2xl border-2 text-center transition-all ${method === 'cashapp' ? 'border-gold-400 bg-gold-400/10' : 'border-white/10 hover:border-white/20 bg-navy-950/50'}`}
                  >
                    {method === 'cashapp' && <CheckCircle size={18} className="text-gold-400 mx-auto mb-2" />}
                    <CreditCard size={32} className={`mx-auto mb-2 ${method === 'cashapp' ? 'text-gold-400' : 'text-emerald-400'}`} />
                    <p className="text-white font-bold">Cash App</p>
                    <p className="text-slate-400 text-xs mt-1">$GSAdvCon</p>
                  </button>
                </div>

                {method === 'paypal' ? (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3">Pay via PayPal</h3>
                    <p className="text-slate-400 text-sm mb-4">Send ${planPrice}.00 to our PayPal account. Make sure to include your business name in the notes.</p>
                    <a
                      href={`https://paypal.me/gsadvertising/${planPrice}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 font-bold rounded-xl transition-all"
                    >
                      <DollarSign size={18} />
                      Send ${planPrice} via PayPal
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3">Pay via Cash App</h3>
                    <p className="text-slate-400 text-sm mb-4">Send <span className="text-emerald-400 font-semibold">${planPrice}.00</span> to <span className="text-emerald-400 font-semibold">$GSAdvCon</span>. Include your business name in the note.</p>
                    <a
                      href="https://cash.app/$GSAdvCon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 font-bold rounded-xl transition-all"
                    >
                      <CreditCard size={18} />
                      Send ${planPrice} via Cash App
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                <button
                  onClick={() => setStep('confirm')}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl transition-all"
                >
                  I've Sent Payment — Continue
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <form onSubmit={handleSubmit} className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h2 className="text-white font-bold text-xl mb-2">Confirm Your Payment</h2>
                <p className="text-slate-400 text-sm mb-6">Fill in the details below and our team will verify and activate your account.</p>

                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm">
                    <AlertCircle size={15} />{error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Business Name *</label>
                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} required className={inputClass} placeholder="Your business name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Email *</label>
                    <input type="email" value={accountEmail} onChange={e => setAccountEmail(e.target.value)} required className={inputClass} placeholder="Email associated with your GS account" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Payment Method</label>
                      <div className="px-4 py-3 bg-navy-950/80 border border-white/10 rounded-xl text-slate-300 text-sm capitalize">{method}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Date Paid *</label>
                      <input type="date" value={datePaid} onChange={e => setDatePaid(e.target.value)} required className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Transaction ID (Optional)</label>
                    <input value={transactionId} onChange={e => setTransactionId(e.target.value)} className={inputClass} placeholder="PayPal/CashApp transaction ID" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Payment Screenshot (Optional)</label>
                    <label className="flex items-center gap-3 px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-colors">
                      <Upload size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-400">{screenshotFile ? screenshotFile.name : 'Upload screenshot...'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setScreenshotFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep('choose')} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all">
                    {loading ? 'Submitting...' : 'Submit Confirmation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
