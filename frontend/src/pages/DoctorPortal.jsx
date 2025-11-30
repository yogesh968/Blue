import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Users, Plus, Edit, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './DoctorPortal.css';

const DoctorPortal = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    fees: '',
    timings: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: true },
      sunday: { start: '09:00', end: '13:00', available: false }
    }
  });

  // Mock data
  const mockAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      patientAge: 35,
      appointmentTime: '10:00 AM',
      date: '2024-01-15',
      location: 'Apollo Hospital, Mumbai',
      symptoms: 'Chest pain, shortness of breath',
      status: 'confirmed',
      fees: 800
    },
    {
      id: 2,
      patientName: 'Sarah Wilson',
      patientAge: 28,
      appointmentTime: '11:30 AM',
      date: '2024-01-15',
      location: 'City Clinic, Pune',
      symptoms: 'Regular checkup',
      status: 'pending',
      fees: 600
    }
  ];

  const mockLocations = [
    {
      id: 1,
      name: 'Apollo Hospital',
      address: '123 Main Street, Bandra',
      city: 'Mumbai',
      phone: '+91 9876543210',
      fees: 800,
      patientsToday: 12,
      totalPatients: 156,
      timings: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM'
    },
    {
      id: 2,
      name: 'City Clinic',
      address: '456 Park Avenue, Koregaon Park',
      city: 'Pune',
      phone: '+91 9876543211',
      fees: 600,
      patientsToday: 8,
      totalPatients: 89,
      timings: 'Mon-Sat: 10AM-6PM'
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
    setLocations(mockLocations);
  }, []);

  const handleAddLocation = (e) => {
    e.preventDefault();
    const location = {
      id: Date.now(),
      ...newLocation,
      patientsToday: 0,
      totalPatients: 0,
      timings: Object.entries(newLocation.timings)
        .filter(([day, timing]) => timing.available)
        .map(([day, timing]) => `${day}: ${timing.start}-${timing.end}`)
        .join(', ')
    };
    setLocations([...locations, location]);
    setNewLocation({
      name: '',
      address: '',
      city: '',
      phone: '',
      fees: '',
      timings: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '09:00', end: '13:00', available: false }
      }
    });
    setShowAddLocation(false);
    toast.success('Location added successfully!');
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status } : apt)
    );
    toast.success(`Appointment ${status}!`);
  };

  const deleteLocation = (id) => {
    setLocations(locations.filter(loc => loc.id !== id));
    toast.success('Location removed successfully!');
  };

  const getTotalStats = () => {
    const totalPatients = locations.reduce((sum, loc) => sum + loc.totalPatients, 0);
    const todayPatients = appointments.length;
    const totalEarnings = appointments.reduce((sum, apt) => sum + apt.fees, 0);
    return { totalPatients, todayPatients, totalEarnings };
  };

  const stats = getTotalStats();

  return (
    <div className="doctor-portal">
      <Toaster position="top-right" />
      
      <div className="portal-header">
        <h1>Doctor Dashboard</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            My Locations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="portal-stats">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h3>{stats.todayPatients}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign size={24} />
          <div>
            <h3>₹{stats.totalEarnings}</h3>
            <p>Today's Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <MapPin size={24} />
          <div>
            <h3>{locations.length}</h3>
            <p>Active Locations</p>
          </div>
        </div>
      </div>

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <h2>Today's Appointments</h2>
          <div className="appointments-list">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <h4>{appointment.patientName}</h4>
                  <p><Clock size={16} /> {appointment.appointmentTime}</p>
                  <p><MapPin size={16} /> {appointment.location}</p>
                  <p><Users size={16} /> Age: {appointment.patientAge}</p>
                  <p className="symptoms">Symptoms: {appointment.symptoms}</p>
                  <p className="fees">Fees: ₹{appointment.fees}</p>
                </div>
                <div className="appointment-actions">
                  <span className={`status ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'pending' && (
                    <div className="action-buttons">
                      <button 
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        className="btn-confirm"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="locations-section">
          <div className="section-header">
            <h2>My Consultation Locations</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowAddLocation(true)}
            >
              <Plus size={16} /> Add Location
            </button>
          </div>
          
          <div className="locations-grid">
            {locations.map(location => (
              <div key={location.id} className="location-card">
                <div className="location-header">
                  <h3>{location.name}</h3>
                  <div className="location-actions">
                    <button className="btn-icon"><Edit size={16} /></button>
                    <button className="btn-icon" onClick={() => deleteLocation(location.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="location-details">
                  <p><MapPin size={14} /> {location.address}, {location.city}</p>
                  <p><Clock size={14} /> {location.timings}</p>
                  <p>📞 {location.phone}</p>
                  <p><DollarSign size={14} /> ₹{location.fees} per consultation</p>
                </div>
                <div className="location-stats">
                  <div className="stat">
                    <span className="stat-number">{location.patientsToday}</span>
                    <span className="stat-label">Today</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{location.totalPatients}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddLocation && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Add New Location</h3>
                  <button onClick={() => setShowAddLocation(false)}>×</button>
                </div>
                <form onSubmit={handleAddLocation}>
                  <div className="form-group">
                    <label>Location Name</label>
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={newLocation.city}
                        onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={newLocation.phone}
                        onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Consultation Fees (₹)</label>
                    <input
                      type="number"
                      value={newLocation.fees}
                      onChange={(e) => setNewLocation({...newLocation, fees: e.target.value})}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddLocation(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Location
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <h2>Analytics & Reports</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Location Performance</h3>
              {locations.map(location => (
                <div key={location.id} className="location-performance">
                  <div className="location-name">{location.name}</div>
                  <div className="performance-stats">
                    <span>Patients: {location.totalPatients}</span>
                    <span>Revenue: ₹{location.totalPatients * location.fees}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="analytics-card">
              <h3>Monthly Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span>Total Consultations</span>
                  <span>{stats.totalPatients}</span>
                </div>
                <div className="summary-item">
                  <span>Total Revenue</span>
                  <span>₹{locations.reduce((sum, loc) => sum + (loc.totalPatients * loc.fees), 0)}</span>
                </div>
                <div className="summary-item">
                  <span>Average per Location</span>
                  <span>{locations.length > 0 ? Math.round(stats.totalPatients / locations.length) : 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;