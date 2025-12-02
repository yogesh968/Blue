import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaSyringe, FaFlask, FaXRay, FaRunning, FaBrain, FaUserMd, FaHeartbeat, FaPills, FaHeart, FaBone, FaEye, FaTooth } from 'react-icons/fa';
import { MdHealthAndSafety, MdPsychology } from 'react-icons/md';
import { RiMentalHealthFill } from 'react-icons/ri';
import { GiLungs, GiStomach } from 'react-icons/gi';
import { BiSpa } from 'react-icons/bi';
import BodyDiagram from '../components/BodyDiagram';
import SpecialtyCard from '../components/SpecialtyCard';
import DoctorCard from '../components/DoctorCard';
import './Services.css';

const Services = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const specialties = [
    { 
      id: 1, 
      name: 'Cardiology', 
      icon: <FaHeart style={{fontSize: '48px', color: '#dc2626'}} />, 
      bodyPart: 'chest', 
      doctors: 150, 
      description: 'Heart and cardiovascular system',
      color: '#ef4444'
    },
    { 
      id: 2, 
      name: 'Neurology', 
      icon: <MdPsychology style={{fontSize: '48px', color: '#7c3aed'}} />, 
      bodyPart: 'head', 
      doctors: 120, 
      description: 'Brain and nervous system',
      color: '#8b5cf6'
    },
    { 
      id: 3, 
      name: 'Orthopedics', 
      icon: <FaBone style={{fontSize: '48px', color: '#0891b2'}} />, 
      bodyPart: 'arms', 
      doctors: 200, 
      description: 'Bones, joints, and muscles',
      color: '#06b6d4'
    },
    { 
      id: 4, 
      name: 'Gastroenterology', 
      icon: <GiStomach style={{fontSize: '48px', color: '#d97706'}} />, 
      bodyPart: 'abdomen', 
      doctors: 90, 
      description: 'Digestive system',
      color: '#f59e0b'
    },
    { 
      id: 5, 
      name: 'Dermatology', 
      icon: <BiSpa style={{fontSize: '48px', color: '#059669'}} />, 
      bodyPart: 'skin', 
      doctors: 80, 
      description: 'Skin conditions and treatments',
      color: '#10b981'
    },
    { 
      id: 6, 
      name: 'Ophthalmology', 
      icon: <FaEye style={{fontSize: '48px', color: '#2563eb'}} />, 
      bodyPart: 'head', 
      doctors: 70, 
      description: 'Eye care and vision',
      color: '#3b82f6'
    },
    { 
      id: 7, 
      name: 'ENT', 
      icon: <FaUserMd style={{fontSize: '48px', color: '#db2777'}} />, 
      bodyPart: 'head', 
      doctors: 85, 
      description: 'Ear, nose, and throat',
      color: '#ec4899'
    },
    { 
      id: 8, 
      name: 'Pulmonology', 
      icon: <GiLungs style={{fontSize: '48px', color: '#0d9488'}} />, 
      bodyPart: 'chest', 
      doctors: 65, 
      description: 'Lungs and respiratory system',
      color: '#14b8a6'
    }
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/doctors');
      if (response.ok) {
        const doctorsData = await response.json();
        const transformedDoctors = doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.user.name,
          specialty: doctor.speciality,
          experience: `${doctor.experience}+ years`,
          rating: 4.5, // Default rating
          reviews: 0,
          fee: doctor.fees,
          hospital: doctor.hospital.name,
          image: <FaUserMd />,
          available: true
        }));
        setDoctors(transformedDoctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleViewDoctors = (specialtyName) => {
    navigate(`/doctors?specialty=${encodeURIComponent(specialtyName)}`);
  };

  const filteredSpecialties = selectedBodyPart 
    ? specialties.filter(s => s.bodyPart === selectedBodyPart || (selectedBodyPart === 'legs' && s.bodyPart === 'arms'))
    : specialties;

  const filteredDoctors = selectedSpecialty
    ? doctors.filter(d => d.specialty === selectedSpecialty)
    : doctors.slice(0, 4);

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
                    onViewDoctors={() => handleViewDoctors(specialty.name)}
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
                { name: 'Health Checkup', icon: <FaStethoscope />, description: 'Comprehensive health screening' },
                { name: 'Vaccination', icon: <FaSyringe />, description: 'Immunization services' },
                { name: 'Lab Tests', icon: <FaFlask />, description: 'Diagnostic laboratory tests' },
                { name: 'Radiology', icon: <FaXRay />, description: 'X-ray, MRI, CT scan services' },
                { name: 'Physiotherapy', icon: <FaRunning />, description: 'Physical rehabilitation' },
                { name: 'Mental Health', icon: <RiMentalHealthFill />, description: 'Counseling and therapy' }
              ].map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/doctors')}
                  >
                    Find Doctors
                  </button>
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