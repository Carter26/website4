import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, Settings, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Notification } from '../../types';

export default function Navbar() {
  const { user, profile, businessProfile, teamProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setUserMenuOpen(false);
  };

  const displayName = businessProfile?.business_name || teamProfile?.team_name || profile?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-black text-navy-950 text-lg shadow-lg shadow-gold-500/30 group-hover:shadow-gold-500/50 transition-shadow">
              GS
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">GS Advertising</div>
              <div className="text-gold-400 text-xs font-medium tracking-wider">& CONNECTIONS</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-gold-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 rounded-full text-navy-950 text-xs font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-navy-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <span className="text-white font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-gold-400 text-xs hover:text-gold-300">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-400 text-sm">No notifications yet</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer ${!n.is_read ? 'bg-gold-400/5' : ''}`}>
                              <div className="flex items-start gap-2">
                                {!n.is_read && <div className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />}
                                <div className={!n.is_read ? '' : 'pl-4'}>
                                  <p className="text-white text-sm font-medium">{n.title}</p>
                                  <p className="text-slate-400 text-xs mt-0.5">{n.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold text-sm">
                      {avatarLetter}
                    </div>
                    <span className="hidden sm:block text-white text-sm font-medium max-w-24 truncate">{displayName}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-navy-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                        <p className="text-slate-400 text-xs mt-0.5 capitalize">{profile?.account_type} Account</p>
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-all">
                          <LayoutDashboard size={16} />Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-all">
                          <User size={16} />Profile
                        </Link>
                        <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-all">
                          <Settings size={16} />Settings
                        </Link>
                        {profile?.account_type === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gold-400 hover:text-gold-300 hover:bg-gold-400/5 text-sm transition-all">
                            <Settings size={16} />Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/10 py-1">
                        <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/5 text-sm transition-all w-full">
                          <LogOut size={16} />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20 hover:shadow-gold-400/30">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-navy-950/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-gold-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 space-y-2 border-t border-white/10">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 text-center">Log In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold bg-gold-500 text-navy-950 text-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
