import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Volume2, Home, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SYMBOLS = [
  { label: 'Pain', emoji: '😣', phrase: 'I am in pain', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { label: 'Water', emoji: '💧', phrase: 'I need water', color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { label: 'Hungry', emoji: '🍎', phrase: 'I am hungry', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Toilet', emoji: '🚻', phrase: 'I need to use the toilet', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  { label: 'Scared', emoji: '😨', phrase: 'I am scared', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { label: 'Help', emoji: '🆘', phrase: 'Please help me', color: 'bg-red-50 border-red-200 text-red-700' },
  { label: 'Yes', emoji: '✅', phrase: 'Yes', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { label: 'No', emoji: '❌', phrase: 'No', color: 'bg-rose-50 border-rose-200 text-rose-700' }
];

export default function CommunicationBoard() {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (qrId === 'demo') {
      setProfile({ name: 'Arjun' });
      return;
    }
    api.get(`/emergency/${qrId}`).then(res => setProfile(res.data)).catch(() => toast.error('Profile not found'));
  }, [qrId]);

  const speak = (phrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phrase);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
      toast(`Speaking: "${phrase}"`, { icon: '🔊', duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 px-6 py-10">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-sky-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Link to="/" className="text-slate-400 hover:text-sky-600"><Home className="w-5 h-5" /></Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-sky-200">
            <MessageSquare className="w-3 h-3" /> Communication Board
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Help {profile?.name || 'Person'} Communicate</h1>
          <p className="text-slate-500 text-sm mt-2 font-bold">Tap a symbol to let the phone speak for them.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SYMBOLS.map((sym) => (
            <button
              key={sym.label}
              onClick={() => speak(sym.phrase)}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all active:scale-95 shadow-sm hover:shadow-md ${sym.color}`}
            >
              <span className="text-5xl mb-3 drop-shadow-sm">{sym.emoji}</span>
              <span className="font-black text-xs uppercase tracking-widest">{sym.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">How this works</h4>
            <p className="text-xs font-bold text-slate-400 leading-relaxed mt-1">
              Show this screen to {profile?.name || 'the person'}. They will tap symbols to express their immediate needs. Ensure your phone's media volume is turned up.
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-12">
          SilentSOS · Communication Bridge
        </p>
      </div>
    </div>
  );
}