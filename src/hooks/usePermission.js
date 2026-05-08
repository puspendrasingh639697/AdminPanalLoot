// src/hooks/usePermission.js
import { useSelector } from 'react-redux';
import { ROLE_PERMISSIONS, ROLE_LEVELS } from '../constants/roles';

export const usePermission = () => {
    // ✅ Get user from localStorage directly instead of Redux to avoid re-renders
    const getUserFromStorage = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    };
    
    const user = getUserFromStorage();
    const userRole = user?.role || 'user';
    
    const hasPermission = (permission) => {
        const permissions = ROLE_PERMISSIONS[userRole] || [];
        return permissions.includes(permission);
    };
    
    const isAtLeast = (minRole) => {
        const userLevel = ROLE_LEVELS[userRole] || 0;
        const requiredLevel = ROLE_LEVELS[minRole] || 0;
        return userLevel >= requiredLevel;
    };
    
    const isRole = (role) => userRole === role;
    const getUserRole = () => userRole;
    
    return { hasPermission, isAtLeast, isRole, getUserRole };
};