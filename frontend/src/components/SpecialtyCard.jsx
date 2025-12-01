import React from 'react';
import './SpecialtyCard.css';

const SpecialtyCard = ({ specialty, isSelected, onClick, onViewDoctors }) => {
  const handleViewDoctors = (e) => {
    e.stopPropagation();
    if (onViewDoctors) {
      onViewDoctors();
    }
  };

  return (
    <div 
      className={`specialty-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="specialty-icon">{specialty.icon}</div>
      <h3 className="specialty-name">{specialty.name}</h3>
      <p className="specialty-description">{specialty.description}</p>
      <div className="specialty-stats">
        <span className="doctor-count">{specialty.doctors}+ Doctors</span>
      </div>
      <button 
        className="btn btn-primary specialty-btn"
        onClick={handleViewDoctors}
      >
        View Doctors
      </button>
    </div>
  );
};

export default SpecialtyCard;