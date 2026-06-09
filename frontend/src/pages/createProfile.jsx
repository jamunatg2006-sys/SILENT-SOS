import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Phone, Plus, Save, Trash2, User, Smile, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const CONDITIONS_LIST = ['Autism Spectrum Disorder', 'Cerebral Palsy', 'Stroke', 'Speech Impairment', 'Dementia', 'Down Syndrome', 'Epilepsy', 'Other'];

const STEPS = [
  { id: 1, label: 'Basic', icon: <User className="w-3 h-3" /> },
  { id: 2, label: 'Medical', icon: <Heart className="w-3 h-3" /> },
  { id: 3, label: 'Contacts', icon: <Phone className="w-3 h-3" /> },
  { id: 4, label: 'Communication', icon: <Smile className="w-3 h-3" /> },
];

const initialForm = {
  name: '', age: '', photo: '', bloodGroup: 'Unknown', preferredLanguage: 'English',
  conditions: [],
  allergies: [{ name: '', severity: 'moderate', reaction: '' }],
  medications: [{ name: '', dosage: '', frequency: '' }],
  emergencyContacts: [{ name: '', phone: '', relationship: 'Caregiver', isPrimary: true }],
  calmTriggers: [''],
  avoidTriggers: [''],
  communicationNotes: '',
  whatsappSosEnabled: true
};

export default function CreateProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const addItem = (key, template) => update(key, [...form[key], template]);
  const removeItem = (key, idx) => update(key, form[key].filter((_, i) => i !== idx));
  const updateItem = (key, idx, field, val) => {
    const arr = [...form[key]];
    arr[idx] = { ...arr[idx], [field]: val };
    update(key, arr);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        calmTriggers: form.calmTriggers.filter(Boolean),
        avoidTriggers: form.avoidTriggers.filter(Boolean),
        allergies: form.allergies.filter(item => item.name),
        medications: form.medications.filter(item => item.name),
        emergencyContacts: form.emergencyContacts.filter(item => item.name && item.phone)
      };

      if (!payload.emergencyContacts.length) {
        toast.error('Add at least one emergency contact');
        setLoading(false);
        return;
      }

      const res = await api.post('/profiles', payload);
      toast.success('Profile created successfully!');
      navigate(`/profiles/${res.data.profile._id}/qr`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Create Profile</h1>
        <p className="text-slate-500 mb-8">Build an emergency identity card for your patient</p>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {STEPS.map(s => (
            <button key={s.id} onClick={() => step > s.id && setStep(s.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold transition-all
                ${step === s.id ? 'bg-sky-500 text-white shadow-md' : step > s.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="card p-8 animate-slide-up">

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Basic Information</h2>
              <div>
                <label className="label">Full Name *</label>
                <input className="input-field" placeholder="Patient's full name"
                  value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Age *</label>
                  <input className="input-field" type="number" placeholder="e.g. 16"
                    value={form.age} onChange={e => update('age', e.target.value)} />
                </div>
                <div>
                  <label className="label">Blood Group</label>
                  <select className="input-field" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Preferred Language</label>
                <select className="input-field" value={form.preferredLanguage} onChange={e => update('preferredLanguage', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Conditions (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS_LIST.map(c => (
                    <button key={c} type="button"
                      onClick={() => update('conditions', form.conditions.includes(c) ? form.conditions.filter(x => x !== c) : [...form.conditions, c])}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all
                        ${form.conditions.includes(c) ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Medical */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Medical Details</h2>

              {/* Allergies — DSA priority sorted on backend */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Allergies</label>
                  <button onClick={() => addItem('allergies', { name: '', severity: 'moderate', reaction: '' })}
                    className="text-xs font-bold text-sky-600 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {form.allergies.map((a, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 md:mb-2 border-b md:border-0 pb-4 md:pb-0"> {/* This was already grid-cols-2 */}
                    <input className="input-field col-span-2 text-sm py-2" placeholder="Allergy name"
                      value={a.name} onChange={e => updateItem('allergies', i, 'name', e.target.value)} />
                    <select className="input-field text-sm py-2"
                      value={a.severity} onChange={e => updateItem('allergies', i, 'severity', e.target.value)}>
                      <option value="critical">🔴 Critical</option>
                      <option value="moderate">🟡 Moderate</option>
                      <option value="mild">🟢 Mild</option>
                    </select>
                    <input className="input-field text-sm py-2" placeholder="Reaction"
                      value={a.reaction} onChange={e => updateItem('allergies', i, 'reaction', e.target.value)} />
                    <button onClick={() => removeItem('allergies', i)} className="p-2 text-rose-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Medications</label>
                  <button onClick={() => addItem('medications', { name: '', dosage: '', frequency: '' })}
                    className="text-xs font-bold text-sky-600 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {form.medications.map((m, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 md:mb-2 border-b md:border-0 pb-4 md:pb-0"> {/* This was already grid-cols-2 */}
                    <input className="input-field text-sm py-2" placeholder="Medicine name"
                      value={m.name} onChange={e => updateItem('medications', i, 'name', e.target.value)} />
                    <input className="input-field text-sm py-2" placeholder="Dosage"
                      value={m.dosage} onChange={e => updateItem('medications', i, 'dosage', e.target.value)} />
                    <input className="input-field text-sm py-2" placeholder="Frequency"
                      value={m.frequency} onChange={e => updateItem('medications', i, 'frequency', e.target.value)} />
                    <button onClick={() => removeItem('medications', i)} className="p-2 text-rose-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Contacts */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Emergency Contacts</h2>
              <p className="text-sm text-slate-500">Primary contact appears first on emergency card</p>
              {form.emergencyContacts.map((c, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Contact {i + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={c.isPrimary}
                          onChange={e => updateItem('emergencyContacts', i, 'isPrimary', e.target.checked)} />
                        Primary
                      </label>
                      {i > 0 && <button onClick={() => removeItem('emergencyContacts', i)} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field text-sm py-2" placeholder="Full Name"
                      value={c.name} onChange={e => updateItem('emergencyContacts', i, 'name', e.target.value)} />
                    <input className="input-field text-sm py-2" placeholder="Relationship"
                      value={c.relationship} onChange={e => updateItem('emergencyContacts', i, 'relationship', e.target.value)} />
                    <input className="input-field text-sm py-2 col-span-2" placeholder="Phone Number"
                      value={c.phone} onChange={e => updateItem('emergencyContacts', i, 'phone', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addItem('emergencyContacts', { name: '', phone: '', relationship: '', isPrimary: false })}
                className="w-full border-2 border-dashed border-slate-200 text-slate-500 font-semibold py-3 rounded-2xl hover:border-sky-300 hover:text-sky-600 transition-colors text-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Another Contact
              </button>
            </div>
          )}

          {/* STEP 4: Communication */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Communication Preferences</h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">What calms them 🌿</label>
                  <button onClick={() => update('calmTriggers', [...form.calmTriggers, ''])}
                    className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {form.calmTriggers.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2"> {/* This was already flex */}
                    <input className="input-field text-sm py-2" placeholder="e.g. Soft music, dim lights"
                      value={t} onChange={e => { const a = [...form.calmTriggers]; a[i] = e.target.value; update('calmTriggers', a); }} />
                    {i > 0 && <button onClick={() => update('calmTriggers', form.calmTriggers.filter((_, j) => j !== i))} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">What to avoid ⚠️</label>
                  <button onClick={() => update('avoidTriggers', [...form.avoidTriggers, ''])}
                    className="text-xs font-bold text-rose-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
                {form.avoidTriggers.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2"> {/* This was already flex */}
                    <input className="input-field text-sm py-2" placeholder="e.g. Loud noises, bright lights"
                      value={t} onChange={e => { const a = [...form.avoidTriggers]; a[i] = e.target.value; update('avoidTriggers', a); }} />
                    {i > 0 && <button onClick={() => update('avoidTriggers', form.avoidTriggers.filter((_, j) => j !== i))} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>

              <div>
                <label className="label">Special Notes for Strangers</label>
                <textarea className="input-field" rows={3}
                  placeholder="e.g. Do not touch without warning. Speak slowly and clearly."
                  value={form.communicationNotes} onChange={e => update('communicationNotes', e.target.value)} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 btn-outline py-3">← Back</button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && (!form.name || !form.age)}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 btn-primary py-3 disabled:opacity-60">
                {loading ? 'Creating...' : '✅ Create Profile & Generate QR'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}