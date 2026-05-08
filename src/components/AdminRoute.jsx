// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const AdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const hasChecked = useRef(false);
    
    useEffect(() => {
        // ✅ Sirf ek baar check karo
        if (hasChecked.current) return;
        hasChecked.current = true;
        
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // ✅ Check if user is super_admin OR admin
        const hasAdminAccess = user.role === 'super_admin' || user.role === 'admin';
        
        console.log("AdminRoute Check:", { 
            token: !!token, 
            hasAdminAccess: hasAdminAccess, 
            role: user.role 
        });
        
        if (token && hasAdminAccess) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);
    
    // Loading state
    if (isAdmin === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Verifying credentials...</p>
                </div>
            </div>
        );
    }
    
    // Not admin, redirect to login
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }
    
    // Admin access granted
    return children;
};

export default AdminRoute;