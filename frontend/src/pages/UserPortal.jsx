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

  const [hospitals, setHospitals] = useState([]);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.getHospitals();
      if (response.ok) {
        const hospitalsData = await response.json();
        setHospitals(hospitalsData);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

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

      const [appointmentsRes, bedBookingsRes] = await Promise.all([
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

      if (bedBookingsRes.ok) {
        const bedBookingsData = await bedBookingsRes.json();
        setBedBookings(bedBookingsData);
      } else {
        console.warn('Failed to fetch bed bookings');
        setBedBookings([]);
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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a bed');
        return;
      }

      console.log('Booking bed with data:', bookingData);
      
      const response = await api.createBedBooking({
        hospitalId: bookingData.hospitalId,
        bedType: bookingData.bedType,
        admissionDate: bookingData.admissionDate,
        patientName: bookingData.patientName,
        reason: bookingData.reason
      }, token);
      
      console.log('Bed booking response:', response);
      
      if (response.ok) {
        const newBooking = await response.json();
        console.log('New booking created:', newBooking);
        setBedBookings(prev => [...prev, newBooking]);
        toast.success('Bed booked successfully!');
        setShowBedBookingForm(false);
        setSelectedHospital(null);
        fetchUserData(); // Refresh data
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Bed booking failed:', errorData);
        throw new Error(errorData.error || 'Failed to book bed');
      }
    } catch (err) {
      console.error('Bed booking error:', err);
      toast.error(err.message || 'Failed to book bed');
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('appointments');
              setShowBedBookingForm(false);
              setSelectedHospital(null);
              setShowHospitalSelector(false);
            }}
          >
            <Calendar size={16} /> Appointments
          </button>
          <button 
            className={`tab ${activeTab === 'beds' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('beds');
            }}
          >
            <Heart size={16} /> Bed Bookings
          </button>
          <button 
            className={`tab ${activeTab === 'bills' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('bills');
              setShowBedBookingForm(false);
              setSelectedHospital(null);
              setShowHospitalSelector(false);
            }}
          >
            <FileText size={16} /> Bills
          </button>
          <button 
            className={`tab ${activeTab === 'records' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab('records');
              setShowBedBookingForm(false);
              setSelectedHospital(null);
              setShowHospitalSelector(false);
            }}
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
                const hospitalId = selectedHospital?.hospitalId || formData.get('hospitalId');
                const bedType = formData.get('bedType');
                const admissionDate = formData.get('admissionDate');
                const patientName = formData.get('patientName');
                const reason = formData.get('reason');
                
                console.log('Form data:', { hospitalId, bedType, admissionDate, patientName, reason });
                
                if (!hospitalId) {
                  toast.error('Please select a hospital');
                  return;
                }
                
                if (!bedType) {
                  toast.error('Please select a bed type');
                  return;
                }
                
                if (!admissionDate) {
                  toast.error('Please select an admission date');
                  return;
                }
                
                if (!patientName) {
                  toast.error('Please enter patient name');
                  return;
                }
                
                if (!reason) {
                  toast.error('Please enter reason for admission');
                  return;
                }
                
                bookBed({
                  hospitalId,
                  bedType,
                  admissionDate,
                  patientName,
                  reason
                });
              }}>
                <div className="form-group">
                  <label>Hospital *</label>
                  {selectedHospital ? (
                    <div className="selected-hospital">
                      <input 
                        type="hidden" 
                        name="hospitalId" 
                        value={selectedHospital.hospitalId}
                      />
                      <input 
                        type="text" 
                        value={selectedHospital.hospitalName} 
                        readOnly
                        className="readonly-input"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedHospital(null);
                          setShowHospitalSelector(true);
                        }}
                        className="btn-change"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button 
                        type="button" 
                        onClick={() => setShowHospitalSelector(true)}
                        className="btn-select-hospital"
                      >
                        Select Hospital
                      </button>
                      {showHospitalSelector && (
                        <div className="hospital-selector">
                          <h4>Choose Hospital:</h4>
                          <div className="hospital-list">
                            {hospitals.map(hospital => (
                              <div 
                                key={hospital.id} 
                                className="hospital-option"
                                onClick={() => {
                                  setSelectedHospital({
                                    hospitalId: hospital.id,
                                    hospitalName: hospital.name
                                  });
                                  setShowHospitalSelector(false);
                                }}
                              >
                                <h5>{hospital.name}</h5>
                                <p>{hospital.address}</p>
                                <p>{hospital.city}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Bed Type *</label>
                  <select name="bedType" required>
                    <option value="">Select bed type</option>
                    <option value="GENERAL">General Ward</option>
                    <option value="PRIVATE">Private Room</option>
                    <option value="SEMI_PRIVATE">Semi-Private</option>
                    <option value="ICU">ICU</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Date *</label>
                  <input 
                    type="date" 
                    name="admissionDate" 
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input type="text" name="patientName" required placeholder="Enter patient name" />
                </div>
                <div className="form-group">
                  <label>Reason for Admission *</label>
                  <textarea 
                    name="reason" 
                    rows="3" 
                    required 
                    placeholder="Describe the reason for admission"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowBedBookingForm(false);
                      setSelectedHospital(null);
                      setShowHospitalSelector(false);
                    }}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
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