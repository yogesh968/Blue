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
      const response = await fetch('http://localhost:3001/api/auth/google/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, role: selectedRole })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        onLogin(data.user);
        
        // Redirect based on role
        if (data.user.role === 'DOCTOR') {
          navigate('/doctor-portal');
        } else if (data.user.role === 'PATIENT') {
          navigate('/user-portal');
        } else if (data.user.role === 'HOSPITAL') {
          navigate('/hospital-portal');
        } else {
          navigate('/');
        }
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
          <h1>Select Your Role</h1>
          <p>Choose how you want to use HealthCare+</p>
        </div>

        <form onSubmit={handleSubmit} className="role-selection-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="role-options">
            <label className={`role-option ${selectedRole === 'PATIENT' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="PATIENT"
                checked={selectedRole === 'PATIENT'}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <div className="role-content">
                <span className="role-icon"><FaUser /></span>
                <div>
                  <div className="role-title">Patient</div>
                  <div className="role-desc">Book appointments & manage health records</div>
                </div>
              </div>
            </label>

            <label className={`role-option ${selectedRole === 'DOCTOR' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="DOCTOR"
                checked={selectedRole === 'DOCTOR'}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <div className="role-content">
                <span className="role-icon"><FaUserMd /></span>
                <div>
                  <div className="role-title">Doctor</div>
                  <div className="role-desc">Provide medical consultations & manage appointments</div>
                </div>
              </div>
            </label>

            <label className={`role-option ${selectedRole === 'HOSPITAL' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="HOSPITAL"
                checked={selectedRole === 'HOSPITAL'}
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <div className="role-content">
                <span className="role-icon"><FaHospital /></span>
                <div>
                  <div className="role-title">Hospital</div>
                  <div className="role-desc">Manage hospital operations & staff</div>
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