import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccess = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle HTML-encoded URLs
    const urlString = window.location.href.replace(/&amp;/g, '&');

    const url = new URL(urlString);
    const token = url.searchParams.get('token');
    const userParam = url.searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);

        onLogin(user);

        // Redirect to user portal
        navigate('/user-portal');
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