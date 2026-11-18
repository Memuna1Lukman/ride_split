import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import RideRequestPage from "./pages/RideRequestPage";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/request-ride" element={<ProtectedRoute><RideRequestPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
