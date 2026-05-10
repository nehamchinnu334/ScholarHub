import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Search, MoreVertical, FileText, Globe, Lock, Trash2 } from 'lucide-react';

export const MyMaterials = () => {
  const [myResources, setMyResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    setLoading(true);
    // 1. Get the current logged-in user's ID
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. Fetch only materials where user_id matches the current user
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('user_id', user.id) // Filter logic
        .order('created_at', { ascending: false });

      if (!error) setMyResources(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource forever?")) return;

    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', id);

    if (!error) {
      setMyResources(myResources.filter(r => r.id !== id));
    }
  };

  const filtered = myResources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-primary">Personal Library</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/60 rounded-lg outline-none text-sm"
            placeholder="Search my materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
              <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-outline">Resource Name</th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-outline">Subject</th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-outline">Type</th>
              <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-outline">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-outline font-bold">Syncing your library...</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary-container/20 rounded-lg text-primary">
                      <FileText size={20} />
                    </div>
                    <span className="font-bold text-on-surface text-sm">{item.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-black uppercase text-outline">
                    {item.subject}
                  </span>
                </td>
                <td className="p-4 text-xs font-medium text-on-surface-variant">
                  {item.type}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="p-20 text-center text-outline">
            Your personal library is empty. Upload something to see it here!
          </div>
        )}
      </div>
    </div>
  );
};