import React, { useState, useEffect } from 'react';
import { Calendar, FileText, User, Clock, MapPin, DollarSign, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import MedicalRecords from '../components/MedicalRecords';
import './UserPortal.css';

const UserPortal = () => {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');

  // Mock user appointments
  const mockAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-01-15',
      time: '10:00 AM',
      hospital: 'Apollo Hospital',
      location: 'Mumbai',
      status: 'confirmed',
      fee: 800
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      date: '2024-01-20',
      time: '2:00 PM',
      hospital: 'Max Healthcare',
      location: 'Delhi',
      status: 'pending',
      fee: 1200
    }
  ];

  // Mock user bills
  const mockBills = [
    {
      id: 1,
      hospitalName: 'Apollo Hospital',
      admissionDate: '2024-01-10',
      dischargeDate: '2024-01-15',
      totalAmount: 15800,
      status: 'paid',
      charges: {
        bedCharge: 10000,
        foodCharge: 2500,
        medicineCharge: 1500,
        doctorFee: 800,
        otherCharges: 1000
      }
    },
    {
      id: 2,
      hospitalName: 'Fortis Hospital',
      admissionDate: '2024-01-05',
      dischargeDate: '2024-01-08',
      totalAmount: 8500,
      status: 'pending',
      charges: {
        bedCharge: 6000,
        foodCharge: 1500,
        medicineCharge: 800,
        doctorFee: 600,
        otherCharges: 600
      }
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
    setBills(mockBills);
  }, []);

  const cancelAppointment = (id) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
    );
    toast.success('Appointment cancelled successfully!');
  };

  const payBill = (id) => {
    setBills(prev => 
      prev.map(bill => bill.id === id ? { ...bill, status: 'paid' } : bill)
    );
    toast.success('Bill paid successfully!');
  };

  return (
    <div className="user-portal">
      <Toaster position="top-right" />
      
      <div className="portal-header">
        <h1>My Healthcare Dashboard</h1>
      </div>

      <div className="portal-tabs">
        <button 
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={20} />
          My Appointments
        </button>
        <button 
          className={`tab ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          <FileText size={20} />
          My Bills
        </button>
        <button 
          className={`tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          <Heart size={20} />
          Medical Records
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <h2>My Appointments</h2>
          <div className="appointments-list">
            {appointments.map(appointment => (
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
                  {appointment.status === 'confirmed' && (
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
            {bills.map(bill => (
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