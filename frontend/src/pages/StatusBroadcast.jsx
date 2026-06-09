import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const STATUSES = [
  { id: 0, label: 'Conscious & Responsive', icon: 'ti-circle-check', color: 'emerald' },
  { id: 1, label: 'Unresponsive', icon: 'ti-alert-circle', color: 'amber' },
  { id: 2, label: 'Needs Immediate Help', icon: 'ti-urgent', color: 'rose', pulse: true },
  { id: 3, label: 'Transported to Hospital', icon: 'ti-ambulance', color: 'violet' },
  { id: 4, label: 'Incident Resolved', icon: 'ti-check', color: 'slate' }
];

const SYMBOLS = [
  { label: 'Pain', emoji: '😣', phrase: 'I am in pain' },
  { label: 'Water', emoji: '💧', phrase: 'I need water' },
  { label: 'Scared', emoji: '😨', phrase: 'I am scared' },
  { label: 'Help', emoji: '🆘', phrase: 'I need help' }
];

export default function StatusBroadcast() {
  const [activeStatus, setActiveStatus] = useState(STATUSES[0]);
  const [responderNote, setResponderNote] = useState('');
  const [broadcastedNote, setBroadcastedNote] = useState('');
  const [syncState, setSyncState] = useState('idle'); // 'idle', 'syncing', 'updated'
  const [timeline, setTimeline] = useState([
    { label: 'QR Scanned — Incident opened', time: '2 min ago', color: 'sky' },
    { label: 'Responder engaged', time: '1 min 45s ago', color: 'indigo' }
  ]);

  const speak = (phrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast(`Speaking: "${phrase}"`, { icon: '🔊', duration: 2000 });
    }
  };

  const handleBroadcast = () => {
    setSyncState('syncing');
    
    setTimeout(() => {
      setSyncState('updated');
      setBroadcastedNote(responderNote);
      
      const newEntry = {
        label: `Status: ${activeStatus.label}`,
        time: 'just now',
        color: activeStatus.color
      };
      
      setTimeline(prev => [newEntry, ...prev]);
      toast.success('Message sent successfully!');
      
      setTimeout(() => setSyncState('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-sky-50/50 p-6 md:p-12 font-['Inter',sans-serif]">
      {/* Success Flash Overlay */}
      {syncState === 'updated' && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/20 backdrop-blur-md pointer-events-none flex items-center justify-center p-6">
          <div className="bg-emerald-500 text-white px-8 py-5 rounded-[2rem] shadow-2xl font-black text-xl flex items-center gap-4 animate-zoom-in">
            <CheckCircle2 className="w-10 h-10" /> MESSAGE SENT SUCCESSFULLY!
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 font-semibold mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* LEFT PANEL — RESPONDER VIEW (Phone Mockup) */}
          <div className="w-full max-w-[300px] mx-auto lg:mx-0 shrink-0">
            <div className="relative border-[6px] border-slate-900 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden aspect-[9/19]">
              {/* Phone Content */}
              <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="ti ti-shield-check text-sky-500 text-xl" />
                    <span className="font-black text-xs uppercase tracking-tighter text-slate-800">Emergency View</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-rose-600 uppercase">Live Incident</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
                  {/* Patient Summary Card */}
                  <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-4 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center font-black text-white text-lg">AR</div>
                    <div>
                      <h4 className="font-black text-slate-900">Arjun Rao, 28</h4>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[9px] font-black bg-white border border-sky-100 px-2 py-0.5 rounded text-sky-600 uppercase">Autism</span>
                        <span className="text-[9px] font-black bg-white border border-sky-100 px-2 py-0.5 rounded text-sky-600 uppercase">Epilepsy</span>
                      </div>
                    </div>
                  </div>

                  {/* Allergy Warning */}
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-start gap-2">
                    <i className="ti ti-alert-triangle text-rose-500 mt-0.5" />
                    <p className="text-[10px] font-bold text-rose-800 leading-tight uppercase tracking-tight">
                      Allergy: No Valium — triggers seizure. Blood: B+
                    </p>
                  </div>

                  {/* Status Buttons */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Vitals Status</h5>
                    {STATUSES.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setActiveStatus(status)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                          activeStatus.id === status.id 
                            ? `bg-${status.color}-500 border-${status.color}-200 text-white shadow-lg` 
                            : 'bg-white border-slate-50 text-slate-500 hover:border-slate-100'
                        } ${status.pulse && activeStatus.id === status.id ? 'ring-4 ring-rose-500/20 animate-pulse' : ''}`}
                      >
                        <i className={`ti ${status.icon} text-xl`} />
                        <span className="font-black text-xs uppercase tracking-tight">{status.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Notes & Broadcast */}
                  <div className="space-y-3">
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="Describe what you see — patient is shaking, appears scared..."
                      rows="3"
                      value={responderNote}
                      onChange={(e) => setResponderNote(e.target.value)}
                    />
                    <button 
                      onClick={handleBroadcast}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-sky-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                      Broadcast Update
                    </button>
                  </div>
                </div>

                {/* Symbol Communicator Row */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-2">
                  {SYMBOLS.map(sym => (
                    <button 
                      key={sym.label}
                      onClick={() => speak(sym.phrase)}
                      className="flex flex-col items-center gap-1 bg-white p-2 rounded-xl shadow-sm hover:scale-105 transition-transform"
                    >
                      <span className="text-xl">{sym.emoji}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase">{sym.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — CAREGIVER LIVE DASHBOARD */}
          <div className="flex-1 w-full animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-sky-900/5 border border-slate-100 overflow-hidden min-h-[700px] flex flex-col">
              
              {/* Topbar */}
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Caregiver Dashboard</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-400">Live Connection Active</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {syncState === 'syncing' ? (
                    <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <i className="ti ti-refresh animate-spin" /> Syncing...
                    </div>
                  ) : syncState === 'updated' ? (
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                      <i className="ti ti-check" /> Updated just now
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Idle Mode</span>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                {/* Active Incident Banner */}
                <div className="bg-sky-500 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🚨</div>
                    <div>
                      <h3 className="text-xl font-black">Active Incident — Arjun Rao</h3>
                      <p className="text-sm font-bold opacity-80">MG Road, Bengaluru · 2 min ago</p>
                    </div>
                  </div>
                  <button className="bg-white text-sky-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    Open in Maps
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Current Status Display */}
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className={`w-24 h-24 rounded-[2rem] bg-${activeStatus.color}-500 text-white flex items-center justify-center shadow-xl shadow-${activeStatus.color}-500/20 transition-all duration-500 mb-6`}>
                      <i className={`ti ${activeStatus.icon} text-5xl`} />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Live Status</h4>
                    <p className={`text-2xl font-black text-${activeStatus.color}-600 leading-none transition-all duration-500`}>
                      {activeStatus.label}
                    </p>
                  </div>

                  {/* Responder Notes Card */}
                  <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <i className="ti ti-notes text-lg" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Responder Notes</span>
                    </div>
                    <p className={`text-sm font-bold leading-relaxed transition-all duration-500 ${broadcastedNote ? 'text-slate-800 italic' : 'text-slate-300'}`}>
                      {broadcastedNote ? `"${broadcastedNote}"` : "No notes broadcasted yet. Awaiting responder update..."}
                    </p>
                  </div>
                </div>

                {/* Vitals Timeline */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Vitals Timeline</h3>
                  <div className="relative pl-8 space-y-8">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
                    {timeline.map((entry, idx) => (
                      <div key={idx} className="relative animate-in slide-in-from-top-4 duration-500">
                        <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-md bg-${entry.color}-500`} />
                        <div className="flex items-center justify-between">
                          <p className={`font-black text-sm ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{entry.label}</p>
                          <span className="text-[10px] font-black text-slate-300 uppercase">{entry.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="pt-8 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    <i className="ti ti-brand-whatsapp text-lg" /> WhatsApp Arjun's Guardian
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all">
                    <i className="ti ti-phone text-lg" /> Call Emergency Contact
                  </button>
                </div>
              </div>

              {/* Branding Footer */}
              <div className="p-6 bg-slate-50 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                  SilentSOS · Encrypted Real-time Broadcast Protocol
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}