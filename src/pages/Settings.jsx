import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  User, Bell, Lock, Shield, Eye, Globe, Save, 
  Trash2, Camera, UserCircle, Smartphone, Key, BarChart3 
} from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    title: '',
    bio: '',
    directory_visible: true,
    show_stats: true,
    email_alerts: true,
    push_notifications: false,
    two_factor_enabled: false,
    citations_count: 0, 
    h_index: 0,         
    total_downloads: 0  
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. Try to fetch the existing profile from the database
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); 
      
      if (data) {
        // If they have a profile, use it
        setProfile(prev => ({ ...prev, ...data, email: user.email }));
      } else {
        // IF NEW GOOGLE USER: Auto-fill their name from Google's data
        const fullName = user.user_metadata?.full_name || '';
        const nameParts = fullName.split(' ');
        
        setProfile(prev => ({ 
          ...prev, 
          email: user.email,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || ''
        }));
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Create a safe payload with ONLY the columns we know exist in your database
    const safeUpdatePayload = {
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      bio: profile.bio,
      title: profile.title,
      updated_at: new Date()
    };

    // 2. Send it to Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert(safeUpdatePayload);

    // 3. Check for errors and alert the user
    if (error) {
      alert("Save Failed: " + error.message);
      console.error("Supabase Error Details:", error);
    } else {
      alert("Settings successfully saved!");
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8 w-full max-w-5xl mx-auto space-y-10">
      <div className="border-b border-outline-variant pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Institutional Settings</h1>
          <p className="text-on-surface-variant font-medium opacity-70">Manage your researcher identity and platform privacy.</p>
        </div>
        <button onClick={handleSave} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-all">
          <Save size={18} className="inline mr-2" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <aside className="md:col-span-3 space-y-1">
          <SettingsTab icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SettingsTab icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SettingsTab icon={Lock} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <SettingsTab icon={Shield} label="Privacy" active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} />
          <div className="h-px bg-outline-variant/30 my-4" />
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold text-error hover:bg-error/5 transition-all text-left">
            <Trash2 size={18} /> Delete Account
          </button>
        </aside>

        <main className="md:col-span-9">
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 space-y-8 animate-in fade-in">
              <div className="flex items-center gap-8">
                <UserCircle size={80} className="text-primary bg-surface-container-low rounded-full p-2" />
                <div>
                  <h3 className="text-xl font-bold text-primary">Dr. {profile.first_name} {profile.last_name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant mb-4">{profile.title}</p>
                </div>
              </div>

              {profile.show_stats && (
                <div className="grid grid-cols-3 gap-4 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-center">
                  <div><p className="text-[10px] font-bold text-outline-variant uppercase mb-1">Citations</p><p className="text-2xl font-bold">{profile.citations_count}</p></div>
                  <div className="border-x border-outline-variant/30"><p className="text-[10px] font-bold text-outline-variant uppercase mb-1">h-index</p><p className="text-2xl font-bold">{profile.h_index}</p></div>
                  <div><p className="text-[10px] font-bold text-outline-variant uppercase mb-1">Downloads</p><p className="text-2xl font-bold">{profile.total_downloads}</p></div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <InputField label="First Name" value={profile.first_name} onChange={(v) => setProfile({...profile, first_name: v})} />
                <InputField label="Last Name" value={profile.last_name} onChange={(v) => setProfile({...profile, last_name: v})} />
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-outline-variant uppercase mb-2">Short Bio</label>
                    <textarea className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-sm" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION PREFERENCES */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 space-y-6 animate-in fade-in">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Bell size={20} /> Notification Preferences
              </h3>
              <div className="space-y-4">
                <ToggleOption icon={Bell} title="Email Alerts" desc="Get notified when someone downloads your materials." enabled={profile.email_alerts} onToggle={() => setProfile({...profile, email_alerts: !profile.email_alerts})} />
                <ToggleOption icon={Smartphone} title="Push Notifications" desc="Real-time updates on new resources in your subject." enabled={profile.push_notifications} onToggle={() => setProfile({...profile, push_notifications: !profile.push_notifications})} />
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 space-y-6 animate-in fade-in">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Lock size={20} /> Security Settings
              </h3>
              <div className="space-y-4">
                <ActionButton title="Two-Factor Authentication" desc="Add an extra layer of security to your account." actionLabel="Enable" />
                <ActionButton title="Change Password" desc="Last updated 3 months ago." actionLabel="Update" />
              </div>
            </div>
          )}

          {/* PRIVACY CONTROL */}
          {activeTab === 'privacy' && (
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 space-y-6 animate-in fade-in">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Eye size={20} /> Privacy Control
              </h3>
              <div className="space-y-4">
                <ToggleOption icon={Globe} title="Visible in Institutional Directory" desc="Allow other researchers from your university to find you." enabled={profile.directory_visible} onToggle={() => setProfile({...profile, directory_visible: !profile.directory_visible})} />
                <ToggleOption icon={BarChart3} title="Show Citation Stats" desc="Display your impact metrics on your public profile." enabled={profile.show_stats} onToggle={() => setProfile({...profile, show_stats: !profile.show_stats})} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SettingsTab = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all text-left ${active ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
    <Icon size={18} /> {label}
  </button>
);

const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-outline-variant uppercase mb-2 px-1">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
  </div>
);

const ToggleOption = ({ icon: Icon, title, desc, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary border border-outline-variant/20 shadow-sm"><Icon size={20} /></div>
      <div>
        <p className="text-sm font-bold text-on-surface leading-tight mb-1">{title}</p>
        <p className="text-[11px] font-medium text-on-surface-variant opacity-70 leading-tight">{desc}</p>
      </div>
    </div>
    <div onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${enabled ? 'bg-primary' : 'bg-outline-variant'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${enabled ? 'left-7' : 'left-1'}`}></div>
    </div>
  </div>
);

const ActionButton = ({ title, desc, actionLabel }) => (
  <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
    <div>
      <p className="text-sm font-bold text-on-surface leading-tight mb-1">{title}</p>
      <p className="text-[11px] font-medium text-on-surface-variant opacity-70 leading-tight">{desc}</p>
    </div>
    <button className="px-6 py-2 bg-surface-container-high border border-outline-variant/30 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-all">
      {actionLabel}
    </button>
  </div>
);