import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Bed, Truck, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import './Hospitals.css';

const Hospitals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');
    if (searchParam) setSearchQuery(searchParam);
    if (locationParam) setLocationFilter(locationParam);

    fetchHospitals();
  }, [searchParams]);

  const fetchHospitals = async () => {
    const mockHospitals = [
      {
        id: '1',
        name: 'Apollo Hospital',
        location: 'Mumbai',
        address: 'Bandra West, Mumbai',
        rating: 4.8,
        reviews: 1250,
        specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
        beds: 500,
        availableBeds: 45,
        emergency: true,
        ambulance: true,
        phone: '+91-22-26567777'
      },
      {
        id: '2',
        name: 'Fortis Hospital',
        location: 'Delhi',
        address: 'Vasant Kunj, Delhi',
        rating: 4.7,
        reviews: 980,
        specialties: ['Pediatrics', 'ENT', 'Dermatology'],
        beds: 400,
        availableBeds: 32,
        emergency: true,
        ambulance: true,
        phone: '+91-11-26515050'
      },
      {
        id: '3',
        name: 'Manipal Hospital',
        location: 'Bangalore',
        address: 'HAL Airport Road, Bangalore',
        rating: 4.6,
        reviews: 756,
        specialties: ['Gastroenterology', 'Ophthalmology'],
        beds: 350,
        availableBeds: 28,
        emergency: true,
        ambulance: true,
        phone: '+91-80-39989999'
      },
      {
        id: '4',
        name: 'AIIMS Delhi',
        location: 'Delhi',
        address: 'Ansari Nagar, New Delhi',
        rating: 4.9,
        reviews: 2100,
        specialties: ['Cardiology', 'Neurology', 'Oncology'],
        beds: 800,
        availableBeds: 67,
        emergency: true,
        ambulance: true,
        phone: '+91-11-26588500'
      },
      {
        id: '5',
        name: 'Kokilaben Hospital',
        location: 'Mumbai',
        address: 'Andheri West, Mumbai',
        rating: 4.7,
        reviews: 890,
        specialties: ['Cardiology', 'Orthopedics', 'Pediatrics'],
        beds: 450,
        availableBeds: 38,
        emergency: true,
        ambulance: true,
        phone: '+91-22-42696969'
      },
      {
        id: '6',
        name: 'Narayana Health',
        location: 'Bangalore',
        address: 'Bommasandra, Bangalore',
        rating: 4.5,
        reviews: 654,
        specialties: ['Gastroenterology', 'ENT', 'Dermatology'],
        beds: 300,
        availableBeds: 25,
        emergency: true,
        ambulance: true,
        phone: '+91-80-71222222'
      }
    ];

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
          specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
          beds: 300,
          availableBeds: Math.floor(Math.random() * 50) + 10,
          emergency: true,
          ambulance: true,
          phone: h.phone,
          image: "https://images.unsplash.com/photo-1586773860418-d3b9da95779c?auto=format&fit=crop&w=600&q=80"
        }));
        setHospitals(formattedHospitals);
      } else {
        setHospitals(mockHospitals);
      }
    } catch (error) {
      setHospitals(mockHospitals);
    }
    setLoading(false);
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
    navigate('/user-portal?tab=beds', { state: { hospitalId: hospital.id, hospitalName: hospital.name } });
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
                <option value="Gurgaon">Gurgaon</option>
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
                  <div className="hospital-icon">
                    <img src={hospital.image || "https://images.unsplash.com/photo-1586773860418-d3b9da95779c?auto=format&fit=crop&w=600&q=80"} alt={hospital.name} className="hospital-img" />
                  </div>
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