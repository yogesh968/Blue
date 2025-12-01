import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaHospital className="logo-icon" />
          <span className="logo-text">HealthCare+</span>
        </Link>

        <div className="nav-links">
          {user && (user.role === 'doctor' || user.role === 'DOCTOR') ? (
            <>
              <Link to="/doctor-portal" className="nav-link">Dashboard</Link>
              <Link to="/doctor-portal#appointments" className="nav-link">Appointments</Link>
              <Link to="/doctor-portal#locations" className="nav-link">My Locations</Link>
              <Link to="/doctor-portal#schedule" className="nav-link">Schedule</Link>
            </>
          ) : user && (user.role === 'hospital' || user.role === 'HOSPITAL') ? (
            <>
              <Link to="/hospital-portal" className="nav-link">Dashboard</Link>
              <Link to="/hospital-portal#doctors" className="nav-link">Doctors</Link>
              <Link to="/hospital-portal#beds" className="nav-link">Beds</Link>
              <Link to="/hospital-portal#ambulances" className="nav-link">Ambulances</Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/doctors" className="nav-link">Doctors</Link>
              <Link to="/hospitals" className="nav-link">Hospitals</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/emergency" className="nav-link nav-emergency">Emergency</Link>
            </>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.role === 'DOCTOR' || user.role === 'doctor' ? 'Dr. ' : ''}{user.name}</span>
              <span className="user-role">({user.role})</span>
              <button onClick={onLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          {user && (user.role === 'doctor' || user.role === 'DOCTOR') ? (
            <>
              <Link to="/doctor-portal" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/doctor-portal#appointments" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Appointments</Link>
              <Link to="/doctor-portal#locations" className="mobile-link" onClick={() => setIsMenuOpen(false)}>My Locations</Link>
              <Link to="/doctor-portal#schedule" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Schedule</Link>
            </>
          ) : user && (user.role === 'hospital' || user.role === 'HOSPITAL') ? (
            <>
              <Link to="/hospital-portal" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/hospital-portal#doctors" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Doctors</Link>
              <Link to="/hospital-portal#beds" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Beds</Link>
              <Link to="/hospital-portal#ambulances" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Ambulances</Link>
            </>
          ) : (
            <>
              <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/doctors" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Doctors</Link>
              <Link to="/hospitals" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Hospitals</Link>
              <Link to="/services" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link to="/emergency" className="mobile-link emergency" onClick={() => setIsMenuOpen(false)}>Emergency</Link>
            </>
          )}
          
          <div className="mobile-auth">
            {user ? (
              <button onClick={onLogout} className="btn btn-secondary">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;