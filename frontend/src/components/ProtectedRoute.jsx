import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles, redirectTo = '/login' }) => {
  // Check localStorage if user prop is not available
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  let currentUser = user;
  if (!currentUser && storedUser && storedUser !== 'undefined') {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }

  // If no user and no token, redirect to login
  if (!currentUser && !token) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles && allowedRoles.length > 0 && currentUser) {
    const userRole = currentUser.role?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;