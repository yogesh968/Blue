import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Calendar,
  FileText,
  User,
  Clock,
  MapPin,
  DollarSign,
  Heart,
  Loader,
  Plus,
  Activity,
  Shield,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MedicalRecords from '../components/MedicalRecords';
import api from '../services/api';
import './UserPortal.css';

const UserPortal = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
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
    // Get user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

      // Use Promise.allSettled to handle partial failures
      const [appointmentsRes, bedBookingsRes, paymentsRes] = await Promise.allSettled([
        api.getAppointments(token),
        api.getBedBookings(token),
        api.getPayments(token)
      ]);

      // Handle Appointments
      if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value.ok) {
        const appointmentsData = await appointmentsRes.value.json();
        const transformedAppointments = appointmentsData.map(apt => {
          const appointmentDate = new Date(apt.appointmentDate);
          return {
            id: apt.id,
            doctorId: apt.doctor.id,
            doctorName: apt.doctor.user.name,

            specialty: apt.doctor.speciality,
            date: appointmentDate.toLocaleDateString(),
            time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hospital: apt.doctor.hospital?.name || 'Hospital',
            location: apt.doctor.hospital?.city || 'Location',
            fee: apt.doctor.fees,
            status: apt.status || 'PENDING',
            reason: apt.reason
          };
        });
        setAppointments(transformedAppointments);
      }

      // Handle Bed Bookings
      if (bedBookingsRes.status === 'fulfilled' && bedBookingsRes.value.ok) {
        const bedBookingsData = await bedBookingsRes.value.json();
        setBedBookings(bedBookingsData);
      }

      // Handle Payments/Bills
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const paymentsData = await paymentsRes.value.json();
        setBills(paymentsData);
      } else {
        setBills([]);
      }

    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.updateAppointmentStatus(id, 'CANCELLED', token);


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

  const bookBed = async (bookingData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a bed');
        return;
      }

      const response = await api.createBedBooking(bookingData, token);

      if (response.ok) {
        const newBooking = await response.json();
        setBedBookings(prev => [...prev, newBooking]);

        toast.success('Bed booked successfully!');

        // Reset form
        setShowBedBookingForm(false);
        setSelectedHospital(null);
        setShowHospitalSelector(false);

        // Refresh data
        setTimeout(fetchUserData, 500);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to book bed');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to book bed');
    }
  };

  const handlePayBill = async (id) => {
    const toastId = toast.loading('Processing payment...');
    try {
      const token = localStorage.getItem('token');
      const response = await api.updatePaymentStatus(id, 'PAID', token);

      if (response.ok) {
        setBills(prev => prev.map(bill =>
          bill.id === id ? { ...bill, status: 'PAID' } : bill
        ));
        toast.success('Payment successful!', { id: toastId });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="user-portal-loading">
        <Loader className="spinner" size={40} />
        <p>Loading your health dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-portal fade-in">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Welcome Section */}
      <section className="portal-welcome">
        <div className="welcome-content">
          <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p>Manage your health journey with ease.</p>
        </div>
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon bg-blue-100 text-blue-600">
              <Calendar size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{appointments.filter(a => a.status === 'PENDING' || a.status === 'pending').length}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-green-100 text-green-600">
              <Heart size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{bedBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length}</span>
              <span className="stat-label">Beds</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-amber-100 text-amber-600">
              <DollarSign size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{bills.filter(b => b.status === 'PENDING').length}</span>
              <span className="stat-label">Bills</span>
            </div>
          </div>
        </div>
      </section>


      {/* Main Navigation */}
      <div className="portal-container">
        <aside className="portal-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={20} />
              <span>Appointments</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'beds' ? 'active' : ''}`}
              onClick={() => setActiveTab('beds')}
            >
              <Heart size={20} />
              <span>Bed Bookings</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'bills' ? 'active' : ''}`}
              onClick={() => setActiveTab('bills')}
            >
              <FileText size={20} />
              <span>Bills & Payments</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
              onClick={() => setActiveTab('records')}
            >
              <Activity size={20} />
              <span>My Records</span>
            </button>
          </nav>

          <div className="sidebar-promo">
            <div className="promo-content">
              <Shield size={24} className="mb-2" />
              <h3>Need Help?</h3>
              <p>24/7 Support for your medical needs.</p>
              <Link to="/emergency" className="btn-promo">Emergency</Link>
            </div>
          </div>
        </aside>

        <main className="portal-main-content">
          {activeTab === 'appointments' && (
            <div className="content-section fade-in">
              <div className="section-header">
                <h2>My Appointments</h2>
                <Link to="/doctors" className="btn-primary sm">
                  <Plus size={16} /> Book New
                </Link>
              </div>

              <div className="cards-grid">
                {appointments.length === 0 ? (
                  <div className="empty-state">
                    <Calendar size={48} />
                    <h3>No appointments scheduled</h3>
                    <p>Find a doctor and book your first consultation today.</p>
                    <Link to="/doctors" className="btn btn-primary mt-4">Find Doctors</Link>
                  </div>
                ) : appointments.map(appointment => (
                  <div key={appointment.id} className="modern-card appointment-card-modern">
                    <div className="card-status">
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="doctor-avatar-placeholder">
                        <User size={24} />
                      </div>
                      <div className="card-info">
                        <Link to={`/doctors/${appointment.doctorId}`} className="doctor-link">
                          <h3>{appointment.doctorName}</h3>
                        </Link>

                        <p className="specialty">{appointment.specialty}</p>
                        <div className="meta-row">
                          <span className="meta-item"><Calendar size={14} /> {appointment.date}</span>
                          <span className="meta-item"><Clock size={14} /> {appointment.time}</span>
                        </div>
                        <div className="location-row">
                          <MapPin size={14} /> {appointment.hospital}, {appointment.location}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="fee">₹{appointment.fee}</span>
                      {appointment.status.toUpperCase() === 'PENDING' && (
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="cancel-btn-modern"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'beds' && (
            <div className="content-section fade-in">
              <div className="section-header">
                <h2>Bed Bookings</h2>
                <button
                  onClick={() => setShowBedBookingForm(!showBedBookingForm)}
                  className="btn-primary sm"
                >
                  {showBedBookingForm ? 'Close Form' : 'Book Bed'}
                </button>
              </div>

              {showBedBookingForm && (
                <div className="booking-form-container slide-down">
                  <div className="form-header">
                    <h3>New Bed Request</h3>
                    <p>Reserve a bed at your preferred hospital</p>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const hospitalId = selectedHospital?.id || formData.get('hospitalId');
                    const bedType = formData.get('bedType');
                    const admissionDate = formData.get('admissionDate');
                    const patientName = formData.get('patientName');
                    const reason = formData.get('reason');

                    if (!hospitalId) return toast.error('Please select a hospital');

                    bookBed({
                      hospitalId,
                      bedType,
                      admissionDate,
                      patientName,
                      reason
                    });
                  }} className="modern-form">

                    <div className="form-group">
                      <label>Select Hospital</label>
                      {selectedHospital ? (
                        <div className="selected-hospital-badge">
                          <span>{selectedHospital.name}</span>
                          <button type="button" onClick={() => setSelectedHospital(null)} className="btn-xs">Change</button>
                        </div>
                      ) : (
                        <div className="hospital-search-box">
                          <button type="button" onClick={() => setShowHospitalSelector(!showHospitalSelector)} className="btn-outline w-full">
                            Choose Hospital...
                          </button>
                          {showHospitalSelector && (
                            <div className="hospital-dropdown">
                              {hospitals.map(h => (
                                <div key={h.id} className="hospital-item" onClick={() => {
                                  setSelectedHospital(h);
                                  setShowHospitalSelector(false);
                                }}>
                                  <strong>{h.name}</strong>
                                  <small>{h.city}</small>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Bed Type</label>
                        <select name="bedType" required className="input-field">
                          <option value="GENERAL">General Ward</option>
                          <option value="PRIVATE">Private Room</option>
                          <option value="SEMI_PRIVATE">Semi-Private</option>
                          <option value="ICU">ICU</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Admission Date</label>
                        <input type="date" name="admissionDate" required className="input-field" min={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Patient Name</label>
                      <input type="text" name="patientName" required className="input-field" placeholder="Full Name" defaultValue={user?.name || ''} />
                    </div>

                    <div className="form-group">
                      <label>Reason for Admission</label>
                      <textarea name="reason" rows="2" required className="input-field" placeholder="Medical reason..."></textarea>
                    </div>

                    <div className="form-actions-right">
                      <button type="submit" className="btn-primary">Confirm Booking</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="cards-grid">
                {bedBookings.length === 0 && !showBedBookingForm ? (
                  <div className="empty-state">
                    <Heart size={48} />
                    <h3>No bed bookings</h3>
                    <p>Your bed reservations will appear here.</p>
                  </div>
                ) : bedBookings.map(booking => (
                  <div key={booking.id} className="modern-card booking-card-modern">
                    <div className="card-header-row">
                      <h4>{booking.hospital?.name || 'Hospital'}</h4>
                      <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="card-body-compact">
                      <p><strong>Type:</strong> {booking.bedType}</p>
                      <p><strong>Date:</strong> {booking.admissionDate ? new Date(booking.admissionDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bills' && (
            <div className="content-section fade-in">
              <div className="section-header">
                <h2>Bills & Payments</h2>
              </div>
              <div className="cards-grid">
                {bills.length === 0 ? (
                  <div className="empty-state">
                    <DollarSign size={48} />
                    <h3>No pending bills</h3>
                    <p>Great! You have no outstanding payments.</p>
                  </div>
                ) : (
                  bills.map(bill => (
                    <div key={bill.id} className="modern-card bill-card">
                      <div className="card-header-row">
                        <h4>{bill.description || `Bill #${bill.id}`}</h4>
                        <span className={`status-pill ${bill.status}`}>
                          {bill.status}
                        </span>
                      </div>
                      <div className="card-body-compact">
                        <p className="bill-amount">₹{bill.amount}</p>
                        <p className="bill-date"><Calendar size={14} /> {bill.date || new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="card-footer">
                        {bill.status !== 'PAID' ? (
                          <button
                            className="btn-primary w-full"
                            onClick={() => handlePayBill(bill.id)}
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button className="btn-secondary w-full" disabled>
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="content-section fade-in">
              <div className="section-header">
                <h2>Medical Records</h2>
              </div>
              <MedicalRecords />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserPortal;