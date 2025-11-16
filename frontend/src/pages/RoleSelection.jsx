import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Stethoscope, Building2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './RoleSelection.css';

const RoleSelection = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const roles = [
    {
      id: 'PATIENT',
      title: 'Patient',
      description: 'Book appointments, manage health records, and access medical services',
      icon: <User size={48} />,
      color: '#3b82f6'
    },
    {
      id: 'DOCTOR',
      title: 'Doctor',
      description: 'Manage appointments, patient records, and provide medical consultations',
      icon: <Stethoscope size={48} />,
      color: '#10b981'
    },
    {
      id: 'HOSPITAL',
      title: 'Hospital',
      description: 'Manage hospital operations, bed bookings, and ambulance services',
      icon: <Building2 size={48} />,
      color: '#f59e0b'
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin && onLogin(data.user);
        toast.success('Registration completed successfully!');
        navigate('/');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-page">
      <Toaster position="top-right" />
      
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>Choose Your Role</h1>
          <p>Select how you'll be using our healthcare platform</p>
        </div>

        <div className="roles-grid">
          {roles.map(role => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.id)}
              style={{ '--role-color': role.color }}
            >
              <div className="role-icon" style={{ color: role.color }}>
                {role.icon}
              </div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <div className="role-selector">
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={selectedRole === role.id}
                  onChange={() => setSelectedRole(role.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="continue-btn"
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
        >
          {loading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;