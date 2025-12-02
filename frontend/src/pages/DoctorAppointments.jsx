import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Grid,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Person,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../services/api';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.getDoctorAppointments(user.id, today, token);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const response = await api.updateAppointmentStatus(id, status, token);
      
      if (response.ok) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? { ...apt, status } : apt)
        );
        toast.success(`Appointment ${status}!`);
      } else {
        toast.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Today's Appointments
      </Typography>
      
      <Grid container spacing={3}>
        {appointments.map(appointment => (
          <Grid item xs={12} md={6} key={appointment.id}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {appointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {appointment.patientAge}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip 
                      label={appointment.status}
                      color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{appointment.appointmentTime}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{appointment.location}</Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Symptoms:</strong> {appointment.symptoms}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  Fees: ₹{appointment.fees}
                </Typography>
                
                {appointment.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      size="small"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DoctorAppointments;