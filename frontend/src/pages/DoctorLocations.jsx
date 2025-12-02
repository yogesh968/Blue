import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Add,
  LocationOn,
  Schedule,
  Phone,
  AttachMoney,
  Edit,
  Delete
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../services/api';

const DoctorLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    fees: '',
    timings: ''
  });
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.getDoctorLocations(user.id, token);
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    try {
      const response = await api.addDoctorLocation(user.id, newLocation, token);
      if (response.ok) {
        const data = await response.json();
        setLocations(prev => [...prev, data]);
        setNewLocation({ name: '', address: '', city: '', phone: '', fees: '', timings: '' });
        setOpenDialog(false);
        toast.success('Location added successfully!');
      } else {
        toast.error('Failed to add location');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  };

  const deleteLocation = async (id) => {
    try {
      const response = await api.deleteDoctorLocation(id, token);
      if (response.ok) {
        setLocations(locations.filter(loc => loc.id !== id));
        toast.success('Location removed successfully!');
      } else {
        toast.error('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Consultation Locations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Add Location
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {locations.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No locations added yet. Click "Add Location" to get started.
              </Typography>
            </Card>
          </Grid>
        ) : (
          locations.map(location => (
          <Grid item xs={12} md={6} lg={4} key={location.id}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {location.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => deleteLocation(location.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    {location.address}, {location.city}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">{location.timings}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">{location.phone}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{location.fees} per consultation
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {location.patientsToday || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Today
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {location.totalPatients || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))
        )}
      </Grid>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Location Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={newLocation.address}
            onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            value={newLocation.city}
            onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            value={newLocation.phone}
            onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Consultation Fees"
            type="number"
            value={newLocation.fees}
            onChange={(e) => setNewLocation({...newLocation, fees: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Timings"
            value={newLocation.timings}
            onChange={(e) => setNewLocation({...newLocation, timings: e.target.value})}
            margin="normal"
            placeholder="e.g., Mon-Fri: 9AM-5PM"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLocation} variant="contained">Add Location</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorLocations;