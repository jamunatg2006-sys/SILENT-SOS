 import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Printer, ArrowLeft, Shield, Stethoscope, Activity, Heart } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HospitalHandoff() {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/emergency/${qrId}`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load records'); navigate(-1); });
  }, [qrId, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">Generating Clinical Report...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <Printer className="w-4 h-4" /> Print for EMS
          </button>
        </div>

        {/* The Medical Document */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-slate-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-sky-400" />
                <span className="text-2xl font-black tracking-tighter">SilentSOS <span className="text-sky-400">Clinical Handoff</span></span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Report ID</p>
                <p className="text-xs font-mono font-bold">{qrId.substring(0,8).toUpperCase()}</p>
              </div>
            </div>
            <h1 className="text-4xl font-black mb-2">{data.name}</h1>
            <p className="text-sky-200 font-bold uppercase tracking-widest text-sm">Age {data.age} · Blood {data.bloodGroup} · Non-Verbal Profile</p>
          </div>

          <div className="p-10 space-y-10">
            {/* Conditions Section */}
            <section>
              <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-xs mb-4">
                <Activity className="w-4 h-4 text-sky-500" /> Primary Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.conditions?.map(c => (
                  <span key={c} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700">{c}</span>
                ))}
              </div>
            </section>

            {/* Critical Allergies */}
            <section>
              <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-xs mb-4">
                <Heart className="w-4 h-4 text-rose-500" /> Critical Allergies & Reactions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.allergies?.map((a, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex justify-between items-center">
                    <span className="font-black text-rose-900">{a.name}</span>
                    <span className="text-[10px] font-black uppercase bg-rose-200 px-2 py-1 rounded text-rose-700">{a.severity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Medications */}
            <section>
              <h3 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-widest text-xs mb-4">
                <Stethoscope className="w-4 h-4 text-indigo-500" /> Current Medication Regimen
              </h3>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Medication</th>
                      <th className="px-6 py-3">Dosage</th>
                      <th className="px-6 py-3">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-600">
                    {data.medications?.map((m, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="px-6 py-4">{m.name}</td>
                        <td className="px-6 py-4">{m.dosage}</td>
                        <td className="px-6 py-4">{m.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Footer Notice */}
            <div className="pt-10 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic text-center">
                NOTICE: This handoff document was generated via SilentSOS from secure caregiver records. Please verify current vitals and status upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}