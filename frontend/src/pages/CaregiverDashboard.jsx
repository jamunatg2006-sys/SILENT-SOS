import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area 
} from 'recharts';
import { 
  Home, Bell, Users, Music, BarChart3, Settings as SettingsIcon, ShieldCheck, 
  LogOut, Plus, Moon, Sun, QrCode, AlertTriangle, Zap, Activity, 
  CheckCircle2, Clock, MapPin, Languages, Eye, Search, Filter, 
  ChevronUp, ChevronDown, MessageCircle, Camera, Mic, Volume2, X,
  Play, Trash2, TrendingUp, Download, Square, Circle 
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SCAN_DATA = [
  { day: 'Mon', scans: 12 }, { day: 'Tue', scans: 18 }, { day: 'Wed', scans: 15 },
  { day: 'Thu', scans: 25 }, { day: 'Fri', scans: 32 }, { day: 'Sat', scans: 28 }, { day: 'Sun', scans: 47 }
];

const LANG_DATA = [
  { name: 'Hindi', value: 40, color: '#0ea5e9' },
  { name: 'Kannada', value: 25, color: '#10b981' },
  { name: 'Tamil', value: 20, color: '#f43f5e' },
  { name: 'Telugu', value: 10, color: '#f59e0b' },
  { name: 'English', value: 5, color: '#6366f1' }
];

const HOUR_DATA = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}h`,
  incidents: i === 4 || i === 9 ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 5)
}));

// Tailwind Color Mapping moved to top level to prevent ReferenceErrors in sub-components
const COLOR_MAP = {
  sky: { bg: 'bg-sky-500', bgLight: 'bg-sky-500/10', text: 'text-sky-500', shadow: 'shadow-sky-500/20' },
  amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-500/10', text: 'text-amber-500', shadow: 'shadow-amber-500/20' },
  indigo: { bg: 'bg-indigo-500', bgLight: 'bg-indigo-500/10', text: 'text-indigo-500', shadow: 'shadow-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10', text: 'text-emerald-500', shadow: 'shadow-emerald-500/20' },
  rose: { bg: 'bg-rose-500', bgLight: 'bg-rose-500/10', text: 'text-rose-500', shadow: 'shadow-rose-500/20' },
  violet: { bg: 'bg-violet-500', bgLight: 'bg-violet-500/10', text: 'text-violet-500', shadow: 'shadow-violet-500/20' },
  slate: { bg: 'bg-slate-500', bgLight: 'bg-slate-500/10', text: 'text-slate-500', shadow: 'shadow-slate-500/20' }
};

export default function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [showResolvedFlash, setShowResolvedFlash] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          api.get('/profiles'),
          api.get('/profiles/activity')
        ]);
        
        const processedPatients = pRes.data.profiles.map(p => {
          const fields = [
            p.name, p.age, p.bloodGroup, p.preferredLanguage, 
            p.conditions?.length, p.allergies?.length, p.medications?.length,
            p.emergencyContacts?.length, p.calmTriggers?.length, p.avoidTriggers?.length,
            p.communicationNotes
          ];
          const progress = Math.round((fields.filter(Boolean).length / fields.length) * 100);
          
          return { ...p, id: p._id, progress };
        });

        const processedIncidents = aRes.data.logs.map(log => ({
          id: log._id,
          patient: log.profileId?.name || 'Unknown Patient',
          location: log.location?.address || 'Unknown Location',
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: log.status || 'Open', // Now displays the actual status sent by the responder
          lang: 'English',
          observation: log.note || 'No observation provided',
          coords: log.location?.lat ? `${log.location.lat.toFixed(4)}, ${log.location.lng.toFixed(4)}` : 'N/A',
          timeline: ['Scanned']
        }));

        setPatients(processedPatients);
        setIncidents(processedIncidents);
      } catch (err) {
        toast.error('Failed to load real-time data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); // Auto-sync every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'Resolved' } : inc));
    setShowResolvedFlash(true);
    setTimeout(() => setShowResolvedFlash(false), 1000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 text-sky-500 animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Syncing with emergency network...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-sky-50 text-slate-900 antialiased">
      {/* Dashboard Assets & Animations */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-slide {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
      {/* Satisfaction Flash */}
      {showResolvedFlash && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/20 backdrop-blur-sm pointer-events-none animate-pulse flex items-center justify-center">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl font-black text-2xl flex items-center gap-4">
            <CheckCircle2 className="w-10 h-10" /> INCIDENT RESOLVED
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-500 border-r bg-white border-slate-200 backdrop-blur-xl ${
          isSidebarExpanded ? 'w-64' : 'w-[78px]'
        } flex flex-col py-6 hidden md:flex overflow-hidden`}
      >
        <div className={`mb-10 flex items-center gap-3 px-6 transition-all ${!isSidebarExpanded && 'justify-center px-0'}`}>
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          {isSidebarExpanded && <span className="font-black text-xl tracking-tighter animate-in fade-in duration-500">SilentSOS</span>}
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full px-3">
          {[
            { id: 'Overview', icon: Home },
            { id: 'Incidents', icon: Bell },
            { id: 'Profiles', icon: Users },
            { id: 'Calm Kit', icon: Music },
            { id: 'Analytics', icon: BarChart3 },
            { id: 'Settings', icon: SettingsIcon },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all w-full ${
                activeTab === item.id 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                  : 'text-slate-400 hover:bg-sky-50 hover:text-sky-600'
              } ${!isSidebarExpanded && 'justify-center px-0'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarExpanded && <span className="font-bold text-sm whitespace-nowrap">{item.id}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-6 w-full px-3">
          <div className="flex items-center gap-3 w-full p-2 rounded-2xl bg-slate-100">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            {isSidebarExpanded && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate leading-none">{user?.name || 'Caretaker'}</p>
                <p className="text-[10px] text-slate-500 truncate">Caregiver</p>
              </div>
            )}
            {isSidebarExpanded && <LogOut onClick={() => logout()} className="w-4 h-4 text-slate-400 cursor-pointer hover:text-rose-500" />}
          </div>
        </div>
      </aside>

      {/* MOBILE TAB BAR */}
      <nav className="fixed bottom-0 left-0 w-full h-16 md:hidden flex items-center justify-around z-50 border-t bg-white border-slate-200 backdrop-blur-xl px-2">
        {['Overview', 'Incidents', 'Profiles', 'Calm Kit', 'Analytics', 'Settings'].map(id => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === id ? 'text-sky-500' : 'text-slate-400'}`}
          >
            <i className={`ti ti-${id === 'Overview' ? 'home' : id === 'Incidents' ? 'bell' : id === 'Profiles' ? 'users' : id === 'Calm Kit' ? 'music' : id === 'Analytics' ? 'chart-bar' : 'settings'} text-xl`}></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">{id}</span>
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-500 p-4 md:p-10 pb-24 md:pb-10 max-w-7xl mx-auto w-full ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-[78px]'}`}>
        
        {/* TOPBAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="animate-fade-slide">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
              Welcome back, <span className="text-sky-500">{user?.name?.split(' ')[0] || 'Caretaker'}</span> 👋
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 font-bold text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Shortcut: <span className="text-sky-500">N</span> New Profile
            </div>
            <button onClick={() => navigate('/profiles/new')} className="bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-sky-500/20 flex items-center gap-2 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Emergency Contact</span>
            </button>
          </div>
        </header>

        {/* SECTION ROUTING */}
        {activeTab === 'Overview' && <Overview patients={patients} incidents={incidents} resolve={resolveIncident} />} {/* Removed isDarkMode prop */}
        {activeTab === 'Incidents' && <IncidentHistory incidents={incidents} resolve={resolveIncident} />}
        {activeTab === 'Profiles' && <ProfilesGrid patients={patients} openModal={() => navigate('/profiles/new')} />}
        {activeTab === 'Calm Kit' && <CalmKit patients={patients} />}
        {activeTab === 'Analytics' && <Analytics />}
        {activeTab === 'Settings' && <Settings />}

      </main>

      {/* ADD PATIENT MODAL (using isPatientModalOpen for clarity) */}
      {isPatientModalOpen && <AddPatientModal close={() => setIsPatientModalOpen(false)} />}
    </div>
  );
}

/** 
 * 1. OVERVIEW SECTION 
 */
function Overview({ patients, incidents, resolve }) {
  const activeCount = incidents.filter(inc => inc.status === 'Open').length;
  const resolvedCount = incidents.filter(inc => inc.status === 'Resolved').length;
  const hasActiveAlerts = activeCount > 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', val: incidents.length.toString(), icon: QrCode, color: 'sky' },
          { 
            label: 'Active Alerts', 
            val: activeCount.toString().padStart(2, '0'), 
            subtext: `${activeCount} open · ${resolvedCount} resolved`,
            icon: AlertTriangle, color: 'amber', highlight: hasActiveAlerts 
          },
          { label: 'Saved Profiles', val: patients.length.toString().padStart(2, '0'), icon: Users, color: 'indigo' },
          { label: 'Avg Response', val: '1m 12s', icon: Zap, color: 'emerald' },
        ].map((card, i) => (
          <div 
              key={i}
              className={`bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between group hover:-translate-y-1 transition-all ${
              card.highlight ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 border-none' : 'shadow-sm'
            }`}
          >
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${card.highlight ? 'text-amber-100' : 'text-slate-400'}`}>
                {card.label}
              </p>
              <h3 className="text-4xl font-black tracking-tighter leading-none">{card.val}</h3>
              {card.subtext && (
                <p className={`text-[10px] font-bold mt-2 ${card.highlight ? 'text-white/90' : 'text-slate-400'}`}>
                  {card.subtext}
                </p>
              )}
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              card.highlight ? 'bg-white/20' : `${COLOR_MAP[card.color]?.bgLight} ${COLOR_MAP[card.color]?.text}`
            }`}>
              <card.icon className="w-7 h-7 transition-transform group-hover:scale-110" /> {/* Corrected icon usage */}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Incidents Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" /> Recent Emergency Activity
            </h2>
            <button className="text-xs font-bold text-sky-500 hover:underline tracking-tight">View All History</button>
          </div>
          
          <div className="space-y-4">
            {incidents.map((inc, i) => (
              <IncidentCard key={inc.id} inc={inc} index={i} resolve={resolve} />
            ))}
          </div>
        </div>

        {/* Profile Completeness Widget */}
        <div className="space-y-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Setup Progress
          </h2>
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-8 shadow-sm">
            {patients.map(p => (
              <div key={p.id} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-black text-sm">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{p.type} Profile</p>
                  </div>
                  <div className={`text-sm font-black ${p.progress === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>{p.progress}%</div>
                </div>
                <div className="relative group cursor-help">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-emerald-500' : p.progress > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  {p.progress < 100 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Add medications to reach 100%
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-2xl">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-sky-800 leading-tight">
                  Complete all profiles to enable HIPAA-compliant handoff documentation for ER doctors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentCard({ inc, index, resolve }) {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-start gap-6 relative overflow-hidden group animate-fade-slide"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Status Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${inc.status === 'Open' ? 'bg-rose-500' : 'bg-slate-300'}`} />
      
      <div className="flex-1 flex gap-4 w-full">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-black text-slate-400">
          {inc.patient.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-lg font-black">{inc.patient}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              inc.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {inc.status}
            </span>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {inc.time}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-sky-500" /> {inc.location}
            </span>
            <span className="flex items-center gap-1 text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-2">
              <Languages className="w-3.5 h-3.5 text-indigo-500" /> {inc.lang}
            </span>
            {inc.observation !== 'No observation provided' && (
              <div className="mt-2 w-full bg-sky-50 border border-sky-100 p-2 rounded-xl flex items-start gap-2 animate-in fade-in zoom-in duration-500">
                <MessageCircle className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-sky-800 italic leading-tight">"{inc.observation}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <button className="flex-1 md:flex-none px-4 py-2 text-xs font-black text-sky-500 hover:bg-sky-50 rounded-xl transition-colors">
          View Details
        </button>
        {inc.status === 'Open' && (
          <button 
            onClick={() => resolve(inc.id)}
            className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}

/** 
 * 2. INCIDENT HISTORY 
 */
function IncidentHistory({ incidents, resolve, isDarkMode }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-black tracking-tight">Full Incident Log</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border bg-white border-slate-200 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" /> 
            <input type="text" placeholder="Search by patient or location..." className="bg-transparent text-xs font-bold outline-none w-48" />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile-Specific Creative Feed (Visible on Phone/Tablet) */}
      <div className="md:hidden space-y-4">
        {incidents.map((inc, idx) => (
          <div 
            key={inc.id} 
            onClick={() => setExpandedId(expandedId === inc.id ? null : inc.id)}
            className={`group bg-white border-2 transition-all duration-300 rounded-[2rem] p-5 relative overflow-hidden active:scale-95 ${
              expandedId === inc.id ? 'border-sky-500 shadow-xl' : 'border-slate-100 shadow-sm'
            }`}
          >
            {/* Status Pulse Bar */}
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${inc.status === 'Open' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
            
            <div className="flex justify-between items-start mb-4 pl-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                  {inc.patient?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-none">{inc.patient}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{inc.time}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                inc.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                {inc.status}
              </span>
            </div>

            <div className="space-y-2 pl-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="truncate">{inc.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
                <Languages className="w-3.5 h-3.5 shrink-0" />
                <span>Language: {inc.lang}</span>
              </div>
            </div>

            {/* Expanded Content for Mobile */}
            {expandedId === inc.id && (
              <div className="mt-6 pt-6 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-300 space-y-5">
                <div className="bg-sky-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-sky-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Observation
                  </div>
                  <p className="text-xs font-bold text-sky-900 italic leading-relaxed">
                    "{inc.observation}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); resolve(inc.id); }}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      inc.status === 'Open' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 pointer-events-none'
                    }`}
                  >
                    {inc.status === 'Open' ? 'Resolve Now' : 'Resolved'}
                  </button>
                  <button className="py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200">
                    Map View
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Advanced Table (Hidden on Mobile) */}
      <div className="hidden md:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {incidents.map(inc => (
                <React.Fragment key={inc.id}>
                  <tr 
                    className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedId === inc.id ? 'bg-sky-50/50 dark:bg-sky-500/5' : ''}`}
                    onClick={() => setExpandedId(expandedId === inc.id ? null : inc.id)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-[10px] uppercase">{inc.patient?.charAt(0)}</div>
                        {inc.patient}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${inc.status === 'Open' ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-50'}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium truncate max-w-[200px]">{inc.location}</td>
                    <td className="px-6 py-5 text-indigo-500 font-black">{inc.lang}</td>
                    <td className="px-6 py-5 text-slate-400 font-medium">{inc.time}</td>
                    <td className="px-6 py-5 text-right">
                      {expandedId === inc.id ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                    </td>
                  </tr>
                  {expandedId === inc.id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 bg-sky-50/30">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {/* Map Simulation */}
                          <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Location</h5>
                            <div className="relative h-48 bg-slate-200 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                              <MapPin className="w-10 h-10 text-rose-500 animate-bounce" />
                              <div className="absolute inset-0 bg-sky-500/10 mix-blend-overlay"></div>
                              <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-between">
                                <p className="text-[10px] font-black">{inc.coords}</p>
                                <button className="bg-sky-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black">Open Maps</button>
                              </div>
                            </div>
                          </div>

                          {/* AI Summary and Responder View */}
                          <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responder Observation</h5>
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 border-l-4 border-l-sky-400 italic font-medium leading-relaxed">
                              "Patient appeared distressed by the traffic noise. Responded well to visual symbols for 'water'. Currently waiting with police officer #4421."
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex items-center gap-3">
                              <MessageCircle className="w-5 h-5 text-emerald-500" />
                              <p className="text-[10px] font-bold text-emerald-700">WhatsApp Alert Sent to Emergency Network</p>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Response Timeline</h5>
                            <div className="relative pl-6 space-y-6">
                              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200"></div>
                              {['QR Scanned', 'Responder Connected', 'Location Verified', 'Caregiver Notified'].map((evt, idx) => (
                                <div key={evt} className="relative flex items-center gap-4">
                                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${idx < 3 ? 'bg-sky-500 border-sky-100' : 'bg-slate-100 border-white'}`}></div>
                                  <p className={`text-xs font-black ${idx < 3 ? 'text-slate-900' : 'text-slate-400'}`}>{evt}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** 
 * 3. PROFILES SECTION 
 */
function ProfilesGrid({ patients, openModal }) { // Removed isDarkMode prop
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Emergency Profiles</h2>
        <button 
          onClick={openModal}
          className="bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-sky-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {patients.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-sky-500/30">
                {p.name.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-10 h-10 border-4 border-white rounded-2xl flex items-center justify-center text-white font-black text-[10px] uppercase ${p.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {p.progress}%
              </div>
            </div>

            <h3 className="text-xl font-black leading-tight mb-1">{p.name}</h3>
            <p className="text-sm font-bold text-slate-400 mb-4">AGE {p.age} · {p.bloodGroup}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {p.conditions?.map(c => (
                <span key={c} className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest border border-sky-100">
                  {c}
                </span>
              ))}
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Link to={`/profiles/${p.id}/edit`} className="flex-1 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl transition-all hover:bg-slate-800 active:scale-95 flex items-center justify-center">
                Edit Profile
              </Link>
              <Link to={`/profiles/${p.id}/qr`} className="flex-1 py-3 bg-sky-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95 flex items-center justify-center">
                View QR
              </Link>
            </div>
          </div>
        ))}

        {/* Empty Placeholder / Add Card */}
        <button 
          onClick={openModal}
          className="border-4 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-sky-300 hover:text-sky-400 transition-all group"
        >
          <i className="ti ti-plus text-5xl transition-transform group-hover:scale-110"></i>
          <p className="font-black text-sm uppercase tracking-widest">New Emergency Profile</p>
        </button>
      </div>
    </div>
  );
}

/** 
 * 4. CALM KIT 
 */
function CalmKit({ patients }) { // Removed isDarkMode prop
  const [activeId, setActiveId] = useState(patients[0]?.id);
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, stopped, saved
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResponderPreview, setShowResponderPreview] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Settings state (could be structured as an object per patient, for this artifact we track active one)
  const [msgLabel, setMsgLabel] = useState("");
  const [msgContext, setMsgContext] = useState("Always show during any emergency");
  const [selectedLangs, setSelectedLangs] = useState(['English']);
  const [transcript, setTranscript] = useState("");

  const [allMessages, setAllMessages] = useState({}); 
  
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (patients.length > 0 && Object.keys(allMessages).length === 0) {
      // Pre-populate Arjun Rao (Assume 1st patient)
      setAllMessages({
        [patients[0].id]: [
          { id: 'm1', label: "Mama's calm message", languages: ['Hindi'], duration: '0:12', context: 'Always show', url: '#' },
          { id: 'm2', label: "Breathing exercise guide", languages: ['English'], duration: '0:24', context: 'Sensory overload', url: '#' }
        ]
      });
    }
  }, [patients]);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recordingState]);

  const handleRecord = async () => {
    if (recordingState === 'recording') {
      recorderRef.current.stop();
      setRecordingState('stopped');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setRecordingState('recording');
      setTimer(0);
    } catch (err) {
      toast.error("Microphone access denied. Please enable permissions.");
    }
  };

  const saveMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      label: msgLabel || "Calm Message",
      languages: selectedLangs,
      duration: `0:${timer.toString().padStart(2, '0')}`,
      context: msgContext,
      url: audioUrl,
      transcript
    };
    setAllMessages(prev => ({
      ...prev,
      [activeId]: [newMessage, ...(prev[activeId] || [])]
    }));
    setRecordingState('saved');
    toast.success("Message added to patient kit");
  };

  const deleteMessage = (id) => {
    setAllMessages(prev => ({
      ...prev,
      [activeId]: prev[activeId].filter(m => m.id !== id)
    }));
    setDeleteConfirmId(null);
    toast.success("Message removed");
  };

  const speakTranscript = (text) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text || "Arjun beta, you are safe. I am coming. Take slow breaths. You are loved.");
      u.rate = 0.85; window.speechSynthesis.speak(u);
    }
  };

  const formatTime = (s) => `0:${s.toString().padStart(2, '0')}`;

  const activePatient = patients.find(p => p.id === activeId) || patients[0];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Explanation Banner */}
      <div className="bg-sky-50 border border-sky-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 relative">
        <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
          <i className="ti ti-heart text-white text-3xl" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Calm Kit</h2>
          <p className="text-sm font-bold text-sky-700 leading-relaxed max-w-2xl">
            Record a personal voice message for each patient. During an emergency, responders can play this message directly — your voice is the fastest way to calm your loved one.
          </p>
        </div>
        <button 
          onClick={() => setShowResponderPreview(true)}
          className="bg-white border border-sky-200 text-sky-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95"
        >
          Preview as Responder
        </button>
      </div>

      {/* Patient Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-100 px-4 overflow-x-auto custom-scrollbar no-scrollbar">
        {patients.map(p => (
          <button 
            key={p.id} 
            onClick={() => setActiveId(p.id)}
            className={`flex items-center gap-3 pb-4 border-b-4 transition-all shrink-0 ${activeId === p.id ? 'border-sky-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 uppercase">{p.name.charAt(0)}</div>
            <span className="font-black text-sm uppercase tracking-tighter whitespace-nowrap">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Main Kit UI */}
      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* LEFT: Recorder */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-8 shadow-sm">
            {recordingState === 'idle' ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <i className="ti ti-microphone-off text-6xl text-slate-100" />
                <div>
                  <h3 className="text-xl font-black text-slate-900">No message recorded yet</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tap record to add {activePatient?.name}'s message</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <div className="flex items-end justify-center gap-1.5 h-12">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-[3px] bg-sky-500 rounded-full transition-all duration-300 ${recordingState === 'recording' ? 'animate-waveform' : ''}`}
                      style={{ 
                        height: recordingState === 'recording' ? `${Math.floor(Math.random() * 24) + 8}px` : `${[8,24,12,32,18,12,8,28,14,32,8,22,14,18,30,12,8,26,14,20][i]}px`,
                        animationDelay: `${i * 0.05}s` 
                      }}
                    />
                  ))}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${recordingState === 'recording' ? 'text-rose-500' : 'text-sky-600'}`}>
                  {recordingState === 'recording' ? `Recording... ${formatTime(timer)}` : `Recorded ${formatTime(timer)}`}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleRecord}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 ${recordingState === 'recording' ? 'bg-slate-900 ring-8 ring-slate-100' : 'bg-rose-500 ring-8 ring-rose-50'}`}
              >
                {recordingState === 'recording' ? <i className="ti ti-player-pause text-2xl" /> : <i className="ti ti-microphone text-2xl" />}
              </button>
              
              {recordingState === 'stopped' && (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                  <div className="flex items-center gap-3">
                    <button onClick={() => audioRef.current.play()} className="w-12 h-12 rounded-2xl border-2 border-sky-500 text-sky-500 flex items-center justify-center hover:bg-sky-50 transition-all">
                      <i className="ti ti-player-play" />
                    </button>
                    <button onClick={saveMessage} className="bg-sky-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95 transition-all">
                      Save Message
                    </button>
                  </div>
                  <button onClick={() => setRecordingState('idle')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Re-record</button>
                </div>
              )}
            </div>
            <audio ref={audioRef} src={audioUrl} className="hidden" />
          </div>

          {/* Upload Fallback */}
          <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-sky-200 hover:text-sky-400 transition-all group cursor-pointer">
            <i className="ti ti-upload text-3xl mb-2 transition-transform group-hover:-translate-y-1" />
            <p className="font-black text-[10px] uppercase tracking-widest">Or upload an audio file (.mp3, .wav)</p>
          </div>
        </div>

        {/* RIGHT: Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Message Label</label>
              <input 
                type="text" 
                placeholder="e.g. Mama's calm message, Dadi's voice"
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-sky-500/10"
                value={msgLabel} onChange={(e) => setMsgLabel(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">When to show this message</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'always', label: 'Always show during any emergency', icon: '🚨' },
                  { id: 'unresponsive', label: 'Only when marked Unresponsive', icon: '😰' },
                  { id: 'sensory', label: 'Only for sensory overload situations', icon: '🧩' }
                ].map(opt => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${msgContext === opt.label ? 'border-sky-500 bg-sky-50/50' : 'border-slate-50 hover:border-slate-100'}`}>
                    <input type="radio" name="context" className="hidden" checked={msgContext === opt.label} onChange={() => setMsgContext(opt.label)} />
                    <span className="text-xl shrink-0">{opt.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Message Language</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => setSelectedLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedLangs.includes(l) ? 'bg-sky-500 border-sky-400 text-white' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Optional Transcript</label>
              <textarea 
                rows="3"
                placeholder="e.g. Arjun beta, you are safe. I am coming..."
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-sky-500/10"
                value={transcript} onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex gap-4">
            <i className="ti ti-bulb text-amber-500 text-2xl shrink-0 mt-1" />
            <div className="space-y-3">
              <h4 className="font-black text-amber-900 text-sm">Tips for a good calm message</h4>
              <ul className="text-[11px] font-bold text-amber-800/80 space-y-2 leading-tight">
                <li className="flex items-center gap-2">· Keep it under 30 seconds</li>
                <li className="flex items-center gap-2">· Use their name at the start</li>
                <li className="flex items-center gap-2">· Speak slowly and warmly</li>
                <li className="flex items-center gap-2">· Mention something familiar</li>
                <li className="flex items-center gap-2">· End with your usual "I love you" phrase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Messages List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Saved messages</h3>
          <span className="bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-black">{(allMessages[activeId] || []).length}</span>
        </div>

        <div className="space-y-3">
          {(allMessages[activeId] || []).map(msg => (
            <div key={msg.id} className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-lg hover:shadow-sky-900/5 transition-all animate-fade-slide">
              <div className="flex items-center gap-5 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs">{activePatient?.name.charAt(0)}</div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 leading-none">{msg.label}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {msg.languages.map(l => <span key={l} className="text-[8px] font-black uppercase text-slate-400">{l}</span>)}
                    </div>
                    <span className="text-[10px] text-slate-200">|</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.context}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-900">{msg.duration}</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Duration</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                  <i className="ti ti-player-play" />
                </button>
                <button onClick={() => toast.success("Shareable link copied!")} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all">
                  <i className="ti ti-link" />
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(msg.id)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all"
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mx-auto"><i className="ti ti-trash" /></div>
            <div>
              <h4 className="text-xl font-black text-slate-900">Remove this calm message?</h4>
              <p className="text-sm font-bold text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeleteConfirmId(null)} className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 bg-slate-50">Cancel</button>
              <button onClick={() => deleteMessage(deleteConfirmId)} className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-rose-500 shadow-xl shadow-rose-500/20">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* RESPONDER PREVIEW MODAL */}
      {showResponderPreview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-[340px] animate-in zoom-in duration-500">
            <button onClick={() => setShowResponderPreview(false)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em]">
              Close Preview <X className="w-5 h-5" />
            </button>
            
            <div className="phone-frame bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] overflow-hidden aspect-[9/19]">
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-10">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sky-500">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Emergency Active</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activePatient?.name}</h3>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => { setIsPlaying(true); speakTranscript(transcript); setTimeout(() => setIsPlaying(false), 5000); }}
                    className={`w-32 h-32 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isPlaying ? 'ring-[20px] ring-sky-50' : 'animate-glow-pulse'}`}
                  >
                    <i className={`ti ${isPlaying ? 'ti-player-pause' : 'ti-player-play-filled'} text-4xl ml-1`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-black text-slate-800 leading-snug">
                    {isPlaying ? "Caregiver's voice is playing..." : `Tap to hear a message from ${activePatient?.name.split(' ')[0]}'s caregiver`}
                  </p>
                  
                  {isPlaying && (
                    <div className="flex items-end justify-center gap-1 h-6">
                      {[3, 8, 5, 10, 4, 12, 6, 8, 4, 9, 3].map((h, i) => (
                        <div key={i} className="w-1 bg-sky-500 rounded-full animate-waveform" style={{ height: `${h * 8}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8 opacity-30">
                  <QrCode className="w-12 h-12 mx-auto" />
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] mt-4">SilentSOS Safe Mode</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 
 * 5. ANALYTICS SECTION 
 */
function Analytics() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Scans Over Time */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-black text-lg tracking-tight">Scans Trend (7 Days)</h3>
            <i className="ti ti-arrow-up-right text-emerald-500 font-bold"> +24%</i>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SCAN_DATA}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: '900' }}
              />
              <Area type="monotone" dataKey="scans" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Language Breakdown */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 min-h-[400px] flex flex-col">
          <h3 className="font-black text-lg tracking-tight mb-10">Emergency UI Languages</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-8">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <Pie
                  data={LANG_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {LANG_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 w-full max-w-[200px]">
              {LANG_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-xs font-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 min-h-[400px]">
          <h3 className="font-black text-lg tracking-tight mb-10">Incidents by Hour</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={HOUR_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px' }} />
              <Bar dataKey="incidents" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Area Chart */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 min-h-[400px]">
          <h3 className="font-black text-lg tracking-tight mb-10">Avg Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SCAN_DATA}>
               <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#94a3b8" />
              <Tooltip />
              <Area type="step" dataKey="scans" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/** 
 * 6. SETTINGS SECTION 
 */
function Settings() { // Removed isDarkMode prop
  return (
    <div className="max-w-4xl animate-fade-in space-y-12">
      {/* Caregiver Identity */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 flex items-center gap-8"> {/* Removed isDarkMode prop */}
        <div className="w-24 h-24 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-500/20 shrink-0"> {/* Removed isDarkMode prop */}
          R
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black">Riya Vashisth</h3>
          <p className="text-sm font-bold text-slate-500 mb-4">riyav@example.com · +91 99000 88221</p>
          <button className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all">Update Photo</button>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Security & Notifications</h4>
          <div className="space-y-6">
            {[
              { label: 'WhatsApp Alerts', desc: 'Critical SOS notifications on mobile', status: true },
              { label: 'SMS Notifications', desc: 'Backup alert via cellular text', status: true },
              { label: 'Email Reports', desc: 'Weekly summary of scan activity', status: false },
              { label: 'Browser Push', desc: 'Real-time incident desktop alerts', status: true },
            ].map(pref => (
              <div key={pref.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black tracking-tight">{pref.label}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{pref.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${pref.status ? 'bg-sky-500' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${pref.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Dashboard Settings</h4>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Display Language</label>
              <select className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm">
                <option>English (Universal)</option>
                <option>Hindi (Localized)</option>
              </select>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
             <button className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
               <Download className="w-4 h-4 mr-2" /> Export Account Data (CSV)
             </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 border-rose-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-black text-rose-500 tracking-tight">Danger Zone</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Permanently delete your account and all patient profiles</p>
          </div>
          <button disabled className="opacity-50 cursor-not-allowed group relative px-8 py-4 bg-rose-500 text-white font-black rounded-2xl">
            Delete My Account
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Contact support to verify identity first
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/** 
 * MULTI-STEP MODAL 
 */
function AddPatientModal({ close }) { // Removed isDarkMode prop
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={close}></div>
      
      <div className="relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in bg-white">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-none">Add Patient</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
              Step {currentStep} of 5 — {
                currentStep === 1 ? 'Basic Info' : 
                currentStep === 2 ? 'Medical Details' : 
                currentStep === 3 ? 'Contacts' : 
                currentStep === 4 ? 'Care Triggers' : 'Review'
              }
            </p>
          </div>
          <button onClick={close} className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-sky-500 hover:border-sky-300 transition-all cursor-pointer">
                  <Camera className="w-8 h-8" />
                  <span className="text-[8px] font-black uppercase mt-1">Photo</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" placeholder="Arjun Rao" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm outline-none focus:ring-4 focus:ring-sky-500/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Age</label>
                  <input type="number" placeholder="28" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm outline-none focus:ring-4 focus:ring-sky-500/10" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Communication Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Autistic', 'Deaf', 'Mute', 'Cognitive'].map(t => (
                    <button key={t} className="p-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase hover:border-sky-500 transition-all">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Medical Conditions (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {['Epilepsy', 'Diabetes', 'Cardiac', 'Asthma', 'Peanut Allergy', 'Latex Allergy'].map(c => (
                    <button key={c} className="px-4 py-2 rounded-full border border-sky-100 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest">{c}</button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Daily Medications</label>
                  <textarea placeholder="e.g. Levetiracetam 500mg (2x daily)" rows="3" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Blood Type</label>
                   <select className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm outline-none">
                    <option>Select Blood Type</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 3 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Activity className="w-12 h-12 animate-spin mb-4" />
              <p className="font-black text-sm uppercase tracking-widest">Mock form step continues...</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between">
          <button 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(s => s - 1)}
            className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-0"
          >
            Back
          </button>
          <div className="flex gap-4">
            <button onClick={close} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Cancel</button>
            <button 
              onClick={() => currentStep < 5 ? setCurrentStep(s => s + 1) : close()}
              className="bg-sky-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95 transition-all"
            >
              {currentStep === 5 ? 'Save Profile' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 
 * EMPTY STATE COMPONENT 
 */
function EmptyState({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-48 h-48 mb-8 opacity-20 dark:opacity-10">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100 20c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm0 144c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"/>
          <path d="M100 50c-5.5 0-10 4.5-10 10v40c0 5.5 4.5 10 10 10s10-4.5 10-10V60c0-5.5-4.5-10-10-10zM100 130c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/>
        </svg>
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm font-bold text-slate-400 max-w-xs">{desc}</p>
    </div>
  );
}