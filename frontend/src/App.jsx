import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Services from './pages/Services';
import Emergency from './pages/Emergency';
import UserPortal from './pages/UserPortal';
import DoctorPortal from './pages/DoctorPortal';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorLocations from './pages/DoctorLocations';
import DoctorSchedule from './pages/DoctorSchedule';
import HospitalPortal from './pages/HospitalPortal';
import RoleSelection from './pages/RoleSelection';
import AuthSuccess from './pages/AuthSuccess';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('hospitalId');
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    setUser(null);
  };

  // Role-based redirect function
  const getRoleBasedRedirect = () => {
    if (!user) return '/';
    const role = user.role?.toLowerCase();
    switch (role) {
      case 'doctor': return '/doctor-portal';
      case 'hospital': return '/hospital-portal';
      case 'user':
      case 'patient':
        return '/user-portal';
      default: return '/user-portal'; // Default to user portal
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Toaster position="top-right" />
          <Navbar user={user} onLogout={handleLogout} />
          <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to={getRoleBasedRedirect()} /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to={getRoleBasedRedirect()} /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/select-role" 
              element={user ? <Navigate to={getRoleBasedRedirect()} /> : <RoleSelection onLogin={handleLogin} />} 
            />
            <Route 
              path="/auth-success" 
              element={user ? <Navigate to={getRoleBasedRedirect()} /> : <AuthSuccess onLogin={handleLogin} />} 
            />
            
            {/* Public routes - accessible to everyone */}
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/services" element={<Services />} />
            <Route path="/emergency" element={<Emergency />} />
            
            {/* Protected role-based routes */}
            <Route 
              path="/user-portal" 
              element={
                <ProtectedRoute user={user} allowedRoles={['user', 'patient']}>
                  <UserPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-portal" 
              element={
                <ProtectedRoute user={user} allowedRoles={['doctor']}>
                  <DoctorPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-portal/appointments" 
              element={
                <ProtectedRoute user={user} allowedRoles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-portal/locations" 
              element={
                <ProtectedRoute user={user} allowedRoles={['doctor']}>
                  <DoctorLocations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-portal/schedule" 
              element={
                <ProtectedRoute user={user} allowedRoles={['doctor']}>
                  <DoctorSchedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital-portal" 
              element={
                <ProtectedRoute user={user} allowedRoles={['hospital']}>
                  <HospitalPortal />
                </ProtectedRoute>
              } 
            />
          </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;