import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FAQS = [
  { q: 'How do I activate my business listing?', a: 'After registering a business account, go to the Payment page, send $20 via PayPal or Cash App, and submit your confirmation. Our team will activate your account within 24 hours.' },
  { q: 'Is there a cost for teams to join?', a: 'No! Team accounts are completely free. Teams can browse opportunities, save listings, and apply to sponsorships at no cost.' },
  { q: 'How long does a business subscription last?', a: 'Each subscription lasts 30 days from the activation date. You can renew at any time to keep your listings visible in the marketplace.' },
  { q: 'What happens when my subscription expires?', a: 'Your listings become hidden from the marketplace, but they are NOT deleted. Upon renewal, all your listings automatically reappear. Your profile and analytics data remain intact.' },
  { q: 'What is the Premium Membership?', a: 'Premium Membership ($30/month) includes everything in the standard plan plus a Premium Member Badge, priority marketplace placement, featured homepage placement, and a dedicated recognition page.' },
  { q: 'How are payments processed?', a: 'We accept PayPal (paypal.me/gsadvertising) and Cash App ($GSAdvCon). After sending payment, submit a confirmation form with your details. Our admin team manually verifies and activates accounts.' },
  { q: 'Can a business have multiple listings?', a: 'Yes! Active business subscribers can create unlimited sponsorship listings. Each listing can target different team types, sports, or age groups.' },
  { q: 'How do teams apply for sponsorships?', a: "Teams browse the marketplace, find opportunities that fit, and click 'Apply.' They fill out a short application form describing their team and why they need the sponsorship. Businesses can then accept or decline." },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  const inputClass = "w-full px-4 py-3 bg-navy-950/80 border border-white/10 hover:border-white/20 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have questions about GS Advertising & Connections? We're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-white font-bold text-xl mb-6">Contact Information</h2>
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'gsadvertisingandconnections@gmail.com', href: 'mailto:gsadvertisingandconnections@gmail.com' },
                { icon: Phone, label: 'Support', value: 'Use the contact form', href: null },
                { icon: MapPin, label: 'Location', value: 'Serving communities nationwide', href: null },
                { icon: Clock, label: 'Response Time', value: 'Within 24–48 hours', href: null },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-navy-900/50 border border-white/10 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white text-sm font-medium hover:text-gold-400 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
              <h3 className="text-gold-400 font-bold mb-2">Payment Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                For payment inquiries, submit your confirmation via the payment page after sending funds to:
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-white text-sm font-medium">PayPal: paypal.me/gsadvertising</p>
                <p className="text-white text-sm font-medium">Cash App: $GSAdvCon</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {success ? (
              <div className="text-center py-16 bg-navy-900/50 border border-white/5 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-slate-400">We'll get back to you within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-navy-900/80 border border-white/10 rounded-3xl p-8">
                <h2 className="text-white font-bold text-xl mb-6">Send a Message</h2>
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm">
                    <AlertCircle size={15} />{error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="What's this about?" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Message *</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required className={`${inputClass} h-32 resize-none`} placeholder="Tell us how we can help..." />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 font-bold rounded-xl transition-all">
                  {loading ? 'Sending...' : <><Send size={18} />Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Have Questions?</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-navy-900/80 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gold-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
