import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star,
    MapPin,
    Clock,
    DollarSign,
    User,
    ChevronLeft,
    Calendar,
    Award,
    ShieldCheck,
    MessageSquare
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import AppointmentBooking from '../components/AppointmentBooking';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                setLoading(true);
                const response = await api.getDoctorById(id);
                if (!response.ok) {
                    throw new Error('Doctor not found');
                }
                const data = await response.json();

                // Transform data
                setDoctor({
                    id: data.id,
                    name: data.user?.name || 'Unknown Doctor',
                    specialty: data.speciality,
                    experience: `${data.experience}+ years`,
                    rating: data.averageRating || 4.5,
                    reviews: data.totalReviews || 0,
                    fee: data.fees,
                    hospital: data.hospital?.name || 'General Hospital',
                    location: data.hospital?.city || 'Mumbai',
                    qualification: data.qualification,
                    bio: data.bio || `Dr. ${data.user?.name} is a highly experienced ${data.speciality} dedicated to providing exceptional care. With over ${data.experience} years in the field, they have helped numerous patients achieve better health outcomes.`,
                    image: "👨‍⚕️",
                    available: data.isAvailable !== false,
                    achievements: [
                        "Top Rated Specialist 2023",
                        "Medical Excellence Award",
                        "Board Certified Professional"
                    ]
                });
            } catch (err) {
                console.error('Error fetching doctor:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [id]);

    const handleBookNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem('pendingAppointment', JSON.stringify(doctor));
            toast.error('Please login to book an appointment');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setShowBooking(true);
    };

    if (loading) {
        return (
            <div className="profile-loading-container">
                <div className="spinner"></div>
                <p>Loading doctor profile...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="profile-error-container">
                <h2>Oops! Profile Not Found</h2>
                <p>The doctor profile you are looking for might have been moved or doesn't exist.</p>
                <button onClick={() => navigate('/doctors')} className="back-btn">
                    <ChevronLeft size={20} /> Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="doctor-profile-page">
            <Toaster position="top-right" />

            <div className="container">
                <button onClick={() => navigate(-1)} className="back-navigation">
                    <ChevronLeft size={20} /> Back
                </button>

                <div className="profile-layout">
                    {/* Main Content */}
                    <div className="profile-main">
                        <div className="doctor-hero-card">
                            <div className="doctor-hero-header">
                                <div className="profile-image-large">
                                    <User size={80} />
                                </div>
                                <div className="hero-info">
                                    <div className="name-row">
                                        <h1>{doctor.name}</h1>
                                        <span className={`status-pill ${doctor.available ? 'available' : 'busy'}`}>
                                            {doctor.available ? 'Available' : 'Busy'}
                                        </span>
                                    </div>
                                    <p className="specialty-text">{doctor.specialty}</p>
                                    <p className="qualification-text">{doctor.qualification}</p>

                                    <div className="rating-summary">
                                        <div className="stars">
                                            <Star size={18} fill="var(--color-warning)" color="var(--color-warning)" />
                                            <span className="rating-val">{doctor.rating}</span>
                                        </div>
                                        <span className="review-count">({doctor.reviews} patient reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-stats-grid">
                                <div className="stat-item">
                                    <Clock size={24} className="stat-icon" />
                                    <div className="stat-content">
                                        <span className="stat-label">Experience</span>
                                        <span className="stat-value">{doctor.experience}</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <MapPin size={24} className="stat-icon" />
                                    <div className="stat-content">
                                        <span className="stat-label">Location</span>
                                        <span className="stat-value">{doctor.location}</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <DollarSign size={24} className="stat-icon" />
                                    <div className="stat-content">
                                        <span className="stat-label">Consultation Fee</span>
                                        <span className="stat-value">₹{doctor.fee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content-section">
                            <h3>About Doctor</h3>
                            <p className="bio-text">{doctor.bio}</p>
                        </div>

                        <div className="profile-content-section">
                            <h3>Specializations & Expertise</h3>
                            <div className="tags-container">
                                <span className="expert-tag">{doctor.specialty}</span>
                                <span className="expert-tag">General Medicine</span>
                                <span className="expert-tag">Patient Counseling</span>
                                <span className="expert-tag">Post-operative Care</span>
                            </div>
                        </div>

                        <div className="profile-content-section">
                            <h3>Practice Location</h3>
                            <div className="hospital-info-card">
                                <ShieldCheck size={32} className="hospital-icon" />
                                <div className="hospital-details">
                                    <h4>{doctor.hospital}</h4>
                                    <p><MapPin size={14} /> {doctor.location}, India</p>
                                    <p><Calendar size={14} /> Mon - Sat, 09:00 AM - 05:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Booking */}
                    <aside className="profile-sidebar">
                        <div className="booking-sticky-card">
                            <h3>Book Appointment</h3>
                            <p>Secure your slot instantly</p>

                            <div className="price-overview">
                                <span>Fee per Visit</span>
                                <span className="price">₹{doctor.fee}</span>
                            </div>

                            <button
                                className={`booking-btn ${!doctor.available ? 'disabled' : ''}`}
                                onClick={handleBookNow}
                                disabled={!doctor.available}
                            >
                                {doctor.available ? 'Continue to Booking' : 'Not Available'}
                            </button>

                            <div className="booking-perks">
                                <div className="perk">
                                    <ShieldCheck size={16} />
                                    <span>Verified Professional</span>
                                </div>
                                <div className="perk">
                                    <MessageSquare size={16} />
                                    <span>Instant Confirmation</span>
                                </div>
                            </div>
                        </div>

                        <div className="achievements-card">
                            <h3>Achievements</h3>
                            <ul>
                                {doctor.achievements.map((ach, idx) => (
                                    <li key={idx}>
                                        <Award size={16} className="text-primary" />
                                        <span>{ach}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            {showBooking && (
                <AppointmentBooking
                    doctor={doctor}
                    onClose={() => setShowBooking(false)}
                    onSuccess={() => {
                        setShowBooking(false);
                        toast.success('Appointment booked successfully!');
                        setTimeout(() => navigate('/user-portal?tab=appointments'), 2000);
                    }}
                />
            )}
        </div>
    );
};

export default DoctorProfile;
