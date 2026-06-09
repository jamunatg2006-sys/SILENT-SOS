import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, User, Heart, Phone, Plus, Save, ArrowLeft, Pill, Smile } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const CONDITIONS_LIST = ['Autism Spectrum Disorder', 'Cerebral Palsy', 'Stroke', 'Speech Impairment', 'Dementia', 'Down Syndrome', 'Epilepsy', 'Other'];

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', age: '', photo: '', bloodGroup: 'Unknown', preferredLanguage: 'English',
    conditions: [],
    allergies: [],
    medications: [],
    emergencyContacts: [],
    calmTriggers: [],
    avoidTriggers: [],
    communicationNotes: '',
    whatsappSosEnabled: true
  });

  useEffect(() => {
    api.get(`/profiles/${id}`)
      .then(res => {
        const p = res.data.profile;
        setForm({
          ...p,
          allergies: p.allergies?.length ? p.allergies : [{ name: '', severity: 'moderate', reaction: '' }],
          medications: p.medications?.length ? p.medications : [{ name: '', dosage: '', frequency: '' }],
          emergencyContacts: p.emergencyContacts?.length ? p.emergencyContacts : [{ name: '', phone: '', relationship: '', isPrimary: true }],
          calmTriggers: p.calmTriggers?.length ? p.calmTriggers : [''],
          avoidTriggers: p.avoidTriggers?.length ? p.avoidTriggers : [''],
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error('Profile not found');
        navigate('/dashboard');
      });
  }, [id, navigate]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const addItem = (key, template) => update(key, [...form[key], template]);
  const removeItem = (key, idx) => update(key, form[key].filter((_, i) => i !== idx));
  const updateItem = (key, idx, field, val) => {
    const arr = [...form[key]];
    arr[idx] = { ...arr[idx], [field]: val };
    update(key, arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        calmTriggers: form.calmTriggers.filter(Boolean),
        avoidTriggers: form.avoidTriggers.filter(Boolean),
        allergies: form.allergies.filter(a => a.name),
        medications: form.medications.filter(m => m.name),
        emergencyContacts: form.emergencyContacts.filter(c => c.name && c.phone),
      };
      await api.put(`/profiles/${id}`, payload);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-sky-50 flex items-center justify-center font-bold text-slate-400">Syncing profile...</div>;

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-6 pb-32">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-sky-600 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Edit Profile</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4"><User className="w-5 h-5 text-sky-500" /> Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Age</label>
                  <input className="input-field" type="number" value={form.age} onChange={e => update('age', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Blood Group</label>
                  <select className="input-field" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="label">Conditions</label>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS_LIST.map(c => (
                  <button key={c} type="button" onClick={() => update('conditions', form.conditions.includes(c) ? form.conditions.filter(x => x !== c) : [...form.conditions, c])}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${form.conditions.includes(c) ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4"><Heart className="w-5 h-5 text-rose-500" /> Medical Details</h2>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="label mb-0">Allergies</label>
                <button type="button" onClick={() => addItem('allergies', { name: '', severity: 'moderate', reaction: '' })} className="text-xs font-black text-sky-600 uppercase tracking-widest">+ Add</button>
              </div>
              {form.allergies.map((a, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <input className="input-field flex-[2]" placeholder="Allergy" value={a.name} onChange={e => updateItem('allergies', i, 'name', e.target.value)} />
                  <select className="input-field flex-1" value={a.severity} onChange={e => updateItem('allergies', i, 'severity', e.target.value)}>
                    <option value="critical">🔴 Critical</option>
                    <option value="moderate">🟡 Moderate</option>
                  </select>
                  <button type="button" onClick={() => removeItem('allergies', i)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4"><Phone className="w-5 h-5 text-emerald-500" /> Emergency Contacts</h2>
            {form.emergencyContacts.map((c, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Contact {i+1}</span>
                   {i > 0 && <button type="button" onClick={() => removeItem('emergencyContacts', i)} className="text-rose-500 font-bold text-xs">Remove</button>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Name" value={c.name} onChange={e => updateItem('emergencyContacts', i, 'name', e.target.value)} />
                  <input className="input-field" placeholder="Phone" value={c.phone} onChange={e => updateItem('emergencyContacts', i, 'phone', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4"><Smile className="w-5 h-5 text-amber-500" /> Communication</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Calm Triggers</label>
                {form.calmTriggers.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input-field" value={t} onChange={e => { const a = [...form.calmTriggers]; a[i] = e.target.value; update('calmTriggers', a); }} />
                    {i > 0 && <button type="button" onClick={() => update('calmTriggers', form.calmTriggers.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-slate-300" /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => update('calmTriggers', [...form.calmTriggers, ''])} className="text-[10px] font-black uppercase text-sky-600 mt-2">+ Add Trigger</button>
              </div>
              <div>
                <label className="label">Avoid Triggers</label>
                {form.avoidTriggers.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input-field" value={t} onChange={e => { const a = [...form.avoidTriggers]; a[i] = e.target.value; update('avoidTriggers', a); }} />
                    {i > 0 && <button type="button" onClick={() => update('avoidTriggers', form.avoidTriggers.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-slate-300" /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => update('avoidTriggers', [...form.avoidTriggers, ''])} className="text-[10px] font-black uppercase text-rose-600 mt-2">+ Add Trigger</button>
              </div>
            </div>
            <div>
              <label className="label">Special Instructions for Bystanders</label>
              <textarea className="input-field h-32" value={form.communicationNotes} onChange={e => update('communicationNotes', e.target.value)} placeholder="e.g. Do not touch without warning..." />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50">
            <div className="max-w-3xl mx-auto flex gap-4">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
              <button type="submit" disabled={saving} className="flex-[2] bg-sky-500 text-white py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                {saving ? 'Updating...' : <><Save className="w-5 h-5" /> Save Profile Updates</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}