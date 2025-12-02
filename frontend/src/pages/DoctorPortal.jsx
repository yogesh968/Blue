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
    const doctorId = localStorage.getItem('doctorId');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (doctorId) {
        fetchDoctorData(parseInt(doctorId));
      }
    }
    initializeSchedule();
  }, []);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4DB6E2 0%, #1A2A33 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome, {user?.name || 'Doctor'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Manage your practice and appointments
              </Typography>
            </Box>
          </Box>
          
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Dashboard"
              value="dashboard"
              icon={<Dashboard />}
              iconPosition="start"
            />
            <Tab
              label="Appointments"
              value="appointments"
              icon={<Schedule />}
              iconPosition="start"
            />
            <Tab
              label="Locations"
              value="locations"
              icon={<LocationOn />}
              iconPosition="start"
            />
            <Tab
              label="Schedule"
              value="schedule"
              icon={<AccessTime />}
              iconPosition="start"
            />
          </Tabs>
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

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
              Dashboard Overview
            </Typography>
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
              Today's Appointments
            </Typography>
            <Grid container spacing={2}>
              {appointments.map(appointment => (
                <Grid item xs={12} key={appointment.id}>
                  <Card sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {appointment.patientName}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                            {appointment.appointmentTime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                            {appointment.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Age: {appointment.patientAge}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="error.main" sx={{ mb: 0.5 }}>
                          Symptoms: {appointment.symptoms}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          Fees: ₹{appointment.fees}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                        <Chip
                          label={appointment.status}
                          color={appointment.status === 'confirmed' ? 'success' : appointment.status === 'pending' ? 'warning' : 'error'}
                          size="small"
                        />
                        {appointment.status === 'pending' && (
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 'locations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              My Consultation Locations
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddLocation(true)}
            >
              Add Location
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {locations.map(location => (
              <Grid item xs={12} md={6} lg={4} key={location.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 8px 30px rgba(77, 182, 226, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {location.name}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button 
                          size="small" 
                          startIcon={<Edit />}
                          onClick={() => handleEditLocation(location)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<Delete />}
                          onClick={() => deleteLocation(location.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                        {location.address}, {location.city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                        {location.timings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📞 {location.phone}
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                        ₹{location.fees} per consultation
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-around" sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box textAlign="center">
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>
                          {location.patientsToday}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Today
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>
                          {location.totalPatients}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog
            open={showAddLocation}
            onClose={() => setShowAddLocation(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Add New Location
              </Typography>
            </DialogTitle>
            <form onSubmit={handleAddLocation}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Clinic/Hospital Name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={newLocation.city}
                      onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      type="tel"
                      value={newLocation.phone}
                      onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Consultation Fees (₹)"
                      type="number"
                      value={newLocation.fees}
                      onChange={(e) => setNewLocation({...newLocation, fees: e.target.value})}
                      required
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAddLocation(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Add Location
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog
            open={showEditLocation}
            onClose={() => {
              setShowEditLocation(false);
              setEditingLocation(null);
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Edit Location
              </Typography>
            </DialogTitle>
            {editingLocation && (
              <form onSubmit={handleUpdateLocation}>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Clinic/Hospital Name"
                        value={editingLocation.name}
                        onChange={(e) => setEditingLocation({...editingLocation, name: e.target.value})}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={editingLocation.address}
                        onChange={(e) => setEditingLocation({...editingLocation, address: e.target.value})}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={editingLocation.city}
                        onChange={(e) => setEditingLocation({...editingLocation, city: e.target.value})}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        type="tel"
                        value={editingLocation.phone}
                        onChange={(e) => setEditingLocation({...editingLocation, phone: e.target.value})}
                        required
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => {
                    setShowEditLocation(false);
                    setEditingLocation(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Update Location
                  </Button>
                </DialogActions>
              </form>
            )}
          </Dialog>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Schedule Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setShowScheduleModal(true)}
              >
                Update Schedule
              </Button>
            </Box>
            
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Weekly Schedule
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(weeklySchedule).map(([day, schedule]) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                            {day}
                          </Typography>
                          {schedule.available ? (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {schedule.startTime} - {schedule.endTime}
                              </Typography>
                              <Chip label="Available" color="success" size="small" sx={{ mt: 1 }} />
                            </>
                          ) : (
                            <Chip label="Not Available" color="error" size="small" />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.contrastText">
                    ⚠️ Note: You must honor confirmed appointments even if you change your schedule.
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Schedule Update Modal */}
            <Dialog
              open={showScheduleModal}
              onClose={() => setShowScheduleModal(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Update Schedule
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {Object.entries(weeklySchedule).map(([day, schedule]) => (
                    <Grid item xs={12} key={day}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                              {day}
                            </Typography>
                            <Button
                              variant={schedule.available ? 'contained' : 'outlined'}
                              color={schedule.available ? 'success' : 'error'}
                              size="small"
                              onClick={() => updateSchedule(day, 'available', !schedule.available)}
                            >
                              {schedule.available ? 'Available' : 'Not Available'}
                            </Button>
                          </Box>
                          {schedule.available && (
                            <Box display="flex" gap={2}>
                              <TextField
                                label="Start Time"
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => updateSchedule(day, 'startTime', e.target.value)}
                                size="small"
                              />
                              <TextField
                                label="End Time"
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => updateSchedule(day, 'endTime', e.target.value)}
                                size="small"
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={saveSchedule}>
                  Save Schedule
                </Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default DoctorPortal;