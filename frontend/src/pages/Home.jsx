import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDoctors('?limit=3&featured=true');
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedDoctors(data);
      } else {
        throw new Error('Failed to fetch doctors');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const mockFeaturedDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: 4.9,
      reviews: 127,
      fee: 800,
      hospital: "Apollo Hospital",
      image: "👩‍⚕️",
      available: true
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist", 
      experience: "12+ years",
      rating: 4.8,
      reviews: 98,
      fee: 1200,
      hospital: "Max Healthcare",
      image: "👨‍⚕️",
      available: true
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      experience: "10+ years", 
      rating: 4.9,
      reviews: 156,
      fee: 600,
      hospital: "Fortis Hospital",
      image: "👩‍⚕️",
      available: false
    }
  ];

  // Fallback to mock data if API fails
  const displayDoctors = featuredDoctors.length > 0 ? featuredDoctors : (error ? mockFeaturedDoctors : []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Top Doctors & Hospitals Near You
            </h1>
            <p className="hero-subtitle">
              Book appointments with verified doctors, get instant consultations, 
              and access quality healthcare services at your convenience.
            </p>
            
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              location={location}
              setLocation={setLocation}
            />
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Verified Doctors</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Hospitals</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Happy Patients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions py-16">
        <div className="container">
          <h2 className="text-center mb-8">Quick Actions</h2>
          <div className="grid grid-3">
            <div className="action-card">
              <div className="action-icon emergency">🚨</div>
              <h3>Emergency Care</h3>
              <p>Get immediate medical attention with our 24/7 emergency services</p>
              <button className="btn btn-primary">Call Ambulance</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📅</div>
              <h3>Book Appointment</h3>
              <p>Schedule consultations with top doctors at your preferred time</p>
              <button className="btn btn-primary">Book Now</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">🏥</div>
              <h3>Find Hospitals</h3>
              <p>Locate nearby hospitals with advanced medical facilities</p>
              <button className="btn btn-primary">Find Hospitals</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="featured-doctors py-16">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Top Rated Doctors</h2>
            <p className="text-gray">Consult with our experienced healthcare professionals</p>
          </div>
          
          <div className="grid grid-3">
            {loading ? (
              <div className="loading-doctors">
                <Loader className="spinner" size={32} />
                <p>Loading doctors...</p>
              </div>
            ) : displayDoctors.length === 0 ? (
              <div className="no-doctors">
                <p>No featured doctors available</p>
              </div>
            ) : (
              displayDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            )}
          </div>
          
          <div className="text-center" style={{marginTop: '2rem'}}>
            <button className="btn btn-secondary">View All Doctors</button>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="specialties py-16">
        <div className="container">
          <h2 className="text-center mb-8">Popular Specialties</h2>
          <div className="grid grid-4">
            {[
              { name: 'Cardiology', icon: '❤️', count: '150+ Doctors' },
              { name: 'Neurology', icon: '🧠', count: '120+ Doctors' },
              { name: 'Orthopedics', icon: '🦴', count: '200+ Doctors' },
              { name: 'Pediatrics', icon: '👶', count: '180+ Doctors' },
              { name: 'Dermatology', icon: '🧴', count: '90+ Doctors' },
              { name: 'Gynecology', icon: '👩‍⚕️', count: '110+ Doctors' },
              { name: 'Dentistry', icon: '🦷', count: '160+ Doctors' },
              { name: 'Ophthalmology', icon: '👁️', count: '80+ Doctors' }
            ].map((specialty, index) => (
              <div key={index} className="specialty-card">
                <div className="specialty-icon">{specialty.icon}</div>
                <h4>{specialty.name}</h4>
                <p className="text-gray">{specialty.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Take Care of Your Health?</h2>
            <p>Join millions who trust us for their healthcare needs</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">Find a Doctor</button>
              <button className="btn btn-secondary btn-large">Book Appointment</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;