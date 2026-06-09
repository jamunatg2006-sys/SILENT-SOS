import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-sky-100">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Silent<span className="text-sky-500">SOS</span></span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500">Free for caregivers, always</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', icon: <User className="w-4 h-4 text-slate-400" />, type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email', icon: <Mail className="w-4 h-4 text-slate-400" />, type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', icon: <Lock className="w-4 h-4 text-slate-400" />, type: 'password', placeholder: '6+ characters' },
            ].map(({ key, label, icon, type, placeholder }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>
                  <input type={type} className="input-field pl-11" placeholder={placeholder}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-60">
              {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}