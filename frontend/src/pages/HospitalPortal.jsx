import React, { useState, useEffect } from 'react';
import { Bed, Ambulance, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './HospitalPortal.css';

const HospitalPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bedBookings, setBedBookings] = useState([]);
  const [ambulanceBookings, setAmbulanceBookings] = useState([]);
  const [hospitalStats, setHospitalStats] = useState({
    totalBeds: 450,
    occupiedBeds: 327,
    availableBeds: 123,
    totalAmbulances: 8,
    availableAmbulances: 3,
    todayAdmissions: 15,
    todayDischarges: 12,
    revenue: 125000
  });

  const mockBedBookings = [
    {
      id: 1,
      patientName: 'John Doe',
      bedType: 'ICU',
      checkIn: '2024-01-15',
      status: 'ACTIVE',
      amount: 5000,
      room: 'ICU-101'
    },
    {
      id: 2,
      patientName: 'Sarah Wilson',
      bedType: 'GENERAL',
      checkIn: '2024-01-14',
      status: 'ACTIVE',
      amount: 2000,
      room: 'GEN-205'
    }
  ];

  const mockAmbulanceBookings = [
    {
      id: 1,
      patientName: 'Mike Johnson',
      pickupLocation: 'Downtown Area',
      destination: 'Apollo Hospital',
      status: 'IN_TRANSIT',
      ambulanceNo: 'AMB-001',
      driverName: 'Raj Kumar'
    },
    {
      id: 2,
      patientName: 'Lisa Brown',
      pickupLocation: 'Airport Road',
      destination: 'Apollo Hospital',
      status: 'COMPLETED',
      ambulanceNo: 'AMB-003',
      driverName: 'Amit Singh'
    }
  ];

  useEffect(() => {
    setBedBookings(mockBedBookings);
    setAmbulanceBookings(mockAmbulanceBookings);
  }, []);

  const updateBedBookingStatus = (id, status) => {
    setBedBookings(prev => 
      prev.map(booking => booking.id === id ? { ...booking, status } : booking)
    );
    toast.success(`Bed booking ${status.toLowerCase()}!`);
  };

  const updateAmbulanceStatus = (id, status) => {
    setAmbulanceBookings(prev => 
      prev.map(booking => booking.id === id ? { ...booking, status } : booking)
    );
    toast.success(`Ambulance status updated to ${status.toLowerCase()}!`);
  };

  return (
    <div className="hospital-portal">
      <Toaster position="top-right" />
      
      <div className="portal-header">
        <h1>Hospital Management Dashboard</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'beds' ? 'active' : ''}`}
            onClick={() => setActiveTab('beds')}
          >
            Bed Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ambulances' ? 'active' : ''}`}
            onClick={() => setActiveTab('ambulances')}
          >
            Ambulance Services
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <div className="stats-grid">
            <div className="stat-card">
              <Bed size={24} />
              <div>
                <h3>{hospitalStats.availableBeds}</h3>
                <p>Available Beds</p>
                <small>{hospitalStats.occupiedBeds}/{hospitalStats.totalBeds} occupied</small>
              </div>
            </div>
            <div className="stat-card">
              <Ambulance size={24} />
              <div>
                <h3>{hospitalStats.availableAmbulances}</h3>
                <p>Available Ambulances</p>
                <small>{hospitalStats.totalAmbulances} total</small>
              </div>
            </div>
            <div className="stat-card">
              <Users size={24} />
              <div>
                <h3>{hospitalStats.todayAdmissions}</h3>
                <p>Today's Admissions</p>
                <small>{hospitalStats.todayDischarges} discharges</small>
              </div>
            </div>
            <div className="stat-card">
              <DollarSign size={24} />
              <div>
                <h3>₹{hospitalStats.revenue.toLocaleString()}</h3>
                <p>Today's Revenue</p>
              </div>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-card">
              <h3>Bed Occupancy</h3>
              <div className="occupancy-chart">
                <div className="occupancy-bar">
                  <div 
                    className="occupancy-fill" 
                    style={{ width: `${(hospitalStats.occupiedBeds / hospitalStats.totalBeds) * 100}%` }}
                  ></div>
                </div>
                <p>{Math.round((hospitalStats.occupiedBeds / hospitalStats.totalBeds) * 100)}% Occupied</p>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Recent Activities</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <Activity size={16} />
                  <span>New patient admitted to ICU-101</span>
                  <small>2 hours ago</small>
                </div>
                <div className="activity-item">
                  <Activity size={16} />
                  <span>Ambulance AMB-002 dispatched</span>
                  <small>3 hours ago</small>
                </div>
                <div className="activity-item">
                  <Activity size={16} />
                  <span>Patient discharged from GEN-205</span>
                  <small>4 hours ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'beds' && (
        <div className="beds-section">
          <div className="section-header">
            <h2>Bed Management</h2>
            <div className="bed-summary">
              <span className="bed-stat available">Available: {hospitalStats.availableBeds}</span>
              <span className="bed-stat occupied">Occupied: {hospitalStats.occupiedBeds}</span>
              <span className="bed-stat total">Total: {hospitalStats.totalBeds}</span>
            </div>
          </div>
          
          <div className="bookings-list">
            <h3>Active Bed Bookings</h3>
            {bedBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.patientName}</h4>
                  <p><strong>Room:</strong> {booking.room}</p>
                  <p><strong>Bed Type:</strong> {booking.bedType}</p>
                  <p><strong>Check-in:</strong> {booking.checkIn}</p>
                  <p><strong>Amount:</strong> ₹{booking.amount}/day</p>
                </div>
                <div className="booking-actions">
                  <span className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'ACTIVE' && (
                    <button 
                      onClick={() => updateBedBookingStatus(booking.id, 'DISCHARGED')}
                      className="btn-discharge"
                    >
                      Discharge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ambulances' && (
        <div className="ambulances-section">
          <div className="section-header">
            <h2>Ambulance Services</h2>
            <div className="ambulance-summary">
              <span className="ambulance-stat available">Available: {hospitalStats.availableAmbulances}</span>
              <span className="ambulance-stat busy">In Service: {hospitalStats.totalAmbulances - hospitalStats.availableAmbulances}</span>
              <span className="ambulance-stat total">Total: {hospitalStats.totalAmbulances}</span>
            </div>
          </div>
          
          <div className="bookings-list">
            <h3>Ambulance Bookings</h3>
            {ambulanceBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.patientName}</h4>
                  <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                  <p><strong>Destination:</strong> {booking.destination}</p>
                  <p><strong>Ambulance:</strong> {booking.ambulanceNo}</p>
                  <p><strong>Driver:</strong> {booking.driverName}</p>
                </div>
                <div className="booking-actions">
                  <span className={`status ${booking.status.toLowerCase().replace('_', '-')}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.status === 'IN_TRANSIT' && (
                    <button 
                      onClick={() => updateAmbulanceStatus(booking.id, 'COMPLETED')}
                      className="btn-complete"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalPortal;