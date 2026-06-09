import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './components/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import CreateProfile from './pages/createProfile';
import EditProfile from './pages/EditProfile';
import QRPage from './pages/QRpage';
import EmergencyView from './pages/EmergencyView';
import StatusBroadcast from './pages/StatusBroadcast';
import CommunicationBoard from './pages/CommunicationBoard';
import HospitalHandoff from './pages/HospitalHandoff';
import ConnectPage from './pages/ConnectPage';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Wait for auth state to load before deciding to redirect
  if (loading) return <div className="min-h-screen bg-sky-50 flex items-center justify-center text-slate-400 font-semibold uppercase tracking-widest text-xs animate-pulse">Syncing...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If AuthContext is still loading, don't render anything yet to prevent premature redirects
  if (loading) return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">Initializing...</div>
    </div>
  );

  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <> {/* Add a Fragment to wrap multiple elements */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'Outfit', fontWeight: 600, borderRadius: '16px' },
              success: { style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' } },
              error: { style: { background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' } }
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/demo/broadcast" element={<StatusBroadcast />} />
            <Route path="/emergency/:qrId" element={<EmergencyView />} />
            <Route path="/emergency/:qrId/communicate" element={<CommunicationBoard />} />
            <Route path="/emergency/:qrId/handoff" element={<HospitalHandoff />} />
            <Route path="/emergency/:qrId/connect" element={<ConnectPage />} />
            <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
            <Route path="/caregiver-db" element={<PrivateRoute><Navbar /><CaregiverDashboard /></PrivateRoute>} />
            <Route path="/profiles/new" element={<PrivateRoute><Navbar /><CreateProfile /></PrivateRoute>} />
            <Route path="/profiles/:id/edit" element={<PrivateRoute><Navbar /><EditProfile /></PrivateRoute>} />
            <Route path="/profiles/:id/qr" element={<PrivateRoute><Navbar /><QRPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </> {/* Close the Fragment */}
      </BrowserRouter>
    </AuthProvider>
  );
}
