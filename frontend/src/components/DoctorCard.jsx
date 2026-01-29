import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';

import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="doctor-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="doctor-header">
        <motion.div
          className="doctor-avatar"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {doctor.image}
        </motion.div>
        <div className="doctor-status">
          <motion.span
            className={`status-badge ${doctor.available ? 'available' : 'busy'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
          >
            <div className={`status-dot ${doctor.available ? 'available' : 'busy'}`}></div>
            {doctor.available ? 'Available' : 'Busy'}
          </motion.span>
        </div>
      </div>

      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <div className="doctor-details">
          <div className="detail-item">
            <Clock size={14} />
            <span>{doctor.experience}</span>
          </div>
          <div className="detail-item">
            <MapPin size={14} />
            <span>{doctor.hospital}</span>
          </div>
        </div>
      </div>

      <div className="doctor-rating">
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(doctor.rating) ? 'filled' : 'empty'}
            />
          ))}
          <span className="rating-value">{doctor.rating}</span>
        </div>
        <span className="rating-count">({doctor.reviews} reviews)</span>
      </div>

      <div className="doctor-fee">
        <span className="fee-label">Consultation Fee</span>
        <span className="fee-amount">₹{doctor.fee}</span>
      </div>

      <div className="doctor-actions">
        <motion.button
          className="btn btn-secondary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/doctors/${doctor.id}`);
          }}
        >
          View Profile
        </motion.button>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
          <ArrowRight size={16} className="ml-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;