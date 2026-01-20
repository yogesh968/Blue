import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccess = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the full URL and decode HTML entities
    const fullUrl = window.location.href.replace(/&amp;/g, '&');
    const url = new URL(fullUrl);
    
    const token = url.searchParams.get('token');
    const userParam = url.searchParams.get('user');

    console.log('Token:', token);
    console.log('User param:', userParam);

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        
        onLogin(user);
        
        // Check if there's a pending appointment first
        const pendingAppointment = localStorage.getItem('pendingAppointment');
        if (pendingAppointment) {
          navigate('/doctors');
        } else {
          // Redirect based on role
          if (user.role === 'DOCTOR') {
            navigate('/doctor-portal');
          } else if (user.role === 'PATIENT') {
            navigate('/user-portal');
          } else if (user.role === 'HOSPITAL') {
            navigate('/hospital-portal');
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login?error=auth_failed');
      }
    } else {
      console.error('Missing token or user data');
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate, onLogin]);

  return (
    <div className="auth-success-page">
      <div className="loading-container">
        <h2>Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;