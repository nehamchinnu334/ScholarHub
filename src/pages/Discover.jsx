import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Search, Download, Trash2, Loader2, Star, AlertCircle, School, Flag } from 'lucide-react';

export const Discover = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setResources(data || []);
    setLoading(false);
  };

  // ACTION: Increase Download Count
  const handleDownload = async (resource) => {
    window.open(resource.file_url, '_blank');
    if (resource.user_id) {
      const { data: profile } = await supabase.from('profiles').select('total_downloads').eq('id', resource.user_id).single();
      await supabase.from('profiles').update({ total_downloads: (profile?.total_downloads || 0) + 1 }).eq('id', resource.user_id);
    }
  };

  // ACTION: Continuous Milestone Logic (Crash-Proof Version)
  const handleCite = async (resource) => {
    if (!resource.user_id) {
      alert("Error: This file doesn't have an owner linked to it.");
      return;
    }

    // 1. Fetch current citations safely using .maybeSingle() instead of .single()
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('citations_count')
      .eq('id', resource.user_id)
      .maybeSingle(); 
      
    if (fetchError) {
      console.error("Fetch Error:", fetchError.message);
      return;
    }
    
    const newCites = (profile?.citations_count || 0) + 1;
    const newHIndex = Math.floor(newCites / 50);

    // 2. Use UPSERT: This updates the profile, OR creates it if it's missing!
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ 
        id: resource.user_id,
        citations_count: newCites,
        h_index: newHIndex 
      });
    
    if (updateError) {
      alert("Database Permission Error: " + updateError.message);
    } else {
      alert(`Success! Work cited. Total citations: ${newCites}`);
    }
  };

  // ACTION: Report a resource to the Admin Console
  const handleReport = async (resourceId) => {
    // 1. Ask for confirmation so users don't accidentally click it
    const confirmReport = window.confirm("Are you sure you want to report this material to the moderation team?");
    if (!confirmReport) return;

    // 2. Update the database
    const { error } = await supabase
      .from('study_materials')
      .update({ is_reported: true })
      .eq('id', resourceId);

    if (error) {
      alert("Permission Error: " + error.message);
    } else {
      alert("Material successfully reported. The moderation team will review it.");
    }
  };

  // ACTION: Delete File (Objective #5)
  const handleDelete = async (id) => {
    if (window.confirm("Admin: Permanently delete this resource?")) {
      const { error } = await supabase.from('study_materials').delete().eq('id', id);
      if (!error) setResources(prev => prev.filter(res => res.id !== id));
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'All' || res.subject === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <section className="bg-emerald-900 py-20 px-margin text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Knowledge Discovery</h1>
        <div className="max-w-2xl mx-auto bg-white p-1.5 rounded-2xl flex items-center shadow-2xl">
          <Search className="ml-4 text-slate-300" size={24} />
          <input 
            className="w-full p-4 outline-none text-slate-800 font-medium" 
            placeholder="Search by subject, title, or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-margin py-12 w-full">
        <div className="flex gap-3 overflow-x-auto mb-12 pb-2 scrollbar-hide">
          {['All', 'Biology', 'Finance', 'Math', 'Physics', 'Engineering'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`${selectedCategory === cat ? 'bg-emerald-800 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} px-8 py-3 rounded-xl font-bold transition-all whitespace-nowrap`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-emerald-800" size={48}/>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredResources.map((res) => (
              <div key={res.id} className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{res.subject}</span>
                  <button onClick={() => handleDelete(res.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={18} /></button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight uppercase tracking-tight">{res.title}</h3>
                <p className="text-sm text-slate-500 mb-10 line-clamp-3 leading-relaxed">{res.description}</p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex gap-3">
                    <button onClick={() => handleCite(res)} className="bg-amber-50 text-amber-600 p-3 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm" title="Cite Work"><Star size={20} /></button>
                    <button onClick={() => handleDownload(res)} className="bg-emerald-800 text-white p-3 rounded-2xl hover:bg-emerald-900 transition-all shadow-sm" title="Download"><Download size={20} /></button>
                  </div>
                  
                  {/* ADDED: Report Flag Button next to School Icon */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleReport(res.id)} 
                      className="text-slate-300 hover:text-red-500 transition-colors p-2" 
                      title="Report Material"
                    >
                      <Flag size={20} />
                    </button>
                    <School size={20} className="text-slate-200" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};