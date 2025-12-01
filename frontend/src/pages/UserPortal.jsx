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
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['appointments', 'bills', 'records'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

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