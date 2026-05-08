// src/components/ConfirmModal.jsx
import React from 'react';
import { FaExclamationTriangle, FaTimes, FaTrash } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isLoading = false }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                <div className="bg-red-50 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500 text-xl" />
                        <h2 className="text-lg font-bold text-red-700">{title || "Confirm Delete"}</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-700">{message || "Are you sure you want to delete this item?"}</p>
                    <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                        <FaExclamationTriangle size={12} /> This action cannot be undone!
                    </p>
                </div>
                
                <div className="flex gap-3 p-4 bg-gray-50">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <FaTrash size={14} />
                        )}
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;