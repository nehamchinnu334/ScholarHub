import { useState, useEffect } from 'react';
import { Bell, User, School, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../supabase';

export const Navbar = ({ currentPage, onPageChange, onLogout }) => {
  const [reportCount, setReportCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [navName, setNavName] = useState('Loading...'); // Added state for the dynamic name

  useEffect(() => {
    // 1. Fetch Report Count Logic
    const fetchReportCount = async () => {
      const { count, error } = await supabase
        .from('study_materials')
        .select('*', { count: 'exact', head: true })
        .eq('is_reported', true);
      
      if (!error) setReportCount(count || 0);
    };

    // 2. Fetch User Profile Logic
    const fetchNavProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data && data.first_name) {
          // If they have a saved profile name
          setNavName(`Dr. ${data.first_name} ${data.last_name}`);
        } else if (user.user_metadata?.full_name) {
          // Fallback to Google Auth name if profile isn't saved yet
          setNavName(`Dr. ${user.user_metadata.full_name.split(' ')[0]}`);
        } else {
          // Absolute fallback
           setNavName('Dr. Scholar');
        }
      }
    };

    fetchReportCount();
    fetchNavProfile(); // Call the new function

    // Listen for changes so the bell updates instantly if you delete something
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_materials' }, () => {
        fetchReportCount();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-16 border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-margin h-full flex justify-between items-center">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onPageChange('discover')}>
            <School className="text-primary w-8 h-8" />
            <span className="font-display text-xl font-bold text-primary tracking-tight">ScholarHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['discover', 'my-materials', 'upload'].map((id) => (
              <button key={id} onClick={() => onPageChange(id)} className={`text-sm font-bold capitalize ${currentPage === id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                {id.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* THE DYNAMIC BELL ICON */}
          <button onClick={() => onPageChange('admin-console')} className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
            <Bell size={22} />
            {reportCount > 0 && (
              <span className="absolute top-1 right-1 bg-error text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-surface animate-pulse">
                {reportCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1 pr-3 border border-outline-variant/30 rounded-full hover:bg-surface-container-low">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><User size={18} /></div>
              {/* REPLACED "Dr. Vance" WITH DYNAMIC NAVNAME */}
              <span className="text-sm font-bold hidden sm:block">{navName}</span>
            </button>
            {showProfile && (
              <div className="absolute top-12 right-0 w-48 bg-surface border border-outline-variant rounded-xl shadow-xl py-1 z-50">
                <button onClick={() => {onPageChange('settings'); setShowProfile(false);}} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-surface-container-high"><SettingsIcon size={16}/> Settings</button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm font-bold text-error flex items-center gap-2 hover:bg-error/5"><LogOut size={16}/> Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};