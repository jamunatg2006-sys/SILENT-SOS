import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, PhoneCall, CheckCircle2, User, XCircle, Home } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ConnectPage() {
  const { qrId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasConnected, setHasConnected] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch minimal profile data to get contact info and name
    api.get(`/emergency/${qrId}`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Profile not found or inactive. Cannot connect.');
        setLoading(false);
      });
  }, [qrId]);

  const primaryContact = profile?.emergencyContacts?.find(c => c.isPrimary) || profile?.emergencyContacts?.[0];

  const sendStatusUpdate = async () => {
    if (!statusMessage.trim()) {
      toast.error('Please type a message first.');
      return;
    }
    setLoading(true);
    try {
      // Assuming emergency log ID is available from the initial scan of EmergencyView
      // For this page, we might just log a new event or rely on initial EmergencyView's log
      // A more robust solution would pass logId to this page. For now, we'll try to find a recent log.
      const logId = profile.logId; // This assumes logId is passed from EmergencyView to ConnectPage
                                   // or fetched again from the backend for the most recent scan.
                                   // For simplicity, we'll assume profile.logId exists.
      
      if (!logId) {
        toast.error('Could not find active emergency log. Please go back to the Emergency Profile page.');
        setLoading(false);
        return;
      }

      await api.post(`/emergency/${qrId}/note`, { logId, note: statusMessage });
      setHasConnected(true);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <p className="text-slate-500 font-semibold">Loading connection options...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 text-center px-6">
      <div className="card p-8 bg-rose-50 border-rose-100">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-rose-800 mb-2">Error</h2>
        <p className="text-rose-700">Profile not found or inactive. Cannot connect.</p>
        <Link to={`/emergency/${qrId}`} className="btn-outline mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50 px-6 py-10">
      {/* Success Flash Overlay */}
      {showFlash && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/20 backdrop-blur-md pointer-events-none flex items-center justify-center p-6">
          <div className="bg-emerald-500 text-white px-8 py-5 rounded-[2rem] shadow-2xl font-black text-xl flex items-center gap-4 animate-zoom-in">
            <CheckCircle2 className="w-10 h-10" /> MESSAGE SENT SUCCESSFULLY!
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"> {/* This was already slate-500 */}
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 font-semibold transition-colors">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Connect with Caregiver</h1>
        <p className="text-slate-500 mb-8">Inform {profile?.name}’s family that you're assisting.</p>

        {primaryContact ? (
          <div className="card p-6 space-y-5">
            <div className="text-center">
              <User className="w-16 h-16 text-sky-500 mx-auto mb-3" /> {/* This was already sky-500 */}
              <h3 className="text-2xl font-black text-slate-900">{primaryContact.name}</h3>
              <p className="text-sm text-slate-500">{primaryContact.relationship} {profile?.name}</p>
            </div>

            <a href={`tel:${primaryContact.phone}`} className="w-full btn-primary flex items-center justify-center gap-3 text-lg py-4">
              <PhoneCall className="w-5 h-5" /> Call Caregiver
            </a>

            <div className="pt-5 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-black text-slate-900">Or Send a Quick Update:</h4>
              <textarea
                className="input-field w-full h-24"
                placeholder={`"I've found ${profile?.name} and they are safe at [location]. Waiting for help."`}
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
              />
              <button onClick={sendStatusUpdate} disabled={!statusMessage.trim() || hasConnected}
                className={`w-full ${hasConnected ? 'bg-emerald-500' : 'btn-primary'} py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50`}>
                {hasConnected ? <><CheckCircle2 className="w-4 h-4" /> Message Sent!</> : <><MessageSquare className="w-4 h-4" /> Send Message</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 bg-amber-50 border-amber-100 text-center">
            <XCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-black text-amber-800 mb-2">No Primary Contact Found</h2>
            <p className="text-amber-700">The caregiver has not specified a primary contact. Please use the SOS Alert or call emergency services.</p>
          </div>
        )}
      </div>
    </div>
  );
}