import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Dashboard,
  Schedule,
  LocationOn,
  Analytics,
  People,
  AttachMoney,
  AccessTime,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';

const DoctorPortal = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [profileData, setProfileData] = useState({
    speciality: '',
    experience: '',
    fees: '',
    qualification: ''
  });

  const specialities = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Gynecology', 'ENT', 'Ophthalmology',
    'Urology', 'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Oncology'
  ];

  const qualifications = [
    'MBBS', 'MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, DM', 'MBBS, MCh',
    'BDS', 'BDS, MDS', 'BAMS', 'BHMS', 'BUMS', 'BPT', 'MBBS, FRCS'
  ];


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



  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      initializeDoctorData();
    }
  }, []);

  const initializeDoctorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to get doctor profile
      const profileRes = await fetch('http://localhost:3001/api/doctors/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const doctorProfileData = await profileRes.json();
        setDoctorProfile(doctorProfileData);
        localStorage.setItem('doctorId', doctorProfileData.id.toString());
        fetchDoctorData(doctorProfileData.id);
      } else {
        // No profile found, clear localStorage and show profile creation
        localStorage.removeItem('doctorId');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing doctor data:', error);
      setLoading(false);
    }
  };

  const fetchDoctorData = async (doctorId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch appointments
      try {
        const appointmentsRes = await api.getDoctorAppointments(doctorId, '', token);
        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          setAppointments(appointmentsData);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Appointments error:', error);
        setAppointments([]);
      }
      
      // Fetch locations
      try {
        const locationsRes = await api.getDoctorLocations(doctorId, token);
        if (locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setLocations(locationsData);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error('Locations error:', error);
        setLocations([]);
      }
    } catch (error) {
      toast.error('Failed to load doctor data');
    } finally {
      setLoading(false);
    }
  };

  const initializeSchedule = async () => {
    try {
      const doctorId = localStorage.getItem('doctorId');
      if (doctorId) {
        const token = localStorage.getItem('token');
        const response = await api.getDoctorSchedule(doctorId, token);
        
        if (response.ok) {
          const scheduleData = await response.json();
          setWeeklySchedule(scheduleData);
        } else {
          // Fallback to localStorage or default
          const savedSchedule = localStorage.getItem('doctorSchedule');
          if (savedSchedule) {
            setWeeklySchedule(JSON.parse(savedSchedule));
          } else {
            setWeeklySchedule(getDefaultSchedule());
          }
        }
      } else {
        setWeeklySchedule(getDefaultSchedule());
      }
    } catch (error) {
      const savedSchedule = localStorage.getItem('doctorSchedule');
      if (savedSchedule) {
        setWeeklySchedule(JSON.parse(savedSchedule));
      } else {
        setWeeklySchedule(getDefaultSchedule());
      }
    }
  };

  const getDefaultSchedule = () => ({
    monday: { startTime: '09:00', endTime: '17:00', available: true },
    tuesday: { startTime: '09:00', endTime: '17:00', available: true },
    wednesday: { startTime: '09:00', endTime: '17:00', available: true },
    thursday: { startTime: '09:00', endTime: '17:00', available: true },
    friday: { startTime: '09:00', endTime: '17:00', available: true },
    saturday: { startTime: '09:00', endTime: '13:00', available: true },
    sunday: { startTime: '09:00', endTime: '13:00', available: false }
  });

  const updateSchedule = (day, field, value) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const saveSchedule = async () => {
    try {
      const doctorId = localStorage.getItem('doctorId');
      const token = localStorage.getItem('token');
      const response = await api.updateDoctorSchedule(doctorId, weeklySchedule, token);
      
      if (response.ok) {
        localStorage.setItem('doctorSchedule', JSON.stringify(weeklySchedule));
        toast.success('Schedule updated successfully!');
        setShowScheduleModal(false);
      } else {
        throw new Error('Failed to update schedule');
      }
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['appointments', 'locations', 'schedule'].includes(hash)) {
      setActiveTab(hash);
    } else if (!hash) {
      setActiveTab('dashboard');
    }
  }, [location.hash]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const doctorId = localStorage.getItem('doctorId');
      const token = localStorage.getItem('token');
      const response = await api.addDoctorLocation(doctorId, newLocation, token);
      
      if (response.ok) {
        toast.success('Location added successfully!');
        fetchDoctorData(parseInt(doctorId)); // Refresh data
        setShowAddLocation(false);
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
      } else {
        throw new Error('Failed to add location');
      }
    } catch (error) {
      toast.error('Failed to add location');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: status.toUpperCase() })
      });
      
      if (response.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status } : apt)
        );
        toast.success(`Appointment ${status}!`);
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowEditLocation(true);
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.updateDoctorLocation(editingLocation.id, editingLocation, token);
      
      if (response.ok) {
        toast.success('Location updated successfully!');
        const doctorId = localStorage.getItem('doctorId');
        fetchDoctorData(parseInt(doctorId));
        setShowEditLocation(false);
        setEditingLocation(null);
      } else {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      toast.error('Failed to update location');
    }
  };

  const deleteLocation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.deleteDoctorLocation(id, token);
      
      if (response.ok) {
        setLocations(locations.filter(loc => loc.id !== id));
        toast.success('Location removed successfully!');
      } else {
        throw new Error('Failed to delete location');
      }
    } catch (error) {
      toast.error('Failed to delete location');
    }
  };

  const getTotalStats = () => {
    const totalPatients = locations.reduce((sum, loc) => sum + (loc.totalPatients || 0), 0);
    const todayPatients = appointments.length;
    const totalEarnings = appointments.reduce((sum, apt) => sum + (apt.fees || 0), 0);
    return { totalPatients, todayPatients, totalEarnings };
  };

  const stats = getTotalStats();

  // Check if doctor profile exists
  const doctorId = localStorage.getItem('doctorId');
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Show profile creation form if no doctor profile exists in database
  if (!doctorProfile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
            Complete Your Doctor Profile
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Please complete your profile to access the doctor dashboard.
          </Typography>
          
          <Box component="form" onSubmit={async (e) => {
            e.preventDefault();
            
            try {
              const token = localStorage.getItem('token');
              const profileDataWithStatus = {
                ...profileData
              };
              
              const response = await fetch('http://localhost:3001/api/doctors/profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileDataWithStatus)
              });
              
              if (response.ok) {
                const doctor = await response.json();
                localStorage.setItem('doctorId', doctor.id.toString());
                toast.success('Profile created successfully! You are now visible to patients.');
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                  window.location.href = '/doctor-portal';
                }, 2000);
              } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create profile');
              }
            } catch (error) {
              console.error('Profile creation error:', error);
              toast.error('Failed to create profile. Please try again.');
            }
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Medical Speciality</InputLabel>
                  <Select
                    value={profileData.speciality}
                    onChange={(e) => setProfileData({...profileData, speciality: e.target.value})}
                    label="Medical Speciality"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <em>Select your speciality</em>;
                      }
                      return selected;
                    }}
                  >
                    {specialities.map((spec) => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Medical Qualification</InputLabel>
                  <Select
                    value={profileData.qualification}
                    onChange={(e) => setProfileData({...profileData, qualification: e.target.value})}
                    label="Medical Qualification"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <em>Select your qualification</em>;
                      }
                      return selected;
                    }}
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (years)"
                  type="number"
                  required
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Consultation Fees (₹)"
                  type="number"
                  required
                  value={profileData.fees}
                  onChange={(e) => setProfileData({...profileData, fees: e.target.value})}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Create Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Toaster position="top-right" />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4DB6E2 0%, #1A2A33 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Doctor Dashboard
          </Typography>
        </motion.div>



        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
              title: "Today's Appointments",
              value: stats.todayPatients,
              color: 'primary.main',
            },
            {
              icon: <Schedule sx={{ fontSize: 40, color: 'secondary.main' }} />,
              title: 'Total Patients',
              value: stats.totalPatients,
              color: 'secondary.main',
            },
            {
              icon: <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />,
              title: "Today's Earnings",
              value: `₹${stats.totalEarnings}`,
              color: 'success.main',
            },
            {
              icon: <LocationOn sx={{ fontSize: 40, color: 'warning.main' }} />,
              title: 'Active Locations',
              value: locations.length,
              color: 'warning.main',
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0px 8px 30px rgba(77, 182, 226, 0.15)`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          backgroundColor: `${stat.color}20`,
                          mr: 2,
                          width: 60,
                          height: 60,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Dashboard Overview
        </Typography>
      </Container>
    </Box>
  );
};

export default DoctorPortal;