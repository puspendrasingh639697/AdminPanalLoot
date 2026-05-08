// src/components/ResponsiveTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ResponsiveTable = ({ 
    headers, 
    data, 
    renderRow, 
    onView, 
    onEdit, 
    onDelete,
    emptyMessage = "No data found",
    actions = true 
}) => {
    
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        {/* Table Header */}
                        <thead className="bg-[#8B1E2D]">
                            <tr>
                                {headers.map((header, idx) => (
                                    <th 
                                        key={idx} 
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-white whitespace-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-white whitespace-nowrap">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    {renderRow(item, idx)}
                                    {actions && (
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {onView && (
                                                    <button 
                                                        onClick={() => onView(item)}
                                                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                                        title="View"
                                                    >
                                                        <FaEye size={14} />
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button 
                                                        onClick={() => onEdit(item)}
                                                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button 
                                                        onClick={() => onDelete(item)}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTable;