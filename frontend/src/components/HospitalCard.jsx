import React from 'react';
import './HospitalCard.css';

const HospitalCard = ({ hospital }) => {
  return (
    <div className="hospital-card">
      <div className="hospital-header">
        <div className="hospital-image">{hospital.image}</div>
        <div className="hospital-badges">
          {hospital.emergency && <span className="badge emergency">24/7 Emergency</span>}
          {hospital.ambulance && <span className="badge ambulance">Ambulance</span>}
        </div>
      </div>
      
      <div className="hospital-info">
        <h3 className="hospital-name">{hospital.name}</h3>
        <p className="hospital-address">{hospital.address}</p>
        
        <div className="hospital-rating">
          <span className="rating-stars">⭐ {hospital.rating}</span>
          <span className="rating-count">({hospital.reviews} reviews)</span>
        </div>
        
        <div className="hospital-specialties">
          <h4>Specialties:</h4>
          <div className="specialties-list">
            {hospital.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="specialty-tag">{specialty}</span>
            ))}
            {hospital.specialties.length > 3 && (
              <span className="specialty-more">+{hospital.specialties.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="hospital-beds">
          <div className="bed-info">
            <span className="bed-label">Available Beds:</span>
            <span className={`bed-count ${hospital.availableBeds > 20 ? 'high' : hospital.availableBeds > 10 ? 'medium' : 'low'}`}>
              {hospital.availableBeds}/{hospital.beds}
            </span>
          </div>
        </div>
      </div>
      
      <div className="hospital-actions">
        <button className="btn btn-secondary">View Details</button>
        <button className="btn btn-primary">Book Bed</button>
      </div>
    </div>
  );
};

export default HospitalCard;