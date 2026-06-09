import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  QrCode, 
  Shield, 
  Smartphone, 
  Zap, 
  Globe,
  MapPin,
  MessageCircle,
  User,
  BrainCircuit,
  Camera,
  CheckCircle2,
  Activity,
  WifiOff,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Plus,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Vite will now correctly find AuthContext.jsx

const FeatureNode = ({ icon: Icon, title, subtitle, className, colorClass, delayClass }) => (
  <div className={`md:absolute flex flex-col items-center animate-node ${delayClass} animate-float group pointer-events-auto ${className}`}>
    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-white hover-glow-card transition-all">
      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorClass} group-hover:scale-110 transition-transform`} />
    </div>
    <div className="mt-4 text-center">
      <div className="text-xs font-black text-slate-900 uppercase tracking-tighter">{title}</div>
      <div className="text-[10px] text-slate-500 font-bold max-w-[120px] leading-tight mt-1">{subtitle}</div>
    </div>
  </div>
);

const SCENARIOS = [
  {
    id: 'autism',
    emoji: '🧩',
    title: 'Autism',
    scenario: 'Lost in a crowded environment and unable to communicate effectively.',
    color: 'violet',
    steps: ['QR Scanned', 'Preferences Loaded', 'Caregiver Contacted', 'Safe Assistance'],
    outcome: 'Bystanders understand sensory needs immediately, preventing meltdown while family is en route.'
  },
  {
    id: 'stroke',
    emoji: '🧠',
    title: 'Stroke Recovery',
    scenario: 'Person is conscious but unable to speak clearly during a sudden health setback.',
    color: 'rose',
    steps: ['QR Scanned', 'Med Info Available', 'Contacts Notified', 'Faster Response'],
    outcome: 'EMS receives precise medical history instantly, saving critical minutes for treatment.'
  },
  {
    id: 'cp',
    emoji: '♿',
    title: 'Cerebral Palsy',
    scenario: 'Individual needs assistance communicating specific physical needs to first responders.',
    color: 'amber',
    steps: ['QR Scanned', 'Comm Aids Displayed', 'Caregiver Notified', 'Support Arrives'],
    outcome: 'The Symbol Communicator bridges the gap, allowing the individual to direct their own care.'
  },
  {
    id: 'speech',
    emoji: '🔇',
    title: 'Speech Impairment',
    scenario: 'Unable to verbally explain identity or emergency needs in a high-stress situation.',
    color: 'sky',
    steps: ['QR Scanned', 'Identity Confirmed', 'Info Displayed', 'Help Enabled'],
    outcome: 'Identity and emergency protocols are verified without a single spoken word.'
  },
  {
    id: 'dementia',
    emoji: '👴',
    title: 'Dementia',
    scenario: 'An individual becomes disoriented or lost in an unfamiliar neighborhood.',
    color: 'emerald',
    steps: ['QR Scanned', 'Contacts Available', 'Location Shared', 'Family Reconnected'],
    outcome: 'Automated GPS pings alert the family the exact moment a kind stranger scans the card.'
  }
];

const SCENARIO_COLORS = {
  violet: { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-900', badge: 'bg-violet-500', icon: 'text-violet-500' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', badge: 'bg-rose-500', icon: 'text-rose-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', badge: 'bg-amber-500', icon: 'text-amber-500' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-900', badge: 'bg-sky-500', icon: 'text-sky-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', badge: 'bg-emerald-500', icon: 'text-emerald-500' }
};

export default function Landing() {
  const [simStep, setSimStep] = useState(0); // 0-4: Simulation, 5: Reveal
  const [isSimulating, setIsSimulating] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const workflowRef = useRef(null);
  const { user, logout } = useAuth();
  const [activeScenario, setActiveScenario] = useState(0);

  useEffect(() => {
    if (user || !isSimulating) {
      // Skip simulation for logged-in users to save time
      setSimStep(5);
      setIsSimulating(false);
      return;
    }

    const sequence = [
      { step: 0, delay: 1200 }, // Emergency Detected
      { step: 1, delay: 1500 }, // Sharing Location
      { step: 2, delay: 1200 }, // Analyzing Profile
      { step: 3, delay: 1500 }, // Alerting Contacts
      { step: 4, delay: 1000 }, // Help is on the way
    ];

    let current = 0;
    const runNext = () => {
      if (current < sequence.length) {
        setSimStep(current);
        setTimeout(() => {
          current++;
          runNext();
        }, sequence[current].delay);
      } else {
        setSimStep(5);
        setTimeout(() => setIsSimulating(false), 800); // Wait for fade animation
      }
    };

    runNext();
  }, []);

  useEffect(() => {
    let interval;
    const currentRef = workflowRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!interval) {
          interval = setInterval(() => {
            setWorkflowStep(prev => (prev + 1) % 4);
          }, 4000);
        }
      }
    }, { threshold: 0.3 });
    if (currentRef) observer.observe(currentRef);
    return () => { 
      if (currentRef) observer.unobserve(currentRef);
      if (interval) clearInterval(interval); 
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveScenario(prev => (prev + 1) % SCENARIOS.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-sky-50/30 font-['Inter',system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased selection:bg-sky-100">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          10% { transform: translate(-2px, -1px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.33); }
          80%, 100% { opacity: 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px 0px rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 40px 10px rgba(56, 189, 248, 0.6); }
        }
        @keyframes line-flow {
          0% { stroke-dashoffset: 100; opacity: 0.3; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        .animate-float {
          animation: floatSoft 5s ease-in-out infinite;
        }
        .animate-vibrate {
          animation: shake 0.2s linear infinite;
        }
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodePop {
          0% { opacity: 0; transform: scale(0.5); filter: grayscale(1); }
          100% { opacity: 1; transform: scale(1); filter: grayscale(0); }
        }
        @keyframes pulseSOS {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 0 20px rgba(244, 63, 94, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); transform: scale(1); }
        }
        .animate-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawLine 1s ease-out forwards; }
        .animate-node { opacity: 0; animation: nodePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-sos-pulse { animation: pulseSOS 2s infinite; }
        .animate-qr-hub { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-line-flow { stroke-dasharray: 10; animation: line-flow 3s linear infinite; }
        
        .delay-node-1 { animation-delay: 1.2s; }
        .delay-node-2 { animation-delay: 1.6s; }
        .delay-node-3 { animation-delay: 2.0s; }
        .delay-node-4 { animation-delay: 2.4s; }
        .delay-node-5 { animation-delay: 2.8s; }
        .delay-node-6 { animation-delay: 3.2s; }
        .delay-node-7 { animation-delay: 3.6s; }
        .hover-glow-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(56, 189, 248, 0.3);
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(56, 189, 248, 0.6);
          transform: translateY(-4px);
        }
        .glass-nav {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 250, 0.85);
        }
      `}</style>

      {/* Emergency Simulation Overlay */}
      {isSimulating && (
        <div className={`fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-700 ${simStep >= 5 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative mb-12">
            {/* Pulsing Red Rings */}
            <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20 scale-150" />
            <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-10 scale-[2]" />
            
            {/* Vibrating Phone Icon */}
            <div className={`relative w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-xl ${simStep < 5 ? 'animate-vibrate' : ''}`}>
              <Smartphone className="w-12 h-12 text-rose-500" />
            </div>
          </div>

          <div className="text-center space-y-4 px-6">
            <div className="h-8">
              {simStep >= 0 && (
                <p className="text-rose-500 font-black text-xl tracking-tighter animate-fade-slide">
                  {simStep === 0 ? "INCIDENT DETECTED: STARTING PROTOCOL..." : 
                   simStep === 1 ? "ACCESSING GPS: PINPOINTING LOCATION..." :
                   simStep === 2 ? "ANALYZING MEDICAL CONTEXT..." :
                   simStep === 3 ? "ALERTING TRUSTED CARE-NETWORKS..." :
                   "ACTIVE RESPONSE: HELP IS ON THE WAY."}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 justify-center pt-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${simStep >= i ? 'w-8 bg-rose-500' : 'w-2 bg-white/20'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-12 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            SilentSOS Active Response Protocol
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-nav border-b border-slate-100/60 transition-all duration-300 px-6">
        <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-md shadow-sky-200 shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Silent<span className="text-sky-500">SOS</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-full hover:bg-slate-50">
                  Sign In
                </Link>
                <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 p-6 space-y-4 animate-fade-slide shadow-2xl">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Home className="w-5 h-5 text-sky-500" /> Home
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-sky-500" /> Dashboard
                </Link>
                <Link to="/caregiver-db" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-5 h-5 text-sky-500" /> Caregiver-DB
                </Link>
                <Link to="/profiles/new" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Plus className="w-5 h-5 text-sky-500" /> New Profile
                </Link>
                <div className="h-px bg-slate-100 my-2" />
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-base font-bold text-rose-500 p-4 rounded-2xl hover:bg-rose-50 transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-44 md:pb-32 px-6 overflow-hidden">
          {/* Soft clean background glows */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-50/50 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[100px] -z-10" />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
            {/* Left Text */}
            <div className="flex-1 animate-fade-slide text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 shadow-sm mb-6">
                <Shield className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-sm font-black uppercase tracking-wider text-sky-700">
                  Healthcare & Accessibility Platform
                </span>
              </div>
              <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter text-slate-900 mb-6">
                Every Voice<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-emerald-500 to-sky-500 bg-[length:200%_auto] animate-gradient-shift">
                  Deserves To Be Heard.
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-600 max-w-xl mx-auto lg:mx-0 font-semibold leading-relaxed mb-10 px-4 md:px-0">
                SilentSOS helps non-verbal and communication-impaired individuals communicate, 
                share their location, and receive help instantly through a single QR scan.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <Link to={user ? "/dashboard" : "/register"} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300 hover:shadow-sky-200/50 hover:-translate-y-1">
                  {user ? "View Dashboard" : "Create a Profile"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/emergency/demo" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-sky-300 hover:text-sky-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="8" height="8" x="3" y="3" rx="1"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="1"/>
                  </svg>
                  View Demo
                </Link>
                <Link to="/demo/broadcast" className="flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 font-semibold py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-sky-300 hover:text-sky-600">
                  <Activity className="w-4 h-4" />
                  Live Sync Demo
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  HIPAA Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-500">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
                  </svg>
                  No App Install
                </span>
              </div>
            </div>

            {/* QR Hub Visualization */}
            <div className="flex-1 relative flex flex-col md:flex-row justify-center items-center min-h-[550px] md:h-[600px] animate-fade-slide mt-8 md:mt-12 lg:mt-0">
              {/* Animated Connection Lines (Desktop Only for Cleanliness) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 500 500">
                <g className="stroke-sky-200/50 stroke-[2] fill-none">
                  <path d="M250 250 L250 40" className="animate-line-flow" /> {/* Identity (Top) */}
                  <path d="M250 250 L445 105" className="animate-line-flow" /> {/* Voice (Top Right) */}
                  <path d="M250 250 L500 250" className="animate-line-flow" /> {/* Alerts (Mid Right) */}
                  <path d="M250 250 L445 395" className="animate-line-flow" /> {/* Insight (Bottom Right) */}
                  <path d="M250 250 L55 395" className="animate-line-flow" />  {/* GPS (Bottom Left) */}
                  <path d="M250 250 L0 250" className="animate-line-flow" />   {/* Global (Mid Left) */}
                  <path d="M250 250 L55 105" className="animate-line-flow" />  {/* Offline (Top Left) */}
                </g>
              </svg>

              {/* Central Glowing QR Hub */}
              <div className="relative z-20 w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl border border-sky-100 animate-qr-hub mb-12 md:mb-0">
                <div className="relative flex flex-col items-center">
                  <QrCode className="w-16 h-16 md:w-24 md:h-24 text-sky-500" strokeWidth={1.5} />
                  <div className="md:absolute md:-bottom-4 left-1/2 md:-translate-x-1/2 bg-slate-900 text-[10px] md:text-xs text-white font-black px-5 py-2.5 rounded-full tracking-widest uppercase whitespace-nowrap shadow-xl z-30">
                    Central Hub
                  </div>
                </div>
              </div>

              {/* Feature Nodes - Responsive Adaptive Grid */}
              <div className="w-full grid grid-cols-2 md:contents gap-x-4 gap-y-8 md:gap-0 pointer-events-none md:pointer-events-auto px-2">
                <FeatureNode 
                  icon={User} title="QR Identity" subtitle="Instant access" 
                  className="md:top-[3%] md:left-1/2 md:-translate-x-1/2" 
                  colorClass="text-sky-500" delayClass="delay-node-1"
                />
                <FeatureNode 
                  icon={Smartphone} title="AI Voice" subtitle="Voice support" 
                  className="md:top-[16%] md:right-[8%]" 
                  colorClass="text-emerald-500" delayClass="delay-node-2"
                />
                <FeatureNode 
                  icon={MessageCircle} title="Alerts" subtitle="Auto-Notify" 
                  className="md:top-1/2 md:-translate-y-1/2 md:right-[-2%]" 
                  colorClass="text-green-500" delayClass="delay-node-3"
                />
                <FeatureNode 
                  icon={BrainCircuit} title="AI Insight" subtitle="Safety Guide" 
                  className="md:bottom-[16%] md:right-[8%]" 
                  colorClass="text-violet-500" delayClass="delay-node-4"
                />
                <FeatureNode 
                  icon={MapPin} title="Live GPS" subtitle="Real-time" 
                  className="md:bottom-[16%] md:left-[8%]" 
                  colorClass="text-rose-500" delayClass="delay-node-5"
                />
                <FeatureNode 
                  icon={Globe} title="Global" subtitle="4+ Languages" 
                  className="md:top-1/2 md:-translate-y-1/2 md:left-[-2%]" 
                  colorClass="text-sky-600" delayClass="delay-node-6"
                />
                <FeatureNode 
                  icon={WifiOff} title="Offline Ready" subtitle="No internet needed" 
                  className="md:top-[16%] md:left-[8%]" 
                  colorClass="text-amber-500" delayClass="delay-node-7"
                />
              </div>

              {/* One QR Message */}
              <div className="md:absolute md:-bottom-8 mt-12 md:mt-0 animate-fade-slide delay-node-4 opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '3s' }}>
                <div className="bg-sky-50 text-sky-700 border border-sky-100 px-6 py-3 rounded-2xl shadow-sm flex items-center justify-center gap-3">
                  <Zap className="w-4 h-4 fill-sky-500" />
                  <span className="font-black text-sm uppercase tracking-widest text-center">One QR scan · Offline Access · 5+ Languages</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted & Conditions Section */}
        <section className="py-24 px-6 bg-white border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-4">
                Trusted for critical support
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Designed for <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">every unique voice</span>
              </h2>
              <p className="text-slate-500 text-lg mt-4 font-medium">
                From neurodiversity to post-stroke recovery — SilentSOS bridges the emergency gap.
              </p>
            </div>

            <div className="relative group">
              {/* Carousel Controls */}
              <div className="hidden md:block">
                <div
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-white shadow-xl rounded-2xl border border-slate-100 text-slate-400 hover:text-sky-500 transition-all"
                  onClick={() => setActiveScenario(prev => (prev - 1 + SCENARIOS.length) % SCENARIOS.length)}
                >
                  <X className="w-6 h-6 rotate-90" />
                </div>
                <div
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-white shadow-xl rounded-2xl border border-slate-100 text-slate-400 hover:text-sky-500 transition-all"
                  onClick={() => setActiveScenario(prev => (prev + 1) % SCENARIOS.length)}
                >
                  <X className="w-6 h-6 -rotate-90" />
                </div>
              </div>

              {/* Interactive Scenario Display */}
              <div className="relative min-h-[500px] md:min-h-[400px]">
                {SCENARIOS.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform flex flex-col lg:flex-row items-center gap-8 lg:gap-12 
                      ${idx === activeScenario ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'}`}
                  >
                    {/* Condition Icon (Left) */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                      <div className={`w-24 h-24 md:w-32 md:h-32 ${SCENARIO_COLORS[s.color].bg} rounded-[2.5rem] border ${SCENARIO_COLORS[s.color].border} flex items-center justify-center text-5xl md:text-6xl shadow-inner`}>
                        {s.emoji}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900">{s.title}</h3>
                      <p className="text-slate-500 font-bold max-w-sm leading-relaxed italic">
                        "{s.scenario}"
                      </p>
                    </div>

                    {/* Journey Timeline (Center) */}
                    <div className="flex-[2] w-full py-8">
                      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
                        {s.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-center gap-3 bg-white lg:bg-transparent px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 delay-[${sIdx * 200}ms]
                              ${sIdx === 0 ? 'bg-sky-500 text-white border-sky-200' : 'bg-white text-slate-400 border-slate-100 shadow-sm'}`}>
                              {sIdx + 1}
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest whitespace-nowrap">
                              {step}
                            </span>
                            {sIdx < s.steps.length - 1 && (
                              <div className="lg:hidden h-6 w-0.5 bg-slate-100" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outcome Card (Right) */}
                    <div className="flex-1 w-full">
                      <div className={`card p-8 ${SCENARIO_COLORS[s.color].bg} ${SCENARIO_COLORS[s.color].border} shadow-xl relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl ${SCENARIO_COLORS[s.color].icon} transform rotate-12`}>
                          <CheckCircle2 />
                        </div>
                        <div className="relative z-10">
                          <div className={`inline-block px-3 py-1 rounded-full ${SCENARIO_COLORS[s.color].badge} text-white text-[10px] font-black uppercase tracking-widest mb-4`}>
                            Outcome
                          </div>
                          <p className={`${SCENARIO_COLORS[s.color].text} font-black text-lg leading-snug`}>
                            {s.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicators */}
              <div className="flex justify-center gap-3 mt-12">
                {SCENARIOS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScenario(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === activeScenario ? 'w-8 bg-sky-500' : 'w-2 bg-slate-200'}`}
                    aria-label={`Go to scenario ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Workflow Simulation */}
        <section ref={workflowRef} className="py-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24 animate-fade-slide">
              <div className="section-tag mx-auto mb-6 text-emerald-600 bg-emerald-50 border-emerald-100">Workflow</div>
              <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
                From Silence to Safety. <span className="text-sky-500 italic block mt-2">The 10-Second Bridge to Life-Saving Care.</span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* Left Side: Steps (Connected Vertical Flow) */}
              <div className="order-2 lg:order-1 flex-1 w-full max-w-sm">
                <div className="relative space-y-12">
                  <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-slate-100 -z-0" />
                  {[
                    { title: 'Create Profile', desc: 'Secure medical vault with emergency data.', icon: <User className="w-5 h-5"/> },
                    { title: 'Generate QR', desc: 'Offline First. Ready Anytime.', icon: <QrCode className="w-5 h-5"/> },
                    { title: 'Anyone Scans', desc: 'No App Required. Scan and assist.', icon: <Camera className="w-5 h-5"/> },
                    { title: 'Instant Help', desc: 'Critical info available instantly.', icon: <CheckCircle2 className="w-5 h-5"/> }
                  ].map((step, i) => (
                    <div key={i} className={`flex items-start gap-8 relative z-10 transition-all duration-500 ${workflowStep === i ? 'opacity-100 translate-x-2' : 'opacity-30 translate-x-0'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-[#FCFCFA] shadow-md transition-all ${workflowStep === i ? 'bg-sky-500 text-white scale-110 shadow-sky-200' : 'bg-white text-slate-300'}`}>
                        {step.icon}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-black text-slate-900 text-lg">{step.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center: Smartphone Mockup */}
              <div className="order-1 lg:order-2 flex-1 flex justify-center scale-90 sm:scale-100">
                <div className="relative w-[280px] h-[520px] bg-slate-900 rounded-[3rem] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-[8px] border-slate-800">
                  <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative">
                    {/* Step 1: Create Profile */}
                    <div className={`absolute inset-0 p-6 flex flex-col items-center justify-center transition-all duration-700 bg-white ${workflowStep === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                        <User className="text-sky-600" />
                      </div>
                      <div className="w-full space-y-2 px-4">
                        <div className="h-3 w-3/4 bg-slate-100 rounded animate-pulse" />
                        <div className="h-3 w-full bg-slate-100 rounded animate-pulse delay-75" />
                        <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse delay-150" />
                      </div>
                      <div className="mt-8 bg-sky-500 text-white text-[10px] font-black px-4 py-2 rounded-xl tracking-widest">SAVING SECURELY...</div>
                    </div>

                    {/* Step 2: Generate QR */}
                    <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center transition-all duration-700 bg-white ${workflowStep === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="p-4 bg-white border-4 border-slate-900 rounded-3xl mb-6 shadow-xl">
                        <QrCode className="w-24 h-24 text-slate-900" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-black text-slate-900 mb-1">OFFLINE FIRST</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ready Anytime</div>
                      </div>
                    </div>

                    {/* Step 3: Scan */}
                    <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center transition-all duration-700 bg-slate-900 ${workflowStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="relative">
                        <QrCode className="w-24 h-24 text-white/20" />
                        <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl animate-pulse" />
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[scan_2s_linear_infinite]" />
                      </div>
                      <div className="mt-10 flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30">
                        <Camera className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SCANNING...</span>
                      </div>
                    </div>

                    {/* Step 4: Help */}
                    <div className={`absolute inset-0 p-5 flex flex-col bg-white transition-all duration-700 ${workflowStep === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="flex items-center gap-3 mb-4 p-3 bg-rose-50 rounded-2xl">
                        <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white">🚨</div>
                        <div className="text-[10px] font-black text-rose-600 uppercase">Emergency Active</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          'Medical Information Available',
                          'Emergency Contacts Available',
                          'Communication Assistance Ready'
                        ].map((text, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-700">{text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto bg-emerald-500 text-white text-center py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 tracking-widest">
                        HELP ENABLED
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Phone Elements */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-20" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-slate-300 rounded-full z-20" />
                </div>
              </div>

              {/* Right Side: Glassmorphism Info Cards (Desktop) */}
              <div className="hidden lg:flex flex-1 flex-col gap-6">
                <div className={`card p-8 bg-white/40 backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-700 ${workflowStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                      <Shield className="text-white w-5 h-5" />
                    </div>
                    <h5 className="font-black text-slate-900">Safety Enabled</h5>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    The bridge between silence and safety is built in seconds. Responders gain instant, actionable insight without barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#0f2b3d,transparent)] opacity-70" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <span className="inline-block text-sky-300 text-sm font-black uppercase tracking-widest bg-sky-900/40 rounded-full px-4 py-1 mb-4">
                Why SilentSOS
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Advanced features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300">real emergencies</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'QR Emergency Card', desc: 'Printable card works offline, any smartphone camera reads instantly.', color: 'sky', icon: 'M5 5h14v14H5zM12 8v8M8 12h8' },
                { title: 'Symbol Communicator', desc: 'Big tap-to-speak icons: patient taps, phone speaks aloud their needs.', color: 'emerald', icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
                { title: 'Zero Setup to Scan', desc: 'No app download needed. Opens in any browser. Universal access.', color: 'violet', icon: 'M3 12h18M12 3v18M8 8l8 8M16 8l-8 8' },
                { title: 'AI Plain Language', desc: 'Medical jargon auto-converted to simple instructions for first responders.', color: 'amber', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14M5 12h14M5 17h10' },
                { title: 'Multi-Language', desc: 'Emergency info displays in the patient\'s preferred language instantly.', color: 'rose', icon: 'M3 5h18M3 12h18M3 19h18' },
                { title: 'Hospital Handoff', desc: 'Printable summary sheet for ER doctors — one page, everything needed.', color: 'pink', icon: 'M22 12h-4M6 12H2M12 2v4M12 18v4' },
              ].map((f) => (
                <div
                  key={f.title}
                  className="feature-card group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex gap-4 items-start">
                    <div className={`bg-${f.color}-500/20 p-3 rounded-xl group-hover:bg-${f.color}-500 transition-all`}>
                      <svg className={`w-7 h-7 text-${f.color}-300 group-hover:text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d={f.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{f.title}</h3>
                      <p className="text-slate-300 text-sm">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 px-6 text-center relative">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-12 border border-slate-100">
            <h2 className="text-5xl font-black text-slate-900 mb-4">
              Set up in <span className="text-sky-500">2 minutes.</span> <br /> Forever free.
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
              No hidden fees. No credit card. Just lifesaving infrastructure.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-slate-900 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-slate-200 transition hover:shadow-sky-200 hover:bg-slate-800 hover:-translate-y-0.5"
            >
              Start Your First Profile
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <p className="text-xs text-slate-400 mt-6">
              Join 1,200+ caregivers already protecting their loved ones
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-10 text-center bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <span className="font-black">SilentSOS</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}