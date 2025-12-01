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
  Logout,
  Dashboard,
} from '@mui/icons-material';
import Logo from './Logo';

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
    if (user && user.role?.toLowerCase() === 'doctor') {
      return [
        { text: 'Dashboard', path: '/doctor-portal' },
        { text: 'Appointments', path: '/doctor-portal', hash: 'appointments' },
        { text: 'My Locations', path: '/doctor-portal', hash: 'locations' },
        { text: 'Schedule', path: '/doctor-portal', hash: 'schedule' },
      ];
    } else if (user && user.role?.toLowerCase() === 'hospital') {
      return [
        { text: 'Emergency', path: '/emergency' },
      ];
    } else if (user && (user.role?.toLowerCase() === 'user' || user.role?.toLowerCase() === 'patient')) {
      return [
        { text: 'My Appointments', path: '/user-portal', hash: 'appointments' },
        { text: 'My Bills', path: '/user-portal', hash: 'bills' },
        { text: 'Medical Records', path: '/user-portal', hash: 'records' },
        { text: 'Emergency', path: '/emergency' },
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
            to={item.tab ? `${item.path}?tab=${item.tab}` : item.hash ? `${item.path}#${item.hash}` : item.path}
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
            to={
              user
                ? user.role === 'DOCTOR' || user.role === 'doctor'
                  ? '/doctor-portal'
                  : user.role === 'HOSPITAL' || user.role === 'hospital'
                  ? '/hospital-portal'
                  : '/user-portal'
                : '/'
            }
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            <Logo width={168} height={56} />
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.tab ? `${item.path}?tab=${item.tab}` : item.hash ? `${item.path}#${item.hash}` : item.path}
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