// src/components/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLE_LEVELS } from '../constants/roles';

const RoleBasedRoute = ({ children, allowedRoles, allowedMinRole, fallback = null }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth || {});
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const currentUser = user || storedUser;
    const userRole = currentUser?.role || 'user';
    
    // Not logged in
    if (!token && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Check minimum role requirement
    if (allowedMinRole) {
        const userLevel = ROLE_LEVELS[userRole] || 0;
        const requiredLevel = ROLE_LEVELS[allowedMinRole] || 0;
        
        if (userLevel < requiredLevel) {
            return fallback || <Navigate to="/unauthorized" replace />;
        }
    }
    
    // Check specific roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return fallback || <Navigate to="/unauthorized" replace />;
    }
    
    return children;
};

export default RoleBasedRoute;