import React, { useState } from 'react';
import { Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './AppointmentBooking.css';

const AppointmentBooking = ({ doctor, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
    patientInfo: {
      name: '',
      age: '',
      phone: '',
      email: ''
    },
    paymentMethod: 'CARD'
  });

  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && (!bookingData.date || !bookingData.time)) {
      toast.error('Please select date and time');
      return;
    }
    if (step === 2 && !bookingData.reason.trim()) {
      toast.error('Please provide reason for visit');
      return;
    }
    if (step === 3 && (!bookingData.patientInfo.name || !bookingData.patientInfo.phone)) {
      toast.error('Please fill required patient information');
      return;
    }
    setStep(step + 1);
  };

  const handleBooking = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Appointment booked successfully!');
      onSuccess && onSuccess(bookingData);
      setStep(5); // Success step
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="booking-step">
            <div className="step-header">
              <Calendar size={24} />
              <h3>Select Date & Time</h3>
            </div>
            <div className="date-time-selection">
              <div className="date-selection">
                <label>Select Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="time-selection">
                <label>Available Time Slots</label>
                <div className="time-slots">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      className={`time-slot ${bookingData.time === slot ? 'selected' : ''}`}
                      onClick={() => handleInputChange('time', slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="booking-step">
            <div className="step-header">
              <User size={24} />
              <h3>Reason for Visit</h3>
            </div>
            <div className="reason-selection">
              <label>Please describe your symptoms or reason for consultation</label>
              <textarea
                value={bookingData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Describe your symptoms, concerns, or reason for visit..."
                rows={4}
              />
              <div className="common-reasons">
                <p>Common reasons:</p>
                <div className="reason-tags">
                  {['Regular Checkup', 'Follow-up', 'Chest Pain', 'Headache', 'Fever'].map(reason => (
                    <button
                      key={reason}
                      className="reason-tag"
                      onClick={() => handleInputChange('reason', reason)}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="booking-step">
            <div className="step-header">
              <User size={24} />
              <h3>Patient Information</h3>
            </div>
            <div className="patient-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={bookingData.patientInfo.name}
                    onChange={(e) => handleInputChange('patientInfo.name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={bookingData.patientInfo.age}
                    onChange={(e) => handleInputChange('patientInfo.age', e.target.value)}
                    placeholder="Age"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={bookingData.patientInfo.phone}
                    onChange={(e) => handleInputChange('patientInfo.phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={bookingData.patientInfo.email}
                    onChange={(e) => handleInputChange('patientInfo.email', e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="booking-step">
            <div className="step-header">
              <CreditCard size={24} />
              <h3>Payment & Confirmation</h3>
            </div>
            <div className="payment-section">
              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span>Doctor:</span>
                  <span>{doctor.name}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{bookingData.date}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{bookingData.time}</span>
                </div>
                <div className="summary-item">
                  <span>Patient:</span>
                  <span>{bookingData.patientInfo.name}</span>
                </div>
                <div className="summary-item total">
                  <span>Consultation Fee:</span>
                  <span>₹{doctor.fee}</span>
                </div>
              </div>
              
              <div className="payment-methods">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  {['CARD', 'UPI', 'NETBANKING'].map(method => (
                    <label key={method} className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={bookingData.paymentMethod === method}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="booking-step success-step">
            <div className="success-content">
              <CheckCircle size={64} className="success-icon" />
              <h3>Appointment Booked Successfully!</h3>
              <p>Your appointment has been confirmed</p>
              <div className="appointment-details">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Date:</strong> {bookingData.date}</p>
                <p><strong>Time:</strong> {bookingData.time}</p>
                <p><strong>Patient:</strong> {bookingData.patientInfo.name}</p>
              </div>
              <button className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="appointment-booking-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {step < 5 && (
          <div className="progress-bar">
            <div className="progress-steps">
              {[1, 2, 3, 4].map(stepNum => (
                <div key={stepNum} className={`progress-step ${step >= stepNum ? 'active' : ''}`}>
                  {stepNum}
                </div>
              ))}
            </div>
            <div className="progress-line">
              <div 
                className="progress-fill" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="modal-body">
          {renderStep()}
        </div>

        {step < 5 && (
          <div className="modal-footer">
            {step > 1 && (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 4 ? (
              <button className="btn-primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="btn-primary" onClick={handleBooking}>
                Confirm & Pay ₹{doctor.fee}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;