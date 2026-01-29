import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Emergency.css';

const Emergency = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    condition: ''
  });
  const [isRequestingAmbulance, setIsRequestingAmbulance] = useState(false);

  const emergencyServices = [
    {
      id: 1,
      type: 'Ambulance',
      icon: '🚑',
      description: 'Emergency medical transport',
      phone: '108',
      available: true
    },
    {
      id: 2,
      type: 'Fire Department',
      icon: '🚒',
      description: 'Fire and rescue services',
      phone: '101',
      available: true
    },
    {
      id: 3,
      type: 'Police',
      icon: '🚔',
      description: 'Emergency police assistance',
      phone: '100',
      available: true
    }
  ];

  const nearbyHospitals = [
    {
      id: 1,
      name: 'Apollo Emergency',
      distance: '2.3 km',
      eta: '8 mins',
      beds: 'Available',
      phone: '+91-9876543210'
    },
    {
      id: 2,
      name: 'Max Hospital Emergency',
      distance: '3.1 km',
      eta: '12 mins',
      beds: 'Limited',
      phone: '+91-9876543211'
    },
    {
      id: 3,
      name: 'Fortis Emergency Care',
      distance: '4.5 km',
      eta: '15 mins',
      beds: 'Available',
      phone: '+91-9876543212'
    }
  ];

  const handleEmergencyCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleAmbulanceRequest = async () => {
    if (!location || !emergencyType || !patientInfo.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsRequestingAmbulance(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('🚑 Ambulance dispatched! ETA: 8-12 minutes');
      toast.success('📞 Emergency contact will call you shortly');

      // Reset form
      setLocation('');
      setEmergencyType('');
      setPatientInfo({ name: '', age: '', condition: '' });

    } catch (error) {
      toast.error('Failed to request ambulance. Please call 108 directly.');
    } finally {
      setIsRequestingAmbulance(false);
    }
  };

  const handleHospitalDirections = (hospitalName) => {
    const query = encodeURIComponent(`${hospitalName} hospital near me`);
    window.open(`https://maps.google.com/search/${query}`, '_blank');
  };

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <div className="container">
          <div className="emergency-alert">
            <span className="alert-icon">🚨</span>
            <div>
              <h1>Emergency Services</h1>
              <p>Get immediate medical assistance - Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <div className="emergency-content">
        <div className="container">
          <div className="emergency-grid">
            {/* Quick Actions */}
            <div className="emergency-section">
              <h2>Emergency Contacts</h2>
              <div className="emergency-services">
                {emergencyServices.map(service => (
                  <div key={service.id} className="service-card">
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-info">
                      <h3>{service.type}</h3>
                      <p>{service.description}</p>
                      <div className="service-phone">{service.phone}</div>
                    </div>
                    <button
                      onClick={() => handleEmergencyCall(service.phone)}
                      className="btn btn-emergency"
                    >
                      Call Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambulance Request */}
            <div className="emergency-section">
              <h2>Request Ambulance</h2>
              <div className="ambulance-form">
                <div className="form-group">
                  <label>Current Location</label>
                  <input
                    type="text"
                    placeholder="Enter your current address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Type</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                  >
                    <option value="">Select emergency type</option>
                    <option value="cardiac">Cardiac Emergency</option>
                    <option value="accident">Accident/Trauma</option>
                    <option value="breathing">Breathing Difficulty</option>
                    <option value="stroke">Stroke</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    placeholder="Patient's name"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <input
                      type="text"
                      placeholder="Brief condition"
                      value={patientInfo.condition}
                      onChange={(e) => setPatientInfo({ ...patientInfo, condition: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAmbulanceRequest}
                  disabled={isRequestingAmbulance}
                  className="btn btn-primary btn-large"
                >
                  {isRequestingAmbulance ? '⏳ Requesting...' : '🚑 Request Ambulance'}
                </button>
              </div>
            </div>

            {/* Nearby Hospitals */}
            <div className="emergency-section">
              <h2>Nearby Emergency Hospitals</h2>
              <div className="hospitals-list">
                {nearbyHospitals.map(hospital => (
                  <div key={hospital.id} className="hospital-item">
                    <div className="hospital-info">
                      <h4>{hospital.name}</h4>
                      <div className="hospital-details">
                        <span>📍 {hospital.distance}</span>
                        <span>⏱️ {hospital.eta}</span>
                        <span className={`beds ${hospital.beds.toLowerCase()}`}>
                          🛏️ {hospital.beds}
                        </span>
                      </div>
                    </div>
                    <div className="hospital-actions">
                      <button
                        onClick={() => handleEmergencyCall(hospital.phone)}
                        className="btn btn-secondary"
                      >
                        📞 Call
                      </button>
                      <button
                        onClick={() => handleHospitalDirections(hospital.name)}
                        className="btn btn-primary"
                      >
                        🗺️ Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Tips */}
          <div className="emergency-tips">
            <h2>Emergency First Aid Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>💔 Heart Attack</h4>
                <p>Call 108 immediately. Give aspirin if available. Keep patient calm and seated.</p>
              </div>
              <div className="tip-card">
                <h4>🩸 Severe Bleeding</h4>
                <p>Apply direct pressure to wound. Elevate injured area above heart level if possible.</p>
              </div>
              <div className="tip-card">
                <h4>🫁 Choking</h4>
                <p>Perform Heimlich maneuver. Call for help if person becomes unconscious.</p>
              </div>
              <div className="tip-card">
                <h4>🔥 Burns</h4>
                <p>Cool with running water for 10-20 minutes. Do not apply ice or butter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;