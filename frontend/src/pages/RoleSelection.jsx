import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaUser, FaUserMd, FaHospital } from 'react-icons/fa';
import './RoleSelection.css';

const RoleSelection = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blue-1-makf.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/auth/google/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Force role to PATIENT
        body: JSON.stringify({ token, role: 'PATIENT' })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);

        onLogin(data.user);

        // Always redirect to user portal
        navigate('/user-portal');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>Welcome to BlueVitals</h1>
          <p>Complete your registration as a Patient</p>
        </div>

        <form onSubmit={handleSubmit} className="role-selection-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="role-options">
            <label className={`role-option selected`}>
              <input
                type="radio"
                name="role"
                value="PATIENT"
                checked={true}
                readOnly
              />
              <div className="role-content">
                <span className="role-icon"><FaUser /></span>
                <div>
                  <div className="role-title">Patient</div>
                  <div className="role-desc">Book appointments & manage health records</div>
                </div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-large"
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection;