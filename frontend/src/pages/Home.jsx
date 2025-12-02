import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Rating,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  LocationOn,
  AirportShuttle,
  CalendarToday,
  LocalHospital,
  Favorite,
  Psychology,
  Accessibility,
  ChildCare,
  Visibility,
  MedicalServices,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDoctors('?limit=3&featured=true');
      
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match DoctorCard format
        const transformedDoctors = data.map(doctor => ({
          id: doctor.id,
          name: doctor.user.name,
          specialty: doctor.speciality,
          experience: `${doctor.experience}+ years`,
          rating: 4.5,
          reviews: 0,
          fee: doctor.fees,
          hospital: doctor.hospital.name,
          image: "👨⚕️",
          available: true
        }));
        setFeaturedDoctors(transformedDoctors);
      } else {
        throw new Error('Failed to fetch doctors');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const mockFeaturedDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: 4.9,
      reviews: 127,
      fee: 800,
      hospital: "Apollo Hospital",
      image: "👩‍⚕️",
      available: true
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist", 
      experience: "12+ years",
      rating: 4.8,
      reviews: 98,
      fee: 1200,
      hospital: "Max Healthcare",
      image: "👨‍⚕️",
      available: true
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      experience: "10+ years", 
      rating: 4.9,
      reviews: 156,
      fee: 600,
      hospital: "Fortis Hospital",
      image: "👩‍⚕️",
      available: false
    }
  ];

  // Fallback to mock data if API fails
  const displayDoctors = featuredDoctors.length > 0 ? featuredDoctors : (error ? mockFeaturedDoctors : []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    navigate(`/doctors?${params.toString()}`);
  };

  const handleSpecialtyClick = (specialty) => {
    navigate(`/doctors?specialty=${specialty}`);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'emergency':
        navigate('/emergency');
        break;
      case 'appointment':
        navigate('/doctors');
        break;
      case 'hospitals':
        navigate('/hospitals');
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4DB6E2 0%, #3A9BC1 50%, #1A2A33 100%)',
          py: { xs: 8, md: 12 },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(246, 196, 83, 0.2) 0%, transparent 50%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #F6C453 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Your Health, Our Priority
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                }}
              >
                Connect with top doctors, book appointments instantly, and manage your health with BlueVitals - your trusted healthcare companion.
              </Typography>
              
              {/* Search Bar */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 6,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search doctors, specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                />
                <TextField
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: { sm: '200px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  sx={{
                    background: 'linear-gradient(135deg, #F6C453 0%, #FF914D 100%)',
                    color: '#1A2A33',
                    minWidth: { sm: '120px' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E5B03C 0%, #E67D36 100%)',
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
              
              {/* Stats */}
              <Grid container spacing={4} justifyContent="center">
                {[
                  { number: '10,000+', label: 'Verified Doctors' },
                  { number: '500+', label: 'Hospitals' },
                  { number: '1M+', label: 'Happy Patients' },
                ].map((stat, index) => (
                  <Grid item key={index}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #F6C453, #FF914D)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Quick Actions */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            mb: 6,
            background: 'linear-gradient(135deg, #1A2A33 0%, #4DB6E2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              icon: <AirportShuttle sx={{ fontSize: 48, color: '#FF914D' }} />,
              title: 'Emergency Care',
              description: 'Get immediate medical attention with our 24/7 emergency services',
              buttonText: 'Call Ambulance',
              color: '#FF914D',
              action: 'emergency'
            },
            {
              icon: <CalendarToday sx={{ fontSize: 48, color: '#4DB6E2' }} />,
              title: 'Book Appointment',
              description: 'Schedule consultations with top doctors at your preferred time',
              buttonText: 'Book Now',
              color: '#4DB6E2',
              action: 'appointment'
            },
            {
              icon: <LocalHospital sx={{ fontSize: 48, color: '#F6C453' }} />,
              title: 'Find Hospitals',
              description: 'Locate nearby hospitals with advanced medical facilities',
              buttonText: 'Find Hospitals',
              color: '#F6C453',
              action: 'hospitals'
            },
          ].map((action, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(77, 182, 226, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0px 12px 40px rgba(${action.color === '#FF914D' ? '255, 145, 77' : action.color === '#4DB6E2' ? '77, 182, 226' : '246, 196, 83'}, 0.2)`,
                    },
                  }}
                >
                  <CardContent>
                    <Box mb={2}>{action.icon}</Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {action.description}
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => handleQuickAction(action.action)}
                      sx={{
                        background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}CC 100%)`,
                        color: action.color === '#F6C453' ? '#1A2A33' : 'white',
                      }}
                    >
                      {action.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Doctors */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #1A2A33 0%, #4DB6E2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Top Rated Doctors
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Consult with our experienced healthcare professionals
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress size={40} sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ ml: 2 }}>Loading doctors...</Typography>
            </Box>
          ) : displayDoctors.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">No featured doctors available</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {displayDoctors.map((doctor) => (
                <Grid item xs={12} md={4} key={doctor.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(77, 182, 226, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0px 12px 40px rgba(77, 182, 226, 0.15)',
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
                            }}
                          >
                            <MedicalServices sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box>
                            <Chip
                              label={doctor.available ? 'Available' : 'Busy'}
                              size="small"
                              sx={{
                                backgroundColor: doctor.available ? '#10B981' : '#EF4444',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {doctor.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500, mb: 1 }}>
                          {doctor.specialty}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {doctor.experience}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {doctor.hospital}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box display="flex" alignItems="center">
                            <Rating value={doctor.rating} readOnly size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {doctor.rating} ({doctor.reviews} reviews)
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                          <Typography variant="body2" color="text.secondary">
                            Consultation Fee
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            ₹{doctor.fee}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" gap={1}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            fullWidth
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            endIcon={<ArrowForward />}
                            disabled={!doctor.available}
                            onClick={() => navigate('/doctors')}
                          >
                            Book Now
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box textAlign="center" mt={4}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/doctors')}
            >
              View All Doctors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Specialties */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            mb: 6,
            background: 'linear-gradient(135deg, #1A2A33 0%, #4DB6E2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Popular Specialties
        </Typography>
        <Grid container spacing={3}>
          {[
            { name: 'Cardiology', icon: <Favorite />, count: '150+ Doctors', color: '#FF914D' },
            { name: 'Neurology', icon: <Psychology />, count: '120+ Doctors', color: '#4DB6E2' },
            { name: 'Orthopedics', icon: <Accessibility />, count: '200+ Doctors', color: '#F6C453' },
            { name: 'Pediatrics', icon: <ChildCare />, count: '180+ Doctors', color: '#10B981' },
            { name: 'Dermatology', icon: <MedicalServices />, count: '90+ Doctors', color: '#8B5CF6' },
            { name: 'Gynecology', icon: <MedicalServices />, count: '110+ Doctors', color: '#EC4899' },
            { name: 'Dentistry', icon: <MedicalServices />, count: '160+ Doctors', color: '#06B6D4' },
            { name: 'Ophthalmology', icon: <Visibility />, count: '80+ Doctors', color: '#F59E0B' },
          ].map((specialty, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  onClick={() => handleSpecialtyClick(specialty.name)}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(77, 182, 226, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0px 8px 30px rgba(${specialty.color.replace('#', '')}, 0.2)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${specialty.color}20`,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(specialty.icon, {
                      sx: { fontSize: 30, color: specialty.color },
                    })}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {specialty.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {specialty.count}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A2A33 0%, #4DB6E2 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(246, 196, 83, 0.2) 0%, transparent 50%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Ready to Take Care of Your Health?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
              }}
            >
              Join millions who trust us for their healthcare needs
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/doctors')}
                sx={{
                  background: 'linear-gradient(135deg, #F6C453 0%, #FF914D 100%)',
                  color: '#1A2A33',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E5B03C 0%, #E67D36 100%)',
                  },
                }}
              >
                Find a Doctor
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/doctors')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Book Appointment
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;