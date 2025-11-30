import React from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <div className="doctor-avatar">{doctor.image}</div>
        <div className="doctor-status">
          <span className={`status-badge ${doctor.available ? 'available' : 'busy'}`}>
            {doctor.available ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>
      
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <p className="doctor-experience">{doctor.experience}</p>
        <p className="doctor-hospital">{doctor.hospital}</p>
      </div>
      
      <div className="doctor-rating">
        <span className="rating-stars">⭐ {doctor.rating}</span>
        <span className="rating-count">({doctor.reviews} reviews)</span>
      </div>
      
      <div className="doctor-fee">
        <span className="fee-label">Consultation Fee</span>
        <span className="fee-amount">₹{doctor.fee}</span>
      </div>
      
      <div className="doctor-actions">
        <button className="btn btn-secondary">View Profile</button>
        <button className="btn btn-primary">Book Appointment</button>
      </div>
    </div>
  );
};

export default DoctorCard;