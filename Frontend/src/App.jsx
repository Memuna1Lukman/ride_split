import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
