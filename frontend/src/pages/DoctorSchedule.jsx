import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Person,
  Edit
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../services/api';

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDay, setEditingDay] = useState('');
  const [daySchedule, setDaySchedule] = useState({ startTime: '09:00', endTime: '17:00', available: true });
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.getDoctorAppointments(user.id, today, token);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchedule = (day) => {
    setEditingDay(day);
    setOpenDialog(true);
  };

  const handleSaveSchedule = () => {
    setOpenDialog(false);
    toast.success('Schedule updated successfully!');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        My Schedule
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Today's Schedule
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {appointments.map(appointment => (
                  <Card key={appointment.id} variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Schedule sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="h6" color="primary">
                              {appointment.appointmentTime}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {appointment.patientName}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.location}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip 
                          label={appointment.status}
                          color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Weekly Overview
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {days.map(day => (
                  <Box key={day} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        9:00 AM - 5:00 PM
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditSchedule(day)}
                    >
                      Edit
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Schedule for {editingDay}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={daySchedule.available}
                onChange={(e) => setDaySchedule({...daySchedule, available: e.target.checked})}
              />
            }
            label="Available"
            sx={{ mb: 2 }}
          />
          {daySchedule.available && (
            <>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={daySchedule.startTime}
                onChange={(e) => setDaySchedule({...daySchedule, startTime: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={daySchedule.endTime}
                onChange={(e) => setDaySchedule({...daySchedule, endTime: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorSchedule;