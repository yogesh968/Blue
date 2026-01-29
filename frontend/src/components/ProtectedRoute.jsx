import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles, redirectTo = '/login' }) => {
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
      return <Navigate to="/user-portal" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;