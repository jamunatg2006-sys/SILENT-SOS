import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, LayoutDashboard, Plus, Menu, X, Home, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-sky-100 shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Silent<span className="text-sky-500">SOS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-xl hover:bg-sky-50 transition-all">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-xl hover:bg-sky-50 transition-all">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/caregiver-db" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-xl hover:bg-sky-50 transition-all">
            <BarChart3 className="w-4 h-4" /> Caregiver-DB
          </Link>
          <Link to="/profiles/new" className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl transition-all">
            <Plus className="w-4 h-4" /> New Profile
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"> {/* This was already Logout */}
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent active:border-slate-100 active:bg-slate-50">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bottom-0 z-[100] w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-8 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto h-[calc(100dvh-72px)]">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
            <Home className="w-5 h-5 text-sky-500" /> Home
          </Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-sky-500" /> Dashboard
          </Link>
          <Link to="/caregiver-db" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-sky-500" /> Caregiver-DB
          </Link>
          <Link to="/profiles/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-base font-bold text-slate-700 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
            <Plus className="w-5 h-5 text-sky-500" /> New Profile
          </Link>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-slate-700 truncate max-w-[150px]">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 font-bold p-3 hover:bg-rose-50 rounded-2xl transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
