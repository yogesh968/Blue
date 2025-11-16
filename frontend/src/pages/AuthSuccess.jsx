import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const AuthSuccess = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onLogin && onLogin(user);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate, onLogin]);

  return (
    <div className="auth-success-page">
      <div className="auth-success-container">
        <CheckCircle size={64} className="success-icon" />
        <h1>Login Successful!</h1>
        <p>Redirecting you to the dashboard...</p>
      </div>
      
      <style jsx>{`
        .auth-success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .auth-success-container {
          background: white;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .success-icon {
          color: #10b981;
          margin-bottom: 1rem;
        }
        
        .auth-success-container h1 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.875rem;
          font-weight: 700;
        }
        
        .auth-success-container p {
          margin: 0;
          color: #6b7280;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;