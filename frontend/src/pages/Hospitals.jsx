import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Bed, Truck, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import './Hospitals.css';

const Hospitals = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.getHospitals();
      if (response.ok) {
        const data = await response.json();
        const formattedHospitals = data.map(h => ({
          id: h.id,
          name: h.name,
          location: h.city,
          address: h.address,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 1000) + 500,
          specialties: h.doctors?.map(d => d.speciality) || [],
          beds: 300,
          availableBeds: Math.floor(Math.random() * 50) + 10,
          emergency: true,
          ambulance: true,
          phone: h.phone
        }));
        setHospitals(formattedHospitals);
      }
    } catch (error) {
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleBookBed = (hospital) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a bed');
      navigate('/login');
      return;
    }
    
    // Navigate to user portal with booking info
    toast.success(`Redirecting to book bed at ${hospital.name}`);
    navigate('/user-portal#beds', { state: { hospitalId: hospital.id, hospitalName: hospital.name } });
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = !searchQuery || 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hospital.specialties && hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLocation = !locationFilter || hospital.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="hospitals-page">
        <div className="loading-container">
          <p>Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hospitals-page">
      <Toaster position="top-right" />
      <div className="hospitals-header">
        <div className="container">
          <h1>Find Hospitals</h1>
          <p>Locate hospitals with advanced medical facilities</p>
          
          <div className="search-filters">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search hospitals or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-wrapper">
              <Filter size={16} />
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="location-filter"
              >
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="hospitals-content">
        <div className="container">
          <div className="results-info">
            <h3>{filteredHospitals.length} Hospitals Found</h3>
          </div>
          
          <div className="hospitals-grid">
            {filteredHospitals.map(hospital => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-header">
                  <div className="hospital-icon">🏥</div>
                  <div className="hospital-basic-info">
                    <h3>{hospital.name}</h3>
                    <div className="hospital-rating">
                      <Star size={16} className="rating-icon" />
                      <span>{hospital.rating} ({hospital.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="hospital-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{hospital.address}</span>
                  </div>
                  
                  <div className="specialties">
                    <strong>Specialties:</strong>
                    <div className="specialty-tags">
                      {hospital.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">{specialty}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="hospital-stats">
                    <div className="stat-item">
                      <Bed size={16} />
                      <span>{hospital.availableBeds}/{hospital.beds} beds available</span>
                    </div>
                    {hospital.emergency && (
                      <div className="stat-item emergency">
                        <span className="emergency-badge">🚨 24/7 Emergency</span>
                      </div>
                    )}
                    {hospital.ambulance && (
                      <div className="stat-item">
                        <Truck size={16} />
                        <span>Ambulance Available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hospital-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      if (hospital.phone) {
                        window.location.href = `tel:${hospital.phone}`;
                      } else {
                        toast.success(`Call ${hospital.name}`);
                      }
                    }}
                  >
                    <Phone size={16} /> Call Hospital
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleBookBed(hospital)}
                  >
                    <Bed size={16} /> Book Bed
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredHospitals.length === 0 && (
            <div className="no-results">
              <h3>No hospitals found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hospitals;