import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Search, Filter, Star, MapPin, Clock, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AppointmentBooking from '../components/AppointmentBooking';
import api from '../services/api';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    availability: '',
    feeRange: [0, 2000]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from API
  const filteredDoctors = React.useMemo(() => {
    let result = doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty = !filters.specialty || doctor.specialty === filters.specialty;
      const matchesLocation = !filters.location || doctor.location === filters.location;
      const matchesAvailability = !filters.availability || (filters.availability === 'available' && doctor.available);
      const matchesFee = doctor.fee >= filters.feeRange[0] && doctor.fee <= filters.feeRange[1];

      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability && matchesFee;
    });

    // Apply sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'fee-low-high') {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sortBy === 'fee-high-low') {
      result.sort((a, b) => b.fee - a.fee);
    }

    return result;
  }, [doctors, searchQuery, filters, sortBy]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Use central API client so the base URL comes from VITE_API_URL in production
      const response = await api.getDoctors();
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Failed to fetch doctors: ${response.status} ${txt}`);
      }
      const doctorsData = await response.json();

      // Transform API data to match frontend format
      const transformedDoctors = doctorsData.map((doctor, index) => ({
        id: doctor.id,
        name: doctor.user?.name || 'Unknown Doctor',
        specialty: doctor.speciality,
        experience: `${doctor.experience}+ years`,
        rating: doctor.averageRating || 4.5,
        reviews: doctor.totalReviews || 0,
        fee: doctor.fees,
        hospital: doctor.hospital?.name || 'General Hospital',
        location: doctor.hospital?.city || 'Mumbai',
        image: null,
        available: doctor.isAvailable !== false,
        qualification: doctor.qualification
      }));

      setDoctors(transformedDoctors);
      setError(null);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again later.');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));

      // Check if there's a pending appointment after login
      const pendingAppointment = localStorage.getItem('pendingAppointment');
      if (pendingAppointment) {
        const doctor = JSON.parse(pendingAppointment);
        setSelectedDoctor(doctor);
        setShowBooking(true);
        localStorage.removeItem('pendingAppointment');
      }
    }
  }, []);

  useEffect(() => {
    const specialtyParam = searchParams.get('specialty');
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');

    if (specialtyParam) {
      setFilters(prev => ({ ...prev, specialty: specialtyParam }));
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (locationParam) {
      setFilters(prev => ({ ...prev, location: locationParam }));
    }
  }, [searchParams]);


  const bookAppointment = (doctor) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store selected doctor for after login
      localStorage.setItem('pendingAppointment', JSON.stringify(doctor));
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
  };

  const handleBookingClose = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="doctors-page">
      <Toaster position="top-right" />

      <div className="doctors-header">
        <div className="container">
          <h1>Find Doctors</h1>
          <p>Book appointments with verified doctors</p>

          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="doctors-content">
        <div className="container">
          <div className="doctors-layout">
            <div className="filters-sidebar">
              <div className="filter-header">
                <Filter size={20} />
                <h3>Filters</h3>
              </div>

              <div className="filter-group">
                <label>Specialty</label>
                <select
                  value={filters.specialty}
                  onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                >
                  <option value="">All Specialties</option>
                  <option value="Cardiologist">Cardiologist (Cardiology)</option>
                  <option value="Neurologist">Neurologist (Neurology)</option>
                  <option value="Pediatrician">Pediatrician (Pediatrics)</option>
                  <option value="Orthopedic">Orthopedic (Orthopedics)</option>
                  <option value="Dermatologist">Dermatologist (Dermatology)</option>
                  <option value="Gynecologist">Gynecologist (Gynecology)</option>
                  <option value="Dentist">Dentist (Dentistry)</option>
                  <option value="Ophthalmologist">Ophthalmologist (Ophthalmology)</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="ENT">ENT Specialist</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="available">Available Today</option>
                </select>
              </div>
            </div>

            <div className="doctors-main">
              <div className="results-header">
                <h3>{filteredDoctors.length} Doctors Found</h3>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="fee-low-high">Sort by Fee (Low to High)</option>
                  <option value="fee-high-low">Sort by Fee (High to Low)</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
                  <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
                  <p style={{ color: '#6b7280' }}>Finding top doctors...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={fetchDoctors} className="retry-btn">Retry</button>
                </div>
              ) : (
                <div className="doctors-grid">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-header-row">
                        <div className="icon-avatar">
                          <Plus size={24} strokeWidth={3} />
                        </div>
                        <div className={`status-pill ${doctor.available ? 'available' : 'unavailable'}`}>
                          {doctor.available ? 'Available' : 'Busy'}
                        </div>
                      </div>

                      <div className="doctor-main-info">
                        <h4 className="doctor-name">{doctor.name}</h4>
                        <p className="doctor-specialty">
                          {doctor.specialty}
                        </p>

                        <div className="meta-info">
                          <div className="meta-item">
                            <Clock size={14} /> {doctor.experience} experience
                          </div>
                          <div className="meta-item">
                            <MapPin size={14} /> {doctor.hospital}, {doctor.location}
                          </div>
                        </div>

                        <div className="rating-container">
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < Math.floor(doctor.rating) ? "#F59E0B" : "none"} strokeWidth={1.5} />
                            ))}
                          </div>
                          <span className="rating-text">
                            {doctor.rating} ({doctor.reviews} reviews)
                          </span>
                        </div>

                        <div className="fee-container">
                          <span className="fee-label">Consultation Fee</span>
                          <span className="fee-amount">₹{doctor.fee}</span>
                        </div>

                        <div className="card-actions">
                          <button
                            className="profile-btn"
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                          >
                            Profile
                          </button>
                          <button
                            className={`book-btn ${!doctor.available ? 'disabled' : ''}`}
                            onClick={() => bookAppointment(doctor)}
                            disabled={!doctor.available}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredDoctors.length === 0 && (
                <div className="no-results">
                  <Plus size={48} className="no-results-icon" />
                  <h3>No doctors found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBooking && selectedDoctor && (
        <AppointmentBooking
          doctor={selectedDoctor}
          onClose={handleBookingClose}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Doctors;