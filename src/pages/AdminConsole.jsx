import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  AlertTriangle, CheckCircle, History, Flag, 
  X, ShieldAlert, UserMinus, FileX 
} from 'lucide-react';

export const AdminConsole = () => {
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchLogs();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .eq('is_reported', true);
    
    if (!error) setReports(data || []);
    setLoading(false);
  };

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAuditLogs(data);
  };

  const handleAction = async (report, actionType) => {
    // 1. OPTIMISTIC UI: Remove card from screen immediately
    setReports(prev => prev.filter(r => r.id !== report.id));

    if (actionType === 'remove') {
      // 2. Execute Database Delete
      const { error: delError } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', report.id);
      
      if (delError) {
        console.error("Delete Error:", delError.message);
        alert("Database Error: Could not delete record. " + delError.message);
        // Rollback UI if database rejected the delete
        fetchReports(); 
      } else {
        // 3. Create real Audit Log entry
        await supabase.from('audit_logs').insert([
          { 
            event: 'File Deleted', 
            target: report.title, 
            type: 'error' 
          }
        ]);
        fetchLogs();
      }
    } else {
      // Dismiss Action: Update flag in database
      const { error } = await supabase
        .from('study_materials')
        .update({ is_reported: false })
        .eq('id', report.id);
        
      if (error) fetchReports(); // Rollback if update fails
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black text-emerald-900 tracking-tighter uppercase">Moderation Hub</h2>
          <p className="text-slate-500 font-medium">Platform Integrity Management Console</p>
        </div>
        <div className="flex gap-4">
          <StatBox label="Active Reports" value={reports.length} icon={<Flag size={20}/>} />
          <StatBox label="Avg. Response" value="12m" icon={<CheckCircle size={20}/>} />
        </div>
      </div>

      {/* Moderation Queue */}
      <section className="space-y-6">
        <h3 className="text-xl font-black flex items-center gap-2 text-red-600 uppercase tracking-tight">
          <AlertTriangle /> Pending Reviews
        </h3>
        
        {loading ? (
          <div className="py-20 text-center font-bold text-slate-300 animate-pulse uppercase tracking-widest">
            Syncing Records...
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col hover:border-red-200 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-red-50 text-red-600 uppercase tracking-widest">Flagged</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">ID: {report.id.slice(0,5)}</span>
                </div>
                <h3 className="font-black text-slate-800 mb-2 truncate text-xl uppercase tracking-tight">{report.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-10 flex-grow opacity-70">
                  {report.report_reason || "Reported for community violation."}
                </p>
                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => handleAction(report, 'remove')} 
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100"
                  >
                    Remove
                  </button>
                  <button 
                    onClick={() => handleAction(report, 'dismiss')} 
                    className="flex-1 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center gap-4">
             <div className="p-6 bg-emerald-50 rounded-full text-emerald-600"><CheckCircle size={48} /></div>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Queue Empty: Integrity Optimal</p>
          </div>
        )}
      </section>

      {/* Mini Audit Log */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50 px-10">
          <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter"><History size={20}/> Audit Log</h3>
          <button 
            onClick={() => setShowHistory(true)} 
            className="px-8 py-3 bg-emerald-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-100"
          >
            View Full History
          </button>
        </div>
        <table className="w-full text-left">
          <tbody>
            {auditLogs.slice(0, 3).map(log => (
              <tr key={log.id} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors font-medium">
                <td className={`px-10 py-6 text-sm font-black uppercase tracking-tight ${log.type === 'error' ? 'text-red-500' : 'text-emerald-700'}`}>
                  {log.event}
                </td>
                <td className="px-10 py-6 text-sm text-slate-400 italic font-bold">{log.target}</td>
                <td className="px-10 py-6 text-right text-[10px] font-black text-slate-200 uppercase tracking-widest">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowHistory(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter flex items-center gap-2"><History /> System History</h3>
              <button onClick={() => setShowHistory(false)} className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-all"><X size={20}/></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-8 space-y-4">
              {auditLogs.length > 0 ? auditLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-2xl ${log.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {log.type === 'error' ? <FileX size={20}/> : <CheckCircle size={20}/>}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{log.event}</p>
                      <p className="text-xs text-slate-400 font-bold italic">{log.target}</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-300 font-bold uppercase tracking-widest">No logs recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, icon }) => (
  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 min-w-[200px]">
    <div className="text-emerald-700 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
      <h4 className="text-3xl font-black text-emerald-900">{value}</h4>
    </div>
  </div>
);