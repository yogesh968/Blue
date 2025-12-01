import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Dashboard,
  Hotel,
  LocalShipping,
  People,
  AttachMoney,
  Timeline,
  CheckCircle,
  Cancel,
  Search,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';

const HospitalPortal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [bedBookings, setBedBookings] = useState([]);
  const [ambulanceBookings, setAmbulanceBookings] = useState([]);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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

  const mockAvailableDoctors = [
    {
      id: 4,
      name: 'Dr. Sarah Johnson',
      specialization: 'Pediatrics',
      experience: '10 years',
      qualification: 'MBBS, MD Pediatrics',
      email: 'sarah.johnson@email.com',
      status: 'AVAILABLE'
    },
    {
      id: 5,
      name: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      experience: '7 years',
      qualification: 'MBBS, MD Dermatology',
      email: 'michael.chen@email.com',
      status: 'AVAILABLE'
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

  const mockHospitalDoctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Cardiology',
      designation: 'Senior Consultant',
      experience: '15 years',
      qualification: 'MBBS, MD Cardiology',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@hospital.com',
      status: 'ACTIVE',
      joinDate: '2018-03-15'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialization: 'Neurology',
      designation: 'Consultant',
      experience: '8 years',
      qualification: 'MBBS, DM Neurology',
      phone: '+91 98765 43211',
      email: 'priya.sharma@hospital.com',
      status: 'ACTIVE',
      joinDate: '2020-07-20'
    },
    {
      id: 3,
      name: 'Dr. Amit Patel',
      specialization: 'Orthopedics',
      designation: 'Associate Consultant',
      experience: '12 years',
      qualification: 'MBBS, MS Orthopedics',
      phone: '+91 98765 43212',
      email: 'amit.patel@hospital.com',
      status: 'ON_LEAVE',
      joinDate: '2019-01-10'
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchHospitalData(parsedUser.id);
    } else {
      // Fallback to mock data for testing
      setBedBookings(mockBedBookings);
      setAmbulanceBookings(mockAmbulanceBookings);
      setHospitalDoctors(mockHospitalDoctors);
      setAvailableDoctors(mockAvailableDoctors);
      setLoading(false);
    }
  }, []);

  const fetchHospitalData = async (hospitalId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // For now, use mock data but structure for API integration
      setBedBookings(mockBedBookings);
      setAmbulanceBookings(mockAmbulanceBookings);
      setHospitalDoctors(mockHospitalDoctors);
      setAvailableDoctors(mockAvailableDoctors);
      
    } catch (error) {
      toast.error('Failed to load hospital data');
    } finally {
      setLoading(false);
    }
  };

  const sendDoctorRequest = async (doctorId) => {
    try {
      const doctor = availableDoctors.find(d => d.id === doctorId);
      toast.success(`Request sent to ${doctor.name}!`);
      // TODO: Implement actual API call when backend is ready
    } catch (error) {
      toast.error('Failed to send doctor invitation');
    }
  };

  const filteredDoctors = availableDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['dashboard', 'doctors', 'beds', 'ambulances'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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
            Hospital Management Dashboard
          </Typography>
          

        </motion.div>

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  icon: <Hotel sx={{ fontSize: 40, color: 'primary.main' }} />,
                  title: 'Available Beds',
                  value: hospitalStats.availableBeds,
                  subtitle: `${hospitalStats.occupiedBeds}/${hospitalStats.totalBeds} occupied`,
                  color: 'primary.main',
                },
                {
                  icon: <LocalShipping sx={{ fontSize: 40, color: 'secondary.main' }} />,
                  title: 'Available Ambulances',
                  value: hospitalStats.availableAmbulances,
                  subtitle: `${hospitalStats.totalAmbulances} total`,
                  color: 'secondary.main',
                },
                {
                  icon: <People sx={{ fontSize: 40, color: 'success.main' }} />,
                  title: "Today's Admissions",
                  value: hospitalStats.todayAdmissions,
                  subtitle: `${hospitalStats.todayDischarges} discharges`,
                  color: 'success.main',
                },
                {
                  icon: <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />,
                  title: "Today's Revenue",
                  value: `₹${hospitalStats.revenue.toLocaleString()}`,
                  subtitle: '',
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
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          {stat.title}
                        </Typography>
                        {stat.subtitle && (
                          <Typography variant="body2" color="text.secondary">
                            {stat.subtitle}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Bed Occupancy
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(hospitalStats.occupiedBeds / hospitalStats.totalBeds) * 100}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            background: 'linear-gradient(135deg, #4DB6E2, #3A9BC1)',
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {Math.round((hospitalStats.occupiedBeds / hospitalStats.totalBeds) * 100)}% Occupied
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Activities
                    </Typography>
                    <List>
                      {[
                        { text: 'New patient admitted to ICU-101', time: '2 hours ago' },
                        { text: 'Ambulance AMB-002 dispatched', time: '3 hours ago' },
                        { text: 'Patient discharged from GEN-205', time: '4 hours ago' },
                      ].map((activity, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Timeline sx={{ color: 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.text}
                            secondary={activity.time}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 'doctors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Our Doctors
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <Chip
                  label={`Total: ${hospitalDoctors.length} Doctors`}
                  color="primary"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  startIcon={<People />}
                  onClick={() => setShowAddDoctorModal(true)}
                >
                  Add Doctor
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              {hospitalDoctors.map((doctor) => (
                <Grid item xs={12} md={6} lg={4} key={doctor.id}>
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
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            background: 'linear-gradient(135deg, #4DB6E2, #3A9BC1)',
                            mr: 2,
                            fontSize: '1.5rem',
                            fontWeight: 600,
                          }}
                        >
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doctor.name}
                          </Typography>
                          <Chip
                            label={doctor.status}
                            color={doctor.status === 'ACTIVE' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
                        {doctor.specialization}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {doctor.designation} • {doctor.experience}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {doctor.qualification}
                      </Typography>
                      
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          📞 {doctor.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          ✉️ {doctor.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📅 Joined: {new Date(doctor.joinDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Add Doctor Modal */}
            <Dialog
              open={showAddDoctorModal}
              onClose={() => setShowAddDoctorModal(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Add Doctor to Hospital
                </Typography>
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 3, mt: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Grid container spacing={2}>
                  {filteredDoctors.map((doctor) => (
                    <Grid item xs={12} key={doctor.id}>
                      <Card sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                background: 'linear-gradient(135deg, #4DB6E2, #3A9BC1)',
                                mr: 2,
                              }}
                            >
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {doctor.name}
                              </Typography>
                              <Typography variant="body2" color="primary.main">
                                {doctor.specialization} • {doctor.experience}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {doctor.qualification}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={() => sendDoctorRequest(doctor.id)}
                          >
                            Send Request
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {filteredDoctors.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No doctors found matching your search.
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowAddDoctorModal(false)}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}

        {activeTab === 'beds' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Bed Management
              </Typography>
              <Box display="flex" gap={2}>
                <Chip
                  label={`Available: ${hospitalStats.availableBeds}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`Occupied: ${hospitalStats.occupiedBeds}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`Total: ${hospitalStats.totalBeds}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Card>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Patient Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Bed Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Check-in</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Amount/Day</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.patientName}</TableCell>
                          <TableCell>{booking.room}</TableCell>
                          <TableCell>{booking.bedType}</TableCell>
                          <TableCell>{booking.checkIn}</TableCell>
                          <TableCell>₹{booking.amount}</TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              color={booking.status === 'ACTIVE' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {booking.status === 'ACTIVE' && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => updateBedBookingStatus(booking.id, 'DISCHARGED')}
                              >
                                Discharge
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'ambulances' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Ambulance Services
              </Typography>
              <Box display="flex" gap={2}>
                <Chip
                  label={`Available: ${hospitalStats.availableAmbulances}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`In Service: ${hospitalStats.totalAmbulances - hospitalStats.availableAmbulances}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`Total: ${hospitalStats.totalAmbulances}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Card>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Patient Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Pickup Location</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Destination</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ambulance</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Driver</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ambulanceBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.patientName}</TableCell>
                          <TableCell>{booking.pickupLocation}</TableCell>
                          <TableCell>{booking.destination}</TableCell>
                          <TableCell>{booking.ambulanceNo}</TableCell>
                          <TableCell>{booking.driverName}</TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status.replace('_', ' ')}
                              color={
                                booking.status === 'IN_TRANSIT'
                                  ? 'warning'
                                  : booking.status === 'COMPLETED'
                                  ? 'success'
                                  : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {booking.status === 'IN_TRANSIT' && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<CheckCircle />}
                                onClick={() => updateAmbulanceStatus(booking.id, 'COMPLETED')}
                              >
                                Complete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default HospitalPortal;