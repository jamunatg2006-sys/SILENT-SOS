import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  Plus, 
  QrCode, 
  Edit, 
  Trash2, 
  User, 
  Heart, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Eye, 
  FileText, 
  Activity,
  MoreHorizontal,
  Settings,
  FileDown
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get('/profiles'),
      api.get('/profiles/activity')
    ]).then(([pRes, aRes]) => {
        setProfiles(pRes.data.profiles);
        setActivity(aRes.data.logs);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await api.delete(`/profiles/${id}`);
      setProfiles(p => p.filter(x => x._id !== id));
      toast.success('Profile removed');
    } catch (err) {
      toast.error('Failed to delete profile');
    }
  };

  const criticalAllergies = (p) => p.allergies?.filter(a => a.severity === 'critical') || [];

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1">Manage your emergency profiles</p>
          </div>
          <Link to="/profiles/new" className="btn-primary flex items-center gap-2"> {/* This was already btn-primary */}
            <Plus className="w-4 h-4" /> New Profile
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 animate-fade-in">
            {[
              { label: 'Total Protected', value: profiles.length, icon: <User className="w-5 h-5" />, color: 'text-sky-600 bg-sky-50' },
              { label: 'With Critical Allergies', value: profiles.filter(p => criticalAllergies(p).length > 0).length, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50' },
              { label: 'Emergency Scans', value: activity.length, icon: <Activity className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
            ].map(s => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profiles */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" /> Protected Individuals
          </h2>
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-semibold animate-pulse flex flex-col items-center gap-2"><Activity className="w-8 h-8 animate-spin" /> Loading Profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="card p-8 md:p-16 text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No profiles yet</h3>
            <p className="text-slate-500 mb-6">Create your first emergency profile in 2 minutes</p>
            <Link to="/profiles/new" className="btn-primary inline-flex items-center gap-2"> {/* This was already btn-primary */}
              <Plus className="w-4 h-4" /> Create First Profile
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(p => (
              <div key={p._id} className="group relative bg-white border border-slate-200 rounded-[2rem] p-5 transition-all hover:shadow-xl hover:shadow-slate-200/50 animate-slide-up flex flex-col justify-between h-full">
                <div>
                  {/* Card Header & Overflow Menu */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl overflow-hidden shadow-inner border border-slate-50">
                      {p.photo ? <img src={p.photo} className="w-full h-full object-cover" alt="" /> : '🧑'}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === p._id ? null : p._id);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {activeMenu === p._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2"> {/* This was already bg-white */}
                          <Link to={`/profiles/${p._id}/edit`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"> {/* This was already slate-600 */}
                            <Settings className="w-4 h-4" /> Edit Details
                          </Link>
                          <Link to={`/emergency/${p.qrId}/handoff`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"> {/* This was already slate-600 */}
                            <FileDown className="w-4 h-4" /> Export Data
                          </Link>
                          <div className="h-px bg-slate-50 my-1 mx-2" />
                          <button 
                            onClick={() => handleDelete(p._id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Profile
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Identity Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight truncate">{p.name}</h3>
                      {p.whatsappSosEnabled && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="WhatsApp SOS Active" />}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {p.bloodGroup} · AGE {p.age}
                    </p>
                  </div>

                  {/* Condition Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.conditions?.slice(0, 2).map(c => (
                      <span key={c} className="bg-slate-50 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-slate-100 uppercase"> {/* This was already bg-slate-50 */}
                        {c}
                      </span>
                      ))}
                  </div>

                  {/* Allergy Alert */}
                  {criticalAllergies(p).length > 0 && (
                    <div className="bg-rose-50 border border-rose-100/50 rounded-2xl p-3 mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      </div>
                      <p className="text-[11px] font-bold text-rose-800 leading-tight uppercase tracking-tight">
                        Critical Allergy: {criticalAllergies(p).map(a => a.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  <Link 
                    to={`/emergency/${p.qrId}`} 
                    target="_blank" 
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-black text-xs py-3.5 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4" /> View Profile
                  </Link>
                  <Link 
                    to={`/profiles/${p._id}/qr`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-50 text-sky-600 font-black text-xs py-3.5 rounded-2xl hover:bg-sky-100 transition-all active:scale-95"
                  >
                    <QrCode className="w-4 h-4" /> QR Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Recent Activity Feed */}
        {activity.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" /> Recent Activity
            </h2>
            <div className="grid gap-3">
              {activity.map(log => (
                <div key={log._id} className="card p-4 flex items-center justify-between bg-white border-l-4 border-l-sky-400">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                      {log.profileId?.photo ? <img src={log.profileId.photo} className="w-full h-full rounded-full object-cover" /> : '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        <span className="text-sky-600">{log.profileId?.name || 'A profile'}</span>'s card was scanned
                      </p>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {log.location?.address || 'Location Access Denied'}
                        </p>
                        {log.note && (
                          <div className="bg-sky-50 text-sky-800 text-xs p-2 rounded-lg font-medium border border-sky-100 flex items-start gap-1.5 mt-1">
                            <span className="text-sky-400 font-black">“</span>
                            {log.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 text-right flex flex-col items-end gap-2">
                    <div className="text-slate-900">{new Date(log.timestamp).toLocaleDateString()}</div>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {log.location?.lat && (
                      <a href={`https://www.google.com/maps?q=${log.location.lat},${log.location.lng}`} target="_blank" rel="noreferrer"
                        className="text-[10px] bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 px-2 py-1 rounded-md transition-colors uppercase tracking-widest">
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}