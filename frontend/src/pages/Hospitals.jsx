import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Bed, Ambulance, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Hospitals.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const mockHospitals = [
    {
      id: 1,
      name: "Apollo Hospital",
      location: "Mumbai",
      address: "Bandra West, Mumbai, Maharashtra",
      rating: 4.8,
      reviews: 1250,
      specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
      beds: 450,
      availableBeds: 23,
      emergency: true,
      ambulance: true,
      image: "🏥"
    },
    {
      id: 2,
      name: "Max Healthcare",
      location: "Delhi",
      address: "Saket, New Delhi",
      rating: 4.7,
      reviews: 980,
      specialties: ["Cardiology", "Gastroenterology", "Nephrology"],
      beds: 350,
      availableBeds: 15,
      emergency: true,
      ambulance: true,
      image: "🏥"
    },
    {
      id: 3,
      name: "Fortis Hospital",
      location: "Bangalore",
      address: "Bannerghatta Road, Bangalore",
      rating: 4.6,
      reviews: 756,
      specialties: ["Pediatrics", "Gynecology", "Dermatology"],
      beds: 280,
      availableBeds: 8,
      emergency: true,
      ambulance: false,
      image: "🏥"
    },
    {
      id: 4,
      name: "AIIMS",
      location: "Delhi",
      address: "Ansari Nagar, New Delhi",
      rating: 4.9,
      reviews: 2100,
      specialties: ["All Specialties"],
      beds: 2500,
      availableBeds: 45,
      emergency: true,
      ambulance: true,
      image: "🏥"
    }
  ];

  useEffect(() => {
    setHospitals(mockHospitals);
  }, []);

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !locationFilter || hospital.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

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
                        <Ambulance size={16} />
                        <span>Ambulance Available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hospital-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => toast.success(`Calling ${hospital.name}`)}
                  >
                    <Phone size={16} /> Call Hospital
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => toast.success(`Booking bed at ${hospital.name}`)}
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