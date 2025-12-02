import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'PATIENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLoginMode 
        ? await api.login({ email: formData.email, password: formData.password })
        : await api.register(formData);
      
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        onClose();
      } else {
        setError(data.error || `${isLoginMode ? 'Login' : 'Registration'} failed`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'PATIENT'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isLoginMode ? 'Sign In' : 'Sign Up'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="auth-modal-content">
          <p className="auth-modal-subtitle">
            {isLoginMode ? 'Sign in to book appointments' : 'Create account to get started'}
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {!isLoginMode && (
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="form-group">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            {!isLoginMode && (
              <div className="form-group">
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number (Optional)"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className="toggle-btn">
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;