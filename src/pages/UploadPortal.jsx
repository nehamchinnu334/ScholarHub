import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Upload, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const UploadPortal = () => {
  // Form State
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biology');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('PDF');
  const [linkUrl, setLinkUrl] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // 1. Get current user ID (Required for My Materials)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to share resources.");
      }

      let finalUrl = linkUrl;

      // 2. Handle File Upload (Objective #2)
      if (type !== 'Link' && file) {
        // Create a unique filename to avoid overwriting
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to the 'resources' bucket
        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL to save in the database
        const { data } = supabase.storage.from('resources').getPublicUrl(filePath);
        finalUrl = data.publicUrl;
      }

      // 3. Save metadata to Database (Objective #2)
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert([
          { 
            title, 
            subject, 
            description, 
            type, 
            file_url: finalUrl,
            user_id: user.id // Links this file to your Personal Library
          }
        ]);

      if (dbError) throw dbError;

      // 4. Success handling
      setStatus({ type: 'success', msg: 'Resource shared successfully with the class!' });
      
      // Reset form fields
      setFile(null);
      setTitle('');
      setDescription('');
      setLinkUrl('');
      
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-sm">
        <div className="mb-8 border-b border-outline-variant/20 pb-6">
          <h1 className="text-2xl font-black text-primary mb-2 tracking-tight">Upload Study Resource</h1>
          <p className="text-on-surface-variant opacity-70 text-sm">
            Objective: Share notes, PDFs, or external research links with other students.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Status Message Display */}
          {status.msg && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              status.type === 'success' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-error/5 border-error/20 text-error'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-bold">{status.msg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">Resource Title</label>
              <input 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Quantum Mechanics Notes"
                className="w-full px-4 h-12 bg-surface border border-outline-variant/60 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            {/* Subject Selector (Objective #4 compatibility) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">Subject</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 h-12 bg-surface border border-outline-variant/60 rounded-xl outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option>Biology</option>
                <option>Finance</option>
                <option>Math</option>
                <option>Physics</option>
              </select>
            </div>
          </div>

          {/* Type Toggle */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">Resource Type</label>
            <div className="flex gap-4">
              {['PDF', 'Note', 'Link'].map((t) => (
                <button 
                  key={t} 
                  type="button" 
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    type === t 
                      ? 'bg-primary text-on-primary border-primary shadow-md' 
                      : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t === 'Link' ? <LinkIcon size={16} /> : <FileText size={16} />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Input: File vs Link */}
          {type === 'Link' ? (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">URL Address</label>
              <input 
                required 
                type="url"
                value={linkUrl} 
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://university-archive.com/document"
                className="w-full px-4 h-12 bg-surface border border-outline-variant/60 rounded-xl outline-none focus:border-primary transition-all"
              />
            </div>
          ) : (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">Select Document</label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-outline-variant/60 rounded-2xl cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group">
                <Upload className="text-outline mb-2 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold text-outline group-hover:text-primary">
                  {file ? file.name : 'Drop your PDF or Note here'}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-outline px-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows="3" 
              className="w-full p-4 bg-surface border border-outline-variant/60 rounded-xl outline-none focus:border-primary transition-all"
              placeholder="What should other students know about this resource?"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-black tracking-tight hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Publish Resource'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};