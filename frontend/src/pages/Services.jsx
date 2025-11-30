import React, { useState } from 'react';
import BodyDiagram from '../components/BodyDiagram';
import SpecialtyCard from '../components/SpecialtyCard';
import DoctorCard from '../components/DoctorCard';
import './Services.css';

const Services = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = [
    { 
      id: 1, 
      name: 'Cardiology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#fee2e2" stroke="#fecaca" strokeWidth="2"/>
          <path d="M32 20c-3.314 0-6 2.686-6 6 0 4 6 10 6 10s6-6 6-10c0-3.314-2.686-6-6-6z" fill="#dc2626"/>
          <circle cx="32" cy="26" r="2" fill="#ffffff"/>
          <path d="M26 38h12M29 42h6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ), 
      bodyPart: 'chest', 
      doctors: 150, 
      description: 'Heart and cardiovascular system',
      color: '#ef4444'
    },
    { 
      id: 2, 
      name: 'Neurology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="2"/>
          <path d="M32 16c-8 0-14 6-14 14 0 4 2 8 5 10h18c3-2 5-6 5-10 0-8-6-14-14-14z" fill="#7c3aed"/>
          <circle cx="28" cy="28" r="2" fill="#ffffff"/>
          <circle cx="36" cy="28" r="2" fill="#ffffff"/>
          <path d="M24 42c2 2 4 2 8 2s6 0 8-2" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      ), 
      bodyPart: 'head', 
      doctors: 120, 
      description: 'Brain and nervous system',
      color: '#8b5cf6'
    },
    { 
      id: 3, 
      name: 'Orthopedics', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#cffafe" stroke="#a5f3fc" strokeWidth="2"/>
          <rect x="28" y="18" width="8" height="28" rx="4" fill="#0891b2"/>
          <circle cx="32" cy="22" r="3" fill="#ffffff"/>
          <circle cx="32" cy="32" r="2" fill="#ffffff"/>
          <circle cx="32" cy="42" r="3" fill="#ffffff"/>
        </svg>
      ), 
      bodyPart: 'arms', 
      doctors: 200, 
      description: 'Bones, joints, and muscles',
      color: '#06b6d4'
    },
    { 
      id: 4, 
      name: 'Gastroenterology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="2"/>
          <ellipse cx="32" cy="32" rx="12" ry="16" fill="#d97706"/>
          <path d="M26 24c0-3 3-6 6-6s6 3 6 6" stroke="#ffffff" strokeWidth="2" fill="none"/>
          <circle cx="28" cy="34" r="1.5" fill="#ffffff"/>
          <circle cx="36" cy="38" r="1.5" fill="#ffffff"/>
        </svg>
      ), 
      bodyPart: 'abdomen', 
      doctors: 90, 
      description: 'Digestive system',
      color: '#f59e0b'
    },
    { 
      id: 5, 
      name: 'Dermatology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2"/>
          <circle cx="32" cy="32" r="14" fill="#059669"/>
          <circle cx="28" cy="28" r="2" fill="#ffffff"/>
          <circle cx="36" cy="30" r="1.5" fill="#ffffff"/>
          <circle cx="30" cy="36" r="1.5" fill="#ffffff"/>
          <circle cx="35" cy="38" r="2" fill="#ffffff"/>
        </svg>
      ), 
      bodyPart: 'skin', 
      doctors: 80, 
      description: 'Skin conditions and treatments',
      color: '#10b981'
    },
    { 
      id: 6, 
      name: 'Ophthalmology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="2"/>
          <ellipse cx="32" cy="32" rx="14" ry="8" fill="#2563eb"/>
          <circle cx="32" cy="32" r="6" fill="#1d4ed8"/>
          <circle cx="32" cy="32" r="3" fill="#ffffff"/>
          <circle cx="33" cy="30" r="1" fill="#93c5fd"/>
        </svg>
      ), 
      bodyPart: 'head', 
      doctors: 70, 
      description: 'Eye care and vision',
      color: '#3b82f6'
    },
    { 
      id: 7, 
      name: 'ENT', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#fce7f3" stroke="#fbcfe8" strokeWidth="2"/>
          <path d="M32 18c-6 0-10 4-10 10v8c0 6 4 10 10 10s10-4 10-10v-8c0-6-4-10-10-10z" fill="#db2777"/>
          <path d="M26 30h12M26 34h12" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="24" cy="26" r="2" fill="#db2777"/>
          <circle cx="40" cy="26" r="2" fill="#db2777"/>
        </svg>
      ), 
      bodyPart: 'head', 
      doctors: 85, 
      description: 'Ear, nose, and throat',
      color: '#ec4899'
    },
    { 
      id: 8, 
      name: 'Pulmonology', 
      icon: (
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="2"/>
          <path d="M24 20c-3 0-6 3-6 6v12c0 3 3 6 6 6h2c2 0 4-2 4-4V24c0-2-2-4-4-4h-2z" fill="#0d9488"/>
          <path d="M40 20c3 0 6 3 6 6v12c0 3-3 6-6 6h-2c-2 0-4-2-4-4V24c0-2 2-4 4-4h2z" fill="#0d9488"/>
          <path d="M32 20v8" stroke="#0d9488" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ), 
      bodyPart: 'chest', 
      doctors: 65, 
      description: 'Lungs and respiratory system',
      color: '#14b8a6'
    }
  ];

  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "15+ years",
      rating: 4.9,
      reviews: 127,
      fee: 800,
      hospital: "Apollo Hospital",
      image: "👩⚕️",
      available: true
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      experience: "12+ years",
      rating: 4.8,
      reviews: 98,
      fee: 1200,
      hospital: "Max Healthcare",
      image: "👨⚕️",
      available: true
    }
  ];

  const filteredSpecialties = selectedBodyPart 
    ? specialties.filter(s => s.bodyPart === selectedBodyPart || (selectedBodyPart === 'legs' && s.bodyPart === 'arms'))
    : specialties;

  const filteredDoctors = selectedSpecialty
    ? mockDoctors.filter(d => d.specialty === selectedSpecialty)
    : mockDoctors.slice(0, 4);

  return (
    <div className="services-page">
      <div className="services-header">
        <div className="container">
          <h1>Medical Services</h1>
          <p>Find specialists by body part or browse all medical specialties</p>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          <div className="services-layout">
            {/* Body Diagram Section */}
            <div className="body-section">
              <h2>Find Doctors by Body Part</h2>
              <p>Click on a body part to see related specialists</p>
              <BodyDiagram 
                selectedPart={selectedBodyPart}
                onPartSelect={setSelectedBodyPart}
              />
              {selectedBodyPart && (
                <div className="selected-part">
                  <span>Selected: {selectedBodyPart}</span>
                  <button 
                    onClick={() => setSelectedBodyPart('')}
                    className="clear-selection"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Specialties Grid */}
            <div className="specialties-section">
              <h2>
                {selectedBodyPart ? `Specialties for ${selectedBodyPart}` : 'All Medical Specialties'}
              </h2>
              <div className="specialties-grid">
                {filteredSpecialties.map(specialty => (
                  <SpecialtyCard 
                    key={specialty.id}
                    specialty={specialty}
                    isSelected={selectedSpecialty === specialty.name}
                    onClick={() => setSelectedSpecialty(
                      selectedSpecialty === specialty.name ? '' : specialty.name
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          {(selectedSpecialty || selectedBodyPart) && (
            <div className="doctors-section">
              <h2>
                {selectedSpecialty 
                  ? `${selectedSpecialty} Doctors` 
                  : `Doctors for ${selectedBodyPart}`
                }
              </h2>
              <div className="doctors-grid">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          )}

          {/* Popular Services */}
          <div className="popular-services">
            <h2>Popular Medical Services</h2>
            <div className="services-grid">
              {[
                { name: 'Health Checkup', icon: '🩺', description: 'Comprehensive health screening' },
                { name: 'Vaccination', icon: '💉', description: 'Immunization services' },
                { name: 'Lab Tests', icon: '🧪', description: 'Diagnostic laboratory tests' },
                { name: 'Radiology', icon: '📷', description: 'X-ray, MRI, CT scan services' },
                { name: 'Physiotherapy', icon: '🤸', description: 'Physical rehabilitation' },
                { name: 'Mental Health', icon: '🧘', description: 'Counseling and therapy' }
              ].map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  <button className="btn btn-primary">Learn More</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;