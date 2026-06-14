import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TeamProfile } from '../types';

const SPORTS = ['All', 'Baseball', 'Basketball', 'Cheer', 'Football', 'Golf', 'Hockey', 'Lacrosse', 'Soccer', 'Softball', 'Swimming', 'Tennis', 'Track & Field', 'Volleyball', 'Wrestling', 'Other'];

export default function Teams() {
  const [teams, setTeams] = useState<TeamProfile[]>([]);
  const [filtered, setFiltered] = useState<TeamProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('All');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('team_profiles').select('*').order('created_at', { ascending: false });
      if (data) { setTeams(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...teams];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t => t.team_name.toLowerCase().includes(s) || t.bio?.toLowerCase().includes(s));
    }
    if (sport !== 'All') result = result.filter(t => t.sport === sport);
    if (location) {
      const loc = location.toLowerCase();
      result = result.filter(t => t.city?.toLowerCase().includes(loc) || t.state?.toLowerCase().includes(loc));
    }
    setFiltered(result);
  }, [teams, search, sport, location]);

  return (
    <div className="min-h-screen bg-navy-950 pt-20">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Team Directory</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Youth & High School Teams</h1>
          <p className="text-slate-400 text-lg mb-8">Discover the teams looking for sponsorship support in your community.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-navy-900/80 border border-white/10 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm" placeholder="Search teams..." />
            </div>
            <select value={sport} onChange={e => setSport(e.target.value)} className="px-4 py-3 bg-navy-900/80 border border-white/10 rounded-xl text-white text-sm outline-none min-w-36">
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <input value={location} onChange={e => setLocation(e.target.value)} className="px-4 py-3 bg-navy-900/80 border border-white/10 focus:border-gold-400/50 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm" placeholder="City or State" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="bg-navy-900/50 border border-white/5 rounded-3xl h-40 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Trophy size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No Teams Found</h3>
            <p className="text-slate-400 mb-6">Be the first to register your team!</p>
            <Link to="/register?type=team" className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-sm inline-block">Register Your Team</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(team => (
              <div key={team.id} className="group bg-navy-900/80 border border-white/10 hover:border-gold-400/30 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Trophy size={24} className="text-gold-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-gold-100 transition-colors">{team.team_name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gold-400/10 border border-gold-400/20 rounded text-gold-400 text-xs">{team.sport}</span>
                      {team.age_group && <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400 text-xs">{team.age_group}</span>}
                    </div>
                  </div>
                </div>

                {(team.city || team.state) && (
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin size={13} />{team.city}, {team.state}
                  </div>
                )}

                {team.athlete_count && (
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <Users size={13} />{team.athlete_count} athletes
                  </div>
                )}

                {team.bio && (
                  <p className="text-slate-400 text-sm line-clamp-2">{team.bio}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
