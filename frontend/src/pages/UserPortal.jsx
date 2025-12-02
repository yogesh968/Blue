import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, FileText, User, Clock, MapPin, DollarSign, Heart, Loader } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MedicalRecords from '../components/MedicalRecords';
import api from '../services/api';
import './UserPortal.css';

const UserPortal = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [bedBookings, setBedBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBedBookingForm, setShowBedBookingForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab && ['appointments', 'beds', 'bills', 'records'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Check if coming from hospital bed booking
    if (location.state?.hospitalId) {
      setSelectedHospital(location.state);
      setActiveTab('beds');
      setShowBedBookingForm(true);
    }
  }, [location]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your data');
        return;
      }

      const [appointmentsRes, billsRes] = await Promise.all([
        api.getAppointments(token),
        api.getBedBookings(token)
      ]);

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        // Transform API data to match frontend format
        const transformedAppointments = appointmentsData.map(apt => {
          const appointmentDate = new Date(apt.appointmentDate);
          return {
            id: apt.id,
            doctorName: apt.doctor.user.name,
            specialty: apt.doctor.speciality,
            date: appointmentDate.toLocaleDateString(),
            time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hospital: apt.doctor.hospital?.name || 'Hospital',
            location: apt.doctor.hospital?.city || 'Location',
            fee: apt.doctor.fees,
            status: apt.status.toLowerCase(),
            reason: apt.reason
          };
        });
        setAppointments(transformedAppointments);
      } else {
        throw new Error('Failed to fetch appointments');
      }

      if (billsRes.ok) {
        const billsData = await billsRes.json();
        setBills(billsData);
      } else {
        console.warn('Failed to fetch bills');
        setBills([]);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });

      if (response.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
        );
        toast.success('Appointment cancelled successfully!');
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const payBill = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const bill = bills.find(b => b.id === id);
      
      const response = await api.createPayment({
        billId: id,
        amount: bill.totalAmount,
        type: 'bill_payment'
      }, token);

      if (response.ok) {
        setBills(prev => 
          prev.map(bill => bill.id === id ? { ...bill, status: 'paid' } : bill)
        );
        toast.success('Bill paid successfully!');
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  const bookBed = async (bookingData) => {
    try {
      const mockBooking = {
        id: Date.now().toString(),
        hospital: { name: selectedHospital?.hospitalName || 'Selected Hospital' },
        bedType: bookingData.bedType,
        admissionDate: bookingData.admissionDate,
        status: 'confirmed',
        patientName: bookingData.patientName,
        reason: bookingData.reason
      };
      
      setBedBookings(prev => [...prev, mockBooking]);
      toast.success('Bed booked successfully!');
      setShowBedBookingForm(false);
      setSelectedHospital(null);
    } catch (err) {
      toast.error('Failed to book bed');
    }
  };

  if (loading) {
    return (
      <div className="user-portal">
        <div className="loading-container">
          <Loader className="spinner" size={40} />
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-portal">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchUserData} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal">
      <Toaster position="top-right" />
      
      <div className="portal-header">
        <h1>My Healthcare Dashboard</h1>
        <div className="portal-tabs">
          <button 
            className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={16} /> Appointments
          </button>
          <button 
            className={`tab ${activeTab === 'beds' ? 'active' : ''}`}
            onClick={() => setActiveTab('beds')}
          >
            <Heart size={16} /> Bed Bookings
          </button>
          <button 
            className={`tab ${activeTab === 'bills' ? 'active' : ''}`}
            onClick={() => setActiveTab('bills')}
          >
            <FileText size={16} /> Bills
          </button>
          <button 
            className={`tab ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <User size={16} /> Records
          </button>
        </div>
      </div>



      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <h2>My Appointments</h2>
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <p>No appointments found</p>
              </div>
            ) : appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <div className="doctor-info">
                    <h4>{appointment.doctorName}</h4>
                    <p className="specialty">{appointment.specialty}</p>
                  </div>
                  <div className="appointment-details">
                    <p><Calendar size={16} /> {appointment.date}</p>
                    <p><Clock size={16} /> {appointment.time}</p>
                    <p><MapPin size={16} /> {appointment.hospital}, {appointment.location}</p>
                    <p><DollarSign size={16} /> ₹{appointment.fee}</p>
                  </div>
                </div>
                <div className="appointment-actions">
                  <span className={`status ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'pending' && (
                    <button 
                      onClick={() => cancelAppointment(appointment.id)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beds' && (
        <div className="beds-section">
          <div className="section-header">
            <h2>Bed Bookings</h2>
            <button 
              onClick={() => setShowBedBookingForm(true)}
              className="btn-primary"
            >
              Book New Bed
            </button>
          </div>
          
          {showBedBookingForm && (
            <div className="bed-booking-form">
              <h3>Book Hospital Bed</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                bookBed({
                  hospitalId: selectedHospital?.hospitalId || formData.get('hospitalId'),
                  bedType: formData.get('bedType'),
                  admissionDate: formData.get('admissionDate'),
                  patientName: formData.get('patientName'),
                  reason: formData.get('reason')
                });
              }}>
                <div className="form-group">
                  <label>Hospital:</label>
                  <input 
                    type="text" 
                    value={selectedHospital?.hospitalName || 'Select Hospital'} 
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Bed Type:</label>
                  <select name="bedType" required>
                    <option value="">Select bed type</option>
                    <option value="GENERAL">General Ward</option>
                    <option value="PRIVATE">Private Room</option>
                    <option value="SEMI_PRIVATE">Semi-Private</option>
                    <option value="ICU">ICU</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Date:</label>
                  <input 
                    type="date" 
                    name="admissionDate" 
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Patient Name:</label>
                  <input type="text" name="patientName" required />
                </div>
                <div className="form-group">
                  <label>Reason for Admission:</label>
                  <textarea name="reason" rows="3" required></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowBedBookingForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Book Bed</button>
                </div>
              </form>
            </div>
          )}
          
          <div className="bookings-list">
            {bedBookings.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} />
                <p>No bed bookings found</p>
              </div>
            ) : bedBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.hospital?.name || 'Hospital'}</h4>
                  <p><strong>Bed Type:</strong> {booking.bedType}</p>
                  <p><strong>Admission:</strong> {new Date(booking.admissionDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="bills-section">
          <h2>My Bills</h2>
          <div className="bills-list">
            {bills.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <p>No bills found</p>
              </div>
            ) : bills.map(bill => (
              <div key={bill.id} className="bill-card">
                <div className="bill-header">
                  <h4>{bill.hospitalName}</h4>
                  <span className={`status ${bill.status}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="bill-info">
                  <p><strong>Admission:</strong> {bill.admissionDate}</p>
                  <p><strong>Discharge:</strong> {bill.dischargeDate}</p>
                  <div className="charges-breakdown">
                    <h5>Charges Breakdown:</h5>
                    <div className="charges-grid">
                      <p>Bed Charge: <span>₹{bill.charges.bedCharge}</span></p>
                      <p>Food Charge: <span>₹{bill.charges.foodCharge}</span></p>
                      <p>Medicine: <span>₹{bill.charges.medicineCharge}</span></p>
                      <p>Doctor Fee: <span>₹{bill.charges.doctorFee}</span></p>
                      <p>Other Charges: <span>₹{bill.charges.otherCharges}</span></p>
                    </div>
                    <div className="total-amount">
                      <strong>Total Amount: ₹{bill.totalAmount}</strong>
                    </div>
                  </div>
                </div>
                <div className="bill-actions">
                  {bill.status === 'pending' && (
                    <button 
                      onClick={() => payBill(bill.id)}
                      className="btn-pay"
                    >
                      Pay Now
                    </button>
                  )}
                  <button className="btn-download">
                    Download Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="records-section">
          <MedicalRecords />
        </div>
      )}
    </div>
  );
};

export default UserPortal;