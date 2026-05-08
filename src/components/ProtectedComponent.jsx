// src/components/ProtectedComponent.jsx
import React from 'react';
import { usePermission } from '../hooks/usePermission';

const ProtectedComponent = ({ children, permissions, fallback = null }) => {
    const { hasPermission, isAtLeast } = usePermission();
    
    let hasAccess = false;
    
    if (permissions) {
        if (Array.isArray(permissions)) {
            hasAccess = permissions.some(p => hasPermission(p));
        } else {
            hasAccess = hasPermission(permissions);
        }
    } else {
        hasAccess = true;
    }
    
    if (!hasAccess) {
        return fallback || (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-800">Access Denied</h3>
                <p className="text-gray-500 mt-2">You don't have permission to view this content.</p>
                <p className="text-sm text-gray-400 mt-1">Required permissions: {permissions?.join(', ')}</p>
            </div>
        );
    }
    
    return children;
};

export default ProtectedComponent;