// // import React, { useState, useEffect } from 'react';
// // import { FaUsers, FaUserCircle, FaCalendarAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
// // import { toast } from 'react-toastify';
// // import API from '../utils/api';

// // const Users = () => {
// //     const [users, setUsers] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => { fetchUsers(); }, []);

// //     const fetchUsers = async () => {
// //         setLoading(true);
// //         try {
// //             const res = await API.get('/admin/users');
// //             setUsers(res.data.users || res.data || []);
// //         } catch (err) { toast.error('Failed to fetch users'); }
// //         finally { setLoading(false); }
// //     };

// //     if (loading) {
// //         return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div><p className="text-gray-500">Loading users...</p></div>;
// //     }

// //     return (
// //         <div>
// //             <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Users</h1><p className="text-gray-500 text-sm mt-1">Manage your registered customers</p></div>

// //             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //                 <div className="overflow-x-auto">
// //                     <table className="w-full">
// //                         <thead className="bg-gray-50 border-b">
// //                             <tr><th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th><th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th><th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th><th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Joined</th></tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-gray-200">
// //                             {users.map((user) => (
// //                                 <tr key={user._id} className="hover:bg-gray-50 transition">
// //                                     <td className="px-6 py-4"><div className="flex items-center gap-3"><FaUserCircle className="text-3xl text-gray-400" /><div><p className="font-medium text-gray-800">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div></div></td>
// //                                     <td className="px-6 py-4"><div className="flex flex-col gap-1"><span className="flex items-center gap-1 text-sm text-gray-600"><FaEnvelope size={12} /> {user.email}</span><span className="flex items-center gap-1 text-sm text-gray-600"><FaPhone size={12} /> {user.phone || 'N/A'}</span></div></td>
// //                                     <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{user.role || 'user'}</span></td>
// //                                     <td className="px-6 py-4"><span className="flex items-center gap-1 text-sm text-gray-500"><FaCalendarAlt size={12} /> {new Date(user.createdAt).toLocaleDateString()}</span></td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //                 {users.length === 0 && <div className="text-center py-12 text-gray-500">No users found</div>}
// //             </div>
// //         </div>
// //     );
// // };

// // export default Users;

// import React, { useState, useEffect } from 'react';
// import { 
//     FaUsers, FaUserCircle, FaCalendarAlt, FaEnvelope, FaPhone, 
//     FaUserTag, FaUserCheck, FaUserPlus, FaSearch, FaSpinner, 
//     FaMapMarkerAlt, FaShoppingBag, FaTimesCircle, FaEye, FaSyncAlt
// } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import API from '../utils/api';

// const Users = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     useEffect(() => { fetchUsers(); }, []);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const res = await API.get('/admin/users');
//             const usersData = res.data.users || res.data || [];
//             // Sort by latest first
//             usersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setUsers(usersData);
//         } catch (err) { 
//             toast.error('Failed to fetch users');
//             setUsers([]);
//         } finally { 
//             setLoading(false); 
//         }
//     };

//     const viewUserDetails = (user) => {
//         setSelectedUser(user);
//         setModalOpen(true);
//     };

//     // Local search filter
//     const filteredUsers = users.filter(user => {
//         const search = searchTerm.toLowerCase();
//         return (user.name?.toLowerCase().includes(search) ||
//                 user.email?.toLowerCase().includes(search) ||
//                 user.phone?.toLowerCase().includes(search));
//     });

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading users...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Users</h1>
//                     <p className="text-gray-500 text-sm mt-1">Manage your registered customers</p>
//                 </div>
//                 <button 
//                     onClick={fetchUsers} 
//                     className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md"
//                 >
//                     <FaSyncAlt size={16} /> Refresh
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//                 <div className="relative">
//                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search users by name, email or phone..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
//                     />
//                 </div>
//             </div>

//             {/* Users Grid - Card View for Mobile */}
//             <div className="block md:hidden space-y-4">
//                 {filteredUsers.map((user) => (
//                     <div 
//                         key={user._id} 
//                         className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
//                         onClick={() => viewUserDetails(user)}
//                     >
//                         <div className="flex items-center gap-3 mb-3">
//                             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-lg font-bold">
//                                 {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
//                             </div>
//                             <div className="flex-1">
//                                 <p className="font-bold text-gray-800">{user.name || 'N/A'}</p>
//                                 <p className="text-xs text-gray-500">{user.email}</p>
//                             </div>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
//                                 {user.role || 'user'}
//                             </span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <FaEnvelope size={12} />
//                                 <span className="truncate">{user.email}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <FaPhone size={12} />
//                                 <span>{user.phone || 'N/A'}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <FaCalendarAlt size={12} />
//                                 <span>{new Date(user.createdAt).toLocaleDateString()}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-gray-600">
//                                 <FaShoppingBag size={12} />
//                                 <span>{user.ordersCount || 0} orders</span>
//                             </div>
//                         </div>
//                         <div className="mt-3 pt-3 border-t border-gray-100">
//                             <button 
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     viewUserDetails(user);
//                                 }}
//                                 className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition text-sm"
//                             >
//                                 <FaEye size={12} /> View Details
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Desktop Table View - Dark Red Headers */}
//             <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-[#8B1E2D]">
//                             <tr>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">User</th>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">Contact</th>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">Role</th>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">Orders</th>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">Joined</th>
//                                 <th className="px-6 py-4 text-left text-sm font-medium text-white">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {filteredUsers.map((user) => (
//                                 <tr key={user._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => viewUserDetails(user)}>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-sm font-bold">
//                                                 {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
//                                             </div>
//                                             <div>
//                                                 <p className="font-semibold text-gray-800">{user.name || 'N/A'}</p>
//                                                 <p className="text-xs text-gray-500">{user.email}</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex flex-col gap-1">
//                                             <span className="flex items-center gap-1 text-sm text-gray-600">
//                                                 <FaEnvelope size={12} className="text-gray-400" /> {user.email}
//                                             </span>
//                                             <span className="flex items-center gap-1 text-sm text-gray-600">
//                                                 <FaPhone size={12} className="text-gray-400" /> {user.phone || 'N/A'}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
//                                             <FaUserTag size={10} /> {user.role || 'user'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
//                                             <FaShoppingBag size={10} /> {user.ordersCount || 0}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="flex items-center gap-1 text-sm text-gray-500">
//                                             <FaCalendarAlt size={12} /> {new Date(user.createdAt).toLocaleDateString()}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <button 
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 viewUserDetails(user);
//                                             }}
//                                             className="px-3 py-1.5 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition text-sm flex items-center gap-1"
//                                         >
//                                             <FaEye size={12} /> View
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 {filteredUsers.length === 0 && (
//                     <div className="text-center py-12 text-gray-500">
//                         <div className="text-6xl mb-4">👤</div>
//                         <p className="text-lg">No users found</p>
//                         {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
//                     </div>
//                 )}
//             </div>

//             {/* Mobile Empty State */}
//             {filteredUsers.length === 0 && (
//                 <div className="block md:hidden text-center py-12 text-gray-500 bg-white rounded-xl">
//                     <div className="text-6xl mb-4">👤</div>
//                     <p className="text-lg">No users found</p>
//                     {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
//                 </div>
//             )}

//             {/* User Count Footer */}
//             {filteredUsers.length > 0 && (
//                 <div className="mt-6 text-center text-sm text-gray-500">
//                     Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
//                     {searchTerm && ` matching "${searchTerm}"`}
//                 </div>
//             )}

//             {/* User Details Modal */}
//             {modalOpen && selectedUser && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
//                     <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//                             <h2 className="text-xl font-bold text-gray-800">User Details</h2>
//                             <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                                 <FaTimesCircle size={20} className="text-gray-600" />
//                             </button>
//                         </div>
//                         <div className="p-6 text-center">
//                             {/* User Avatar */}
//                             <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
//                                 {(selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || 'U').toUpperCase()}
//                             </div>
                            
//                             {/* User Name */}
//                             <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedUser.name || 'N/A'}</h3>
//                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-4 ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
//                                 <FaUserTag size={10} /> {selectedUser.role || 'user'}
//                             </span>
                            
//                             {/* User Info */}
//                             <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4">
//                                 <div className="flex items-center gap-3">
//                                     <FaEnvelope className="text-[#8B1E2D] w-5" />
//                                     <div>
//                                         <p className="text-xs text-gray-500">Email</p>
//                                         <p className="text-sm font-medium text-gray-800">{selectedUser.email}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <FaPhone className="text-[#8B1E2D] w-5" />
//                                     <div>
//                                         <p className="text-xs text-gray-500">Phone</p>
//                                         <p className="text-sm font-medium text-gray-800">{selectedUser.phone || 'Not provided'}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <FaCalendarAlt className="text-[#8B1E2D] w-5" />
//                                     <div>
//                                         <p className="text-xs text-gray-500">Joined Date</p>
//                                         <p className="text-sm font-medium text-gray-800">{new Date(selectedUser.createdAt).toLocaleString()}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <FaShoppingBag className="text-[#8B1E2D] w-5" />
//                                     <div>
//                                         <p className="text-xs text-gray-500">Total Orders</p>
//                                         <p className="text-sm font-medium text-gray-800">{selectedUser.ordersCount || 0}</p>
//                                     </div>
//                                 </div>
//                                 {selectedUser.lastLogin && (
//                                     <div className="flex items-center gap-3">
//                                         <FaUserCheck className="text-[#8B1E2D] w-5" />
//                                         <div>
//                                             <p className="text-xs text-gray-500">Last Login</p>
//                                             <p className="text-sm font-medium text-gray-800">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {selectedUser.address && (
//                                     <div className="flex items-center gap-3">
//                                         <FaMapMarkerAlt className="text-[#8B1E2D] w-5" />
//                                         <div>
//                                             <p className="text-xs text-gray-500">Address</p>
//                                             <p className="text-sm font-medium text-gray-800">{selectedUser.address}</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Users;

// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaUsers, FaCalendarAlt, FaEnvelope, FaPhone, FaUserTag, 
    FaUserCheck, FaSearch, FaSpinner, FaShoppingBag, 
    FaTimesCircle, FaEye, FaSyncAlt, FaUserCog, FaTrash
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/Api';
import { usePermission } from '../hooks/usePermission';
import { ROLES } from '../constants/roles';
import ConfirmModal from '../components/ConfirmModal';

const Users = () => {
    const { hasPermission, isAtLeast, getUserRole, isRole } = usePermission();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [updatingRole, setUpdatingRole] = useState(false);
    
    // ✅ Delete Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const canEditUser = hasPermission('edit_user');
    const canDeleteUser = hasPermission('delete_user');
    const canManageAdmins = isAtLeast(ROLES.ADMIN);
    const isSuperAdmin = isRole(ROLES.SUPER_ADMIN);
    const currentUserRole = getUserRole();

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/admin/users');
            const usersData = res.data.users || res.data || [];
            usersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUsers(usersData);
        } catch (err) { 
            toast.error('Failed to fetch users');
            setUsers([]);
        } finally { 
            setLoading(false); 
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    // ✅ Handle delete user
    const handleDeleteClick = (user) => {
        if (!canDeleteUser && !isSuperAdmin) {
            toast.error('Only Super Admin can delete users');
            return;
        }
        if (user.role === 'super_admin' && !isSuperAdmin) {
            toast.error('Cannot delete Super Admin user');
            return;
        }
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        
        setDeleteLoading(true);
        setShowDeleteModal(false);
        
        try {
            await API.delete(`/admin/users/${userToDelete._id}`);
            toast.success(`User ${userToDelete.name} deleted successfully!`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteLoading(false);
            setUserToDelete(null);
        }
    };

    const openRoleModal = (user) => {
        if (!canEditUser) {
            toast.error('You don\'t have permission to change user roles');
            return;
        }
        setSelectedUserForRole(user);
        setNewRole(user.role || 'user');
        setRoleModalOpen(true);
    };

    const updateUserRole = async () => {
        if (!canEditUser) {
            toast.error('You don\'t have permission to change user roles');
            return;
        }
        
        if ((newRole === 'admin' || newRole === 'super_admin') && !isSuperAdmin) {
            toast.error('Only Super Admin can assign admin or super admin roles');
            return;
        }
        
        if (selectedUserForRole?.role === 'super_admin' && !isSuperAdmin) {
            toast.error('You cannot modify Super Admin user');
            return;
        }
        
        setUpdatingRole(true);
        try {
            await API.put(`/admin/users/${selectedUserForRole._id}/role`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
            setRoleModalOpen(false);
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error('You don\'t have permission to change user roles');
            } else {
                toast.error(err.response?.data?.message || 'Failed to update role');
            }
        } finally {
            setUpdatingRole(false);
        }
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'super_admin': return '👑';
            case 'admin': return '🔧';
            case 'manager': return '📦';
            case 'editor': return '✏️';
            default: return '👤';
        }
    };

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'super_admin': return 'bg-yellow-100 text-yellow-800';
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'manager': return 'bg-blue-100 text-blue-800';
            case 'editor': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (user.name?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.phone?.toLowerCase().includes(search));
    });

    const getAvailableRoles = () => {
        if (isSuperAdmin) {
            return [
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'super_admin', label: 'Super Admin' }
            ];
        }
        if (canManageAdmins) {
            return [
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' }
            ];
        }
        return [{ value: 'user', label: 'User' }];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        Users
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${currentUserRole === 'super_admin' ? 'bg-yellow-600' : 'bg-[#8B1E2D]'}`}>
                            {currentUserRole?.replace('_', ' ').toUpperCase()}
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your registered customers</p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1E2D] text-white rounded-xl hover:bg-[#6B1622] transition-all shadow-md">
                    <FaSyncAlt size={16} /> Refresh
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#8B1E2D]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">Contact</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">Orders</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">Joined</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => viewUserDetails(user)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-sm font-bold">
                                                {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1 text-sm text-gray-600"><FaEnvelope size={12} /> {user.email}</span>
                                            <span className="flex items-center gap-1 text-sm text-gray-600"><FaPhone size={12} /> {user.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                            {getRoleIcon(user.role)} {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                            <FaShoppingBag size={10} /> {user.ordersCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1 text-sm text-gray-500"><FaCalendarAlt size={12} /> {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => viewUserDetails(user)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="View Details">
                                                <FaEye size={14} />
                                            </button>
                                            {(canEditUser || isSuperAdmin) && user.role !== 'super_admin' && (
                                                <button onClick={() => openRoleModal(user)} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200" title="Change Role">
                                                    <FaUserCog size={14} />
                                                </button>
                                            )}
                                            {(canDeleteUser || isSuperAdmin) && user.role !== 'super_admin' && (
                                                <button onClick={() => handleDeleteClick(user)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete User">
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-lg">No users found</p>
                    {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
                </div>
            )}

            {/* User Count Footer */}
            {filteredUsers.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500">
                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                </div>
            )}

            {/* User Details Modal */}
            {modalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FaTimesCircle size={20} className="text-gray-600" /></button>
                        </div>
                        <div className="p-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                {(selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedUser.name || 'N/A'}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-4 ${getRoleBadgeClass(selectedUser.role)}`}>
                                {getRoleIcon(selectedUser.role)} {selectedUser.role || 'user'}
                            </span>
                            <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3"><FaEnvelope className="text-[#8B1E2D] w-5" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-800">{selectedUser.email}</p></div></div>
                                <div className="flex items-center gap-3"><FaPhone className="text-[#8B1E2D] w-5" /><div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-800">{selectedUser.phone || 'Not provided'}</p></div></div>
                                <div className="flex items-center gap-3"><FaCalendarAlt className="text-[#8B1E2D] w-5" /><div><p className="text-xs text-gray-500">Joined Date</p><p className="text-sm font-medium text-gray-800">{new Date(selectedUser.createdAt).toLocaleString()}</p></div></div>
                                <div className="flex items-center gap-3"><FaShoppingBag className="text-[#8B1E2D] w-5" /><div><p className="text-xs text-gray-500">Total Orders</p><p className="text-sm font-medium text-gray-800">{selectedUser.ordersCount || 0}</p></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Role Modal */}
            {roleModalOpen && selectedUserForRole && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRoleModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Change User Role</h2>
                            <button onClick={() => setRoleModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FaTimesCircle size={20} className="text-gray-600" /></button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-lg font-bold">
                                    {(selectedUserForRole.name?.charAt(0) || selectedUserForRole.email?.charAt(0) || 'U').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{selectedUserForRole.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">{selectedUserForRole.email}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select New Role</label>
                                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]">
                                    {getAvailableRoles().map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={updateUserRole} disabled={updatingRole} className="flex-1 py-3 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {updatingRole ? <FaSpinner className="animate-spin" /> : <FaUserCheck size={18} />} Update Role
                                </button>
                                <button onClick={() => setRoleModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete user "${userToDelete?.name}"?`}
                confirmText="Yes, Delete User"
                cancelText="Cancel"
                isLoading={deleteLoading}
            />
        </div>
    );
};

export default Users;