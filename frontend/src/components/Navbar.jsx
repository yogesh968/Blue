import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  LocalHospital,
  Logout,
  Dashboard,
} from '@mui/icons-material';

const Navbar = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    handleProfileMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItems = () => {
    if (user && (user.role === 'doctor' || user.role === 'DOCTOR')) {
      return [
        { text: 'Dashboard', path: '/doctor-portal' },
        { text: 'Appointments', path: '/doctor-portal#appointments' },
        { text: 'My Locations', path: '/doctor-portal#locations' },
        { text: 'Schedule', path: '/doctor-portal#schedule' },
      ];
    } else if (user && (user.role === 'hospital' || user.role === 'HOSPITAL')) {
      return [
        { text: 'Dashboard', path: '/hospital-portal' },
        { text: 'Doctors', path: '/hospital-portal#doctors' },
        { text: 'Beds', path: '/hospital-portal#beds' },
        { text: 'Ambulances', path: '/hospital-portal#ambulances' },
      ];
    } else {
      return [
        { text: 'Home', path: '/' },
        { text: 'Doctors', path: '/doctors' },
        { text: 'Hospitals', path: '/hospitals' },
        { text: 'Services', path: '/services' },
        { text: 'Emergency', path: '/emergency' },
      ];
    }
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: item.text === 'Emergency' ? 'error.main' : 'text.primary',
              fontWeight: item.text === 'Emergency' ? 600 : 400,
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!user && (
          <>
            <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(77, 182, 226, 0.1)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            <LocalHospital
              sx={{
                fontSize: 32,
                color: 'primary.main',
                mr: 1,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4DB6E2 0%, #1A2A33 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HealthCare+
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: item.text === 'Emergency' ? 'error.main' : 'text.primary',
                    fontWeight: item.text === 'Emergency' ? 600 : 500,
                    '&:hover': {
                      backgroundColor: item.text === 'Emergency' ? 'error.light' : 'primary.light',
                      color: item.text === 'Emergency' ? 'white' : 'primary.contrastText',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button
                  onClick={handleProfileMenuOpen}
                  startIcon={
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #4DB6E2, #3A9BC1)',
                      }}
                    >
                      <AccountCircle />
                    </Avatar>
                  }
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Hi, {user.role === 'DOCTOR' || user.role === 'doctor' ? 'Dr. ' : ''}{user.name} ({user.role})
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to={
                      user.role === 'DOCTOR' || user.role === 'doctor'
                        ? '/doctor-portal'
                        : user.role === 'HOSPITAL' || user.role === 'hospital'
                        ? '/hospital-portal'
                        : '/user-portal'
                    }
                    onClick={handleProfileMenuClose}
                  >
                    <Dashboard sx={{ mr: 1 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component={Link} to="/login" variant="outlined">
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained">
                    Sign Up
                  </Button>
                </Box>
              )
            )}

            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;