import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, QrCode, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function QRPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profiles/${id}/qr`)
      .then(res => setQr(res.data))
      .catch(() => {
        toast.error('Could not load QR code');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center font-bold text-slate-400">
        Generating QR code...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-sky-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>

        <div className="card p-8 md:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-5">
            <QrCode className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Emergency QR Code</h1>
          <p className="text-slate-500 mt-2 mb-8">Print or share this code so responders can open the emergency profile instantly.</p>

          <div className="inline-flex bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/60 mb-6">
            <img src={qr.qrDataUrl} alt="Emergency profile QR code" className="w-[260px] h-[260px]" />
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Emergency Link</p>
                <a href={qr.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-sky-700 break-all hover:text-sky-500">
                  {qr.url}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={qr.qrDataUrl} download={`silent-sos-${qr.qrId}.png`} className="btn-primary inline-flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download QR
            </a>
            <Link to={`/emergency/${qr.qrId}`} target="_blank" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all">
              <ExternalLink className="w-4 h-4" /> Preview Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
