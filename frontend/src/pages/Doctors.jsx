import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock, DollarSign, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AppointmentBooking from '../components/AppointmentBooking';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    availability: '',
    feeRange: [0, 2000]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    setLoading(true);
    
    const mockDoctors = [
      {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        specialty: 'Cardiology',
        experience: '15+ years',
        rating: 4.8,
        reviews: 127,
        fee: 800,
        hospital: 'Apollo Hospital',
        location: 'Mumbai',
        image: "👨⚕️",
        available: true,
        qualification: 'MBBS, MD Cardiology'
      },
      {
        id: '2',
        name: 'Dr. Priya Sharma',
        specialty: 'Neurology',
        experience: '12+ years',
        rating: 4.9,
        reviews: 98,
        fee: 900,
        hospital: 'Apollo Hospital',
        location: 'Mumbai',
        image: "👩⚕️",
        available: true,
        qualification: 'MBBS, DM Neurology'
      },
      {
        id: '3',
        name: 'Dr. Amit Patel',
        specialty: 'Orthopedics',
        experience: '10+ years',
        rating: 4.7,
        reviews: 156,
        fee: 700,
        hospital: 'Fortis Hospital',
        location: 'Delhi',
        image: "👨⚕️",
        available: true,
        qualification: 'MBBS, MS Orthopedics'
      },
      {
        id: '4',
        name: 'Dr. Sunita Reddy',
        specialty: 'Pediatrician',
        experience: '8+ years',
        rating: 4.6,
        reviews: 89,
        fee: 600,
        hospital: 'Fortis Hospital',
        location: 'Delhi',
        image: "👩⚕️",
        available: true,
        qualification: 'MBBS, MD Pediatrics'
      },
      {
        id: '5',
        name: 'Dr. Vikram Singh',
        specialty: 'Dermatology',
        experience: '6+ years',
        rating: 4.5,
        reviews: 67,
        fee: 500,
        hospital: 'Manipal Hospital',
        location: 'Bangalore',
        image: "👨⚕️",
        available: true,
        qualification: 'MBBS, MD Dermatology'
      },
      {
        id: '6',
        name: 'Dr. Kavya Nair',
        specialty: 'Gastroenterology',
        experience: '14+ years',
        rating: 4.8,
        reviews: 134,
        fee: 850,
        hospital: 'Manipal Hospital',
        location: 'Bangalore',
        image: "👩⚕️",
        available: true,
        qualification: 'MBBS, DM Gastroenterology'
      },
      {
        id: '7',
        name: 'Dr. Arjun Mehta',
        specialty: 'Ophthalmology',
        experience: '9+ years',
        rating: 4.7,
        reviews: 78,
        fee: 650,
        hospital: 'Apollo Hospital',
        location: 'Mumbai',
        image: "👨⚕️",
        available: true,
        qualification: 'MBBS, MS Ophthalmology'
      },
      {
        id: '8',
        name: 'Dr. Deepika Joshi',
        specialty: 'ENT',
        experience: '7+ years',
        rating: 4.6,
        reviews: 92,
        fee: 550,
        hospital: 'Fortis Hospital',
        location: 'Delhi',
        image: "👩⚕️",
        available: true,
        qualification: 'MBBS, MS ENT'
      }
    ];
    
    try {
      const response = await fetch('http://localhost:3001/api/doctors');
      if (response.ok) {
        const doctorsData = await response.json();
        const transformedDoctors = doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.user.name,
          specialty: doctor.speciality,
          experience: `${doctor.experience}+ years`,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 100),
          fee: doctor.fees,
          hospital: doctor.hospital?.name || 'General Hospital',
          location: doctor.hospital?.city || 'Mumbai',
          image: "👨⚕️",
          available: true,
          qualification: doctor.qualification
        }));
        setDoctors(transformedDoctors);
        setFilteredDoctors(transformedDoctors);
      } else {
        setDoctors(mockDoctors);
        setFilteredDoctors(mockDoctors);
      }
    } catch (error) {
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
    }
    
    setLoading(false);
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

  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = !filters.specialty || doctor.specialty === filters.specialty;
      const matchesLocation = !filters.location || doctor.location === filters.location;
      const matchesAvailability = !filters.availability || 
                                 (filters.availability === 'available' && doctor.available) ||
                                 (filters.availability === 'all');
      const matchesFee = doctor.fee >= filters.feeRange[0] && doctor.fee <= filters.feeRange[1];

      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability && matchesFee;
    });

    setFilteredDoctors(filtered);
  }, [doctors, filters, searchQuery]);

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
                  onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                >
                  <option value="">All Specialties</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT">ENT</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Location</label>
                <select 
                  value={filters.location} 
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
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
                  onChange={(e) => setFilters({...filters, availability: e.target.value})}
                >
                  <option value="">All</option>
                  <option value="available">Available Today</option>
                </select>
              </div>
            </div>
            
            <div className="doctors-main">
              <div className="results-header">
                <h3>{filteredDoctors.length} Doctors Found</h3>
                <select className="sort-select">
                  <option>Sort by Relevance</option>
                  <option>Sort by Rating</option>
                  <option>Sort by Fee (Low to High)</option>
                  <option>Sort by Fee (High to Low)</option>
                </select>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <p>Loading doctors...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={fetchDoctors} className="retry-btn">Retry</button>
                </div>
              ) : (
                <div className="doctors-grid">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-avatar">
                        <User size={40} />
                      </div>
                      <div className="doctor-info">
                        <h4>{doctor.name}</h4>
                        <p className="specialty">{doctor.specialty}</p>
                        <p className="experience">{doctor.experience} experience</p>
                        {doctor.qualification && (
                          <p className="qualification">{doctor.qualification}</p>
                        )}
                        
                        <div className="doctor-details">
                          <div className="detail-item">
                            <Star size={16} className="rating-icon" />
                            <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                          </div>
                          <div className="detail-item">
                            <MapPin size={16} />
                            <span>{doctor.hospital}, {doctor.location}</span>
                          </div>
                          <div className="detail-item">
                            <DollarSign size={16} />
                            <span>₹{doctor.fee}</span>
                          </div>
                          <div className="detail-item">
                            <Clock size={16} />
                            <span className={`availability ${doctor.available ? 'available' : 'unavailable'}`}>
                              {doctor.available ? 'Available Today' : 'Not Available'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span>📅 {Math.floor(Math.random() * 15) + 5} appointments today</span>
                          </div>
                        </div>
                        
                        <button 
                          className={`book-btn ${!doctor.available ? 'disabled' : ''}`}
                          onClick={() => bookAppointment(doctor)}
                          disabled={!doctor.available}
                        >
                          {doctor.available ? 'Book Appointment' : 'Not Available'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredDoctors.length === 0 && (
                <div className="no-results">
                  <User size={48} className="no-results-icon" />
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