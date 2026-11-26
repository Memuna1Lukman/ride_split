import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import RideRequestPage from "./pages/RideRequestPage";
import ProfilePage from "./pages/ProfilePage";
import RideDetailsPage from "./pages/RideDetailsPage";
import InvitationsPage from "./pages/InvitationsPage";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import DriverModePage from "./pages/DriverModePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/request-ride" element={<ProtectedRoute><RideRequestPage /></ProtectedRoute>} />
          <Route path="/rides/:rideId" element={<ProtectedRoute><RideDetailsPage /></ProtectedRoute>} />
          <Route path="/invitations" element={<ProtectedRoute><InvitationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/drive" element={<ProtectedRoute><DriverModePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
