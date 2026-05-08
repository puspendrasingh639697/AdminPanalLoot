


// import React, { useState, useEffect } from 'react';
// import { 
//     FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSyncAlt, 
//     FaEye, FaFilter, FaUser, FaCalendar, FaRupeeSign, 
//     FaShoppingBag, FaSpinner, FaClock, FaDownload, 
//     FaPrint, FaFilter as FaFilterIcon, FaSortAmountDown,
//     FaSortAmountUp, FaSearch, FaChevronLeft, FaChevronRight
// } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import API from '../utils/api';

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState('all');
//     const [updatingId, setUpdatingId] = useState(null);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortOrder, setSortOrder] = useState('desc'); // desc = latest first, asc = oldest first
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [timeFilter, setTimeFilter] = useState('all'); // today, week, month, all

//     useEffect(() => { 
//         fetchOrders(); 
//     }, []);

//     const fetchOrders = async () => {
//         setLoading(true);
//         try {
//             const res = await API.get('/orders/admin/all');
//             const ordersData = res.data.orders || res.data || [];
//             setOrders(ordersData);
//         } catch (err) { 
//             toast.error('Failed to fetch orders');
//             setOrders([]);
//         } finally { 
//             setLoading(false); 
//         }
//     };

//     const updateStatus = async (orderId, currentStatus) => {
//         const statusMap = { 'Processing': 'Shipped', 'Shipped': 'Delivered' };
//         const newStatus = statusMap[currentStatus];
//         if (!newStatus) return;
//         if (!window.confirm(`Update order status from ${currentStatus} to ${newStatus}?`)) return;
        
//         setUpdatingId(orderId);
//         try {
//             await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
//             toast.success(`Order status updated to ${newStatus}`);
//             fetchOrders();
//         } catch (err) { 
//             toast.error('Failed to update status');
//         } finally { 
//             setUpdatingId(null);
//         }
//     };

//     const getStatusIcon = (status, isCancelled) => {
//         if (isCancelled) return <FaTimesCircle className="text-red-600" />;
//         switch(status) {
//             case 'Delivered': return <FaCheckCircle className="text-green-600" />;
//             case 'Shipped': return <FaTruck className="text-blue-600" />;
//             case 'Processing': return <FaSpinner className="text-yellow-600 animate-spin" />;
//             default: return <FaBox className="text-gray-600" />;
//         }
//     };

//     const getStatusColor = (status, isCancelled) => {
//         if (isCancelled) return 'bg-red-100 text-red-700';
//         switch(status) {
//             case 'Delivered': return 'bg-green-100 text-green-700';
//             case 'Shipped': return 'bg-blue-100 text-blue-700';
//             case 'Processing': return 'bg-yellow-100 text-yellow-700';
//             default: return 'bg-gray-100 text-gray-700';
//         }
//     };

//     const getStatusText = (status, isCancelled) => {
//         if (isCancelled) return 'Cancelled';
//         return status;
//     };

//     // Time filter function
//     const getTimeFilteredOrders = (ordersList) => {
//         const now = new Date();
//         const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         const weekAgo = new Date(now.setDate(now.getDate() - 7));
//         const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        
//         switch(timeFilter) {
//             case 'today':
//                 return ordersList.filter(o => new Date(o.createdAt) >= today);
//             case 'week':
//                 return ordersList.filter(o => new Date(o.createdAt) >= weekAgo);
//             case 'month':
//                 return ordersList.filter(o => new Date(o.createdAt) >= monthAgo);
//             default:
//                 return ordersList;
//         }
//     };

//     // Apply all filters
//     const getFilteredOrders = () => {
//         let filtered = [...orders];
        
//         // Status filter
//         filtered = filtered.filter(order => {
//             if (filter === 'all') return true;
//             if (filter === 'pending') return order.status === 'Processing' && !order.isCancelled;
//             if (filter === 'shipped') return order.status === 'Shipped' && !order.isCancelled;
//             if (filter === 'delivered') return order.status === 'Delivered' && !order.isCancelled;
//             if (filter === 'cancelled') return order.isCancelled === true;
//             return true;
//         });
        
//         // Time filter
//         filtered = getTimeFilteredOrders(filtered);
        
//         // Search filter
//         if (searchTerm) {
//             filtered = filtered.filter(order => 
//                 order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
        
//         // Sort by date
//         filtered.sort((a, b) => {
//             if (sortOrder === 'desc') {
//                 return new Date(b.createdAt) - new Date(a.createdAt);
//             } else {
//                 return new Date(a.createdAt) - new Date(b.createdAt);
//             }
//         });
        
//         return filtered;
//     };

//     const getFilterCount = (filterType) => {
//         if (filterType === 'all') return orders.length;
//         if (filterType === 'pending') return orders.filter(o => o.status === 'Processing' && !o.isCancelled).length;
//         if (filterType === 'shipped') return orders.filter(o => o.status === 'Shipped' && !o.isCancelled).length;
//         if (filterType === 'delivered') return orders.filter(o => o.status === 'Delivered' && !o.isCancelled).length;
//         if (filterType === 'cancelled') return orders.filter(o => o.isCancelled === true).length;
//         return 0;
//     };

//     const viewOrderDetails = (order) => {
//         setSelectedOrder(order);
//         setModalOpen(true);
//     };

//     const exportToCSV = () => {
//         const filteredOrders = getFilteredOrders();
//         const csvData = filteredOrders.map(order => ({
//             'Order ID': order._id,
//             'Customer': order.user?.name || 'Guest',
//             'Email': order.user?.email || '',
//             'Total': order.totalPrice,
//             'Status': getStatusText(order.status, order.isCancelled),
//             'Items': order.orderItems?.length || 0,
//             'Date': new Date(order.createdAt).toLocaleString()
//         }));
        
//         const csvHeaders = Object.keys(csvData[0] || {});
//         const csvRows = [csvHeaders, ...csvData.map(row => csvHeaders.map(header => row[header]))];
//         const csvString = csvRows.map(row => row.join(',')).join('\n');
        
//         const blob = new Blob([csvString], { type: 'text/csv' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
//         a.click();
//         URL.revokeObjectURL(url);
//         toast.success('Orders exported successfully!');
//     };

//     const filteredOrders = getFilteredOrders();
//     const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//     const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     // Reset page when filters change
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [filter, searchTerm, timeFilter, sortOrder]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading orders...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#8B1E2D] to-[#a83246] rounded-2xl shadow-xl p-4 md:p-6 text-white mb-6">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                         <h1 className="text-xl md:text-3xl font-bold">Orders</h1>
//                         <p className="text-white/80 text-xs md:text-sm mt-1">Manage and track customer orders</p>
//                     </div>
//                     <div className="flex gap-2">
//                         <button 
//                             onClick={exportToCSV}
//                             className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition text-sm"
//                         >
//                             <FaDownload size={14} /> Export
//                         </button>
//                         <button 
//                             onClick={fetchOrders} 
//                             className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition text-sm"
//                         >
//                             <FaSyncAlt size={14} /> Refresh
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
//                 <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-[#8B1E2D]">
//                     <p className="text-xs text-gray-500">Total</p>
//                     <p className="text-xl font-bold text-gray-800">{orders.length}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-yellow-500">
//                     <p className="text-xs text-gray-500">Pending</p>
//                     <p className="text-xl font-bold text-yellow-600">{getFilterCount('pending')}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-blue-500">
//                     <p className="text-xs text-gray-500">Shipped</p>
//                     <p className="text-xl font-bold text-blue-600">{getFilterCount('shipped')}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-green-500">
//                     <p className="text-xs text-gray-500">Delivered</p>
//                     <p className="text-xl font-bold text-green-600">{getFilterCount('delivered')}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-red-500">
//                     <p className="text-xs text-gray-500">Cancelled</p>
//                     <p className="text-xl font-bold text-red-600">{getFilterCount('cancelled')}</p>
//                 </div>
//             </div>

//             {/* Filters Bar - Responsive */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//                 <div className="flex flex-col md:flex-row gap-3">
//                     {/* Search */}
//                     <div className="flex-1 relative">
//                         <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Search by Order ID, Customer Name, Email..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] text-sm"
//                         />
//                     </div>
                    
//                     {/* Time Filter */}
//                     <div className="flex gap-2">
//                         <select
//                             value={timeFilter}
//                             onChange={(e) => setTimeFilter(e.target.value)}
//                             className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] text-sm bg-white"
//                         >
//                             <option value="all">All Time</option>
//                             <option value="today">Today</option>
//                             <option value="week">Last 7 Days</option>
//                             <option value="month">Last 30 Days</option>
//                         </select>
                        
//                         {/* Sort Button */}
//                         <button
//                             onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
//                             className="flex items-center gap-1 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//                         >
//                             {sortOrder === 'desc' ? <FaSortAmountDown size={14} /> : <FaSortAmountUp size={14} />}
//                             <span className="text-sm hidden sm:inline">{sortOrder === 'desc' ? 'Latest' : 'Oldest'}</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Status Filter Buttons - Scrollable on Mobile */}
//             <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//                 {[
//                     { key: 'all', label: 'All Orders', icon: FaShoppingBag, color: 'gray' },
//                     { key: 'pending', label: 'Pending', icon: FaSpinner, color: 'yellow' },
//                     { key: 'shipped', label: 'Shipped', icon: FaTruck, color: 'blue' },
//                     { key: 'delivered', label: 'Delivered', icon: FaCheckCircle, color: 'green' },
//                     { key: 'cancelled', label: 'Cancelled', icon: FaTimesCircle, color: 'red' }
//                 ].map((f) => {
//                     const Icon = f.icon;
//                     const count = getFilterCount(f.key);
//                     const isActive = filter === f.key;
//                     return (
//                         <button 
//                             key={f.key} 
//                             onClick={() => setFilter(f.key)} 
//                             className={`px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap ${
//                                 isActive 
//                                     ? 'bg-[#8B1E2D] text-white shadow-md' 
//                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                             }`}
//                         >
//                             <Icon size={12} /> {f.label}
//                             <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
//                                 isActive ? 'bg-white/20' : 'bg-gray-300'
//                             }`}>
//                                 {count}
//                             </span>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Mobile Card View */}
//             <div className="block md:hidden space-y-4">
//                 {paginatedOrders.map((order) => (
//                     <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
//                         <div className="flex justify-between items-start mb-3">
//                             <div>
//                                 <p className="font-mono text-sm font-bold text-gray-800">#{order._id?.slice(-8)}</p>
//                                 <div className="flex items-center gap-1 mt-1">
//                                     <FaClock size={10} className="text-gray-400" />
//                                     <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
//                                 </div>
//                             </div>
//                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.isCancelled)}`}>
//                                 {getStatusIcon(order.status, order.isCancelled)} {getStatusText(order.status, order.isCancelled)}
//                             </span>
//                         </div>
                        
//                         <div className="flex items-center gap-3 mb-3">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white font-bold text-sm">
//                                 {(order.user?.name?.charAt(0) || order.user?.email?.charAt(0) || 'G').toUpperCase()}
//                             </div>
//                             <div className="flex-1">
//                                 <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
//                                 <p className="text-xs text-gray-500 truncate">{order.user?.email || 'No email'}</p>
//                             </div>
//                         </div>
                        
//                         <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
//                             <div>
//                                 <p className="text-gray-500">Items</p>
//                                 <p className="font-semibold">{order.orderItems?.length || 0}</p>
//                             </div>
//                             <div>
//                                 <p className="text-gray-500">Total</p>
//                                 <p className="font-bold text-[#8B1E2D]">₹{order.totalPrice?.toLocaleString()}</p>
//                             </div>
//                         </div>
                        
//                         <div className="flex gap-2">
//                             {order.status !== 'Delivered' && order.status !== 'Cancelled' && !order.isCancelled && (
//                                 <button 
//                                     onClick={() => updateStatus(order._id, order.status)} 
//                                     disabled={updatingId === order._id}
//                                     className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#8B1E2D] text-white rounded-lg text-sm"
//                                 >
//                                     {updatingId === order._id ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
//                                     Update
//                                 </button>
//                             )}
//                             <button 
//                                 onClick={() => viewOrderDetails(order)} 
//                                 className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
//                             >
//                                 <FaEye /> View
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Desktop Table View */}
//             <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-[#8B1E2D]">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Order ID</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Customer</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Items</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Total</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Status</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Date</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-white">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {paginatedOrders.map((order) => (
//                                 <tr key={order._id} className="hover:bg-gray-50 transition">
//                                     <td className="px-4 py-3 font-mono text-sm font-semibold">#{order._id?.slice(-8)}</td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-xs font-bold">
//                                                 {(order.user?.name?.charAt(0) || order.user?.email?.charAt(0) || 'G').toUpperCase()}
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
//                                                 <p className="text-xs text-gray-500 truncate max-w-[120px]">{order.user?.email}</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
//                                             <FaShoppingBag size={10} /> {order.orderItems?.length || 0}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 font-bold text-[#8B1E2D]">₹{order.totalPrice?.toLocaleString()}</td>
//                                     <td className="px-4 py-3">
//                                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.isCancelled)}`}>
//                                             {getStatusIcon(order.status, order.isCancelled)} {getStatusText(order.status, order.isCancelled)}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 text-sm text-gray-500">
//                                         <div className="flex items-center gap-1">
//                                             <FaCalendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-3">
//                                         <div className="flex gap-2">
//                                             {order.status !== 'Delivered' && order.status !== 'Cancelled' && !order.isCancelled && (
//                                                 <button onClick={() => updateStatus(order._id, order.status)} disabled={updatingId === order._id} className="p-1.5 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622]">
//                                                     {updatingId === order._id ? <FaSpinner className="animate-spin" size={12} /> : <FaSyncAlt size={12} />}
//                                                 </button>
//                                             )}
//                                             <button onClick={() => viewOrderDetails(order)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
//                                                 <FaEye size={12} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Empty State */}
//             {filteredOrders.length === 0 && (
//                 <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
//                     <div className="text-6xl mb-4">📦</div>
//                     <p className="text-lg">No orders found</p>
//                     <p className="text-sm mt-1">Try changing the filters</p>
//                 </div>
//             )}

//             {/* Pagination */}
//             {filteredOrders.length > 0 && (
//                 <div className="flex justify-between items-center mt-6">
//                     <p className="text-sm text-gray-500">
//                         Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
//                     </p>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                             disabled={currentPage === 1}
//                             className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
//                         >
//                             <FaChevronLeft size={14} />
//                         </button>
//                         <span className="px-3 py-2 bg-[#8B1E2D] text-white rounded-lg text-sm">
//                             {currentPage} / {totalPages}
//                         </span>
//                         <button
//                             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                             disabled={currentPage === totalPages}
//                             className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
//                         >
//                             <FaChevronRight size={14} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Order Details Modal - Same as before */}
//             {modalOpen && selectedOrder && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
//                     <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//                         <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center">
//                             <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
//                             <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                                 <FaTimesCircle size={20} className="text-gray-600" />
//                             </button>
//                         </div>
//                         <div className="p-4 md:p-6 space-y-4">
//                             {/* Order Info */}
//                             <div className="grid grid-cols-2 gap-3 pb-4 border-b">
//                                 <div>
//                                     <p className="text-xs text-gray-500">Order ID</p>
//                                     <p className="font-mono font-semibold text-sm">#{selectedOrder._id}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500">Date</p>
//                                     <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500">Status</p>
//                                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status, selectedOrder.isCancelled)}`}>
//                                         {getStatusIcon(selectedOrder.status, selectedOrder.isCancelled)} {getStatusText(selectedOrder.status, selectedOrder.isCancelled)}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500">Payment</p>
//                                     <p className="text-sm capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
//                                 </div>
//                             </div>

//                             {/* Customer Info */}
//                             <div className="pb-4 border-b">
//                                 <h3 className="font-semibold text-gray-800 mb-2 text-sm">Customer Information</h3>
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white font-bold">
//                                         {(selectedOrder.user?.name?.charAt(0) || selectedOrder.user?.email?.charAt(0) || 'G').toUpperCase()}
//                                     </div>
//                                     <div>
//                                         <p className="font-medium text-gray-800 text-sm">{selectedOrder.user?.name || 'Guest'}</p>
//                                         <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Order Items */}
//                             <div className="pb-4 border-b">
//                                 <h3 className="font-semibold text-gray-800 mb-2 text-sm">Order Items ({selectedOrder.orderItems?.length || 0})</h3>
//                                 <div className="space-y-2 max-h-64 overflow-y-auto">
//                                     {selectedOrder.orderItems?.map((item, idx) => {
//                                         const itemPrice = Number(item.price) || Number(item.productId?.price) || 0;
//                                         const itemQuantity = Number(item.quantity) || 1;
//                                         const itemTotal = itemPrice * itemQuantity;
                                        
//                                         return (
//                                             <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
//                                                 <div className="flex-1">
//                                                     <p className="font-medium text-sm">{item.name || 'Product'}</p>
//                                                     <p className="text-xs text-gray-500">Qty: {itemQuantity} × ₹{itemPrice.toLocaleString()}</p>
//                                                 </div>
//                                                 <p className="font-semibold text-[#8B1E2D] text-sm">₹{itemTotal.toLocaleString()}</p>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>

//                             {/* Total */}
//                             <div className="flex justify-between items-center pt-2">
//                                 <p className="font-bold text-gray-800">Total Amount</p>
//                                 <p className="text-xl font-bold text-[#8B1E2D]">
//                                     ₹{(() => {
//                                         const total = Number(selectedOrder.totalPrice) || 
//                                             selectedOrder.orderItems?.reduce((sum, item) => {
//                                                 const price = Number(item.price) || 0;
//                                                 const qty = Number(item.quantity) || 1;
//                                                 return sum + (price * qty);
//                                             }, 0) || 0;
//                                         return total.toLocaleString();
//                                     })()}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Orders;

// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSyncAlt, 
    FaEye, FaUser, FaCalendar, FaRupeeSign, FaShoppingBag, 
    FaSpinner, FaClock, FaDownload, FaSortAmountDown,
    FaSortAmountUp, FaSearch, FaChevronLeft, FaChevronRight, FaTrash
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/Api';
import { usePermission } from '../hooks/usePermission';
import ConfirmModal from '../components/ConfirmModal';

const Orders = () => {
    const { hasPermission, getUserRole } = usePermission();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [timeFilter, setTimeFilter] = useState('all');
    
    // ✅ Delete Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const canDeleteOrder = hasPermission('delete_order');
    const userRole = getUserRole();
    const isSuperAdmin = userRole === 'super_admin';

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await API.get('/orders/admin/all');
            const ordersData = res.data.orders || res.data || [];
            setOrders(ordersData);
        } catch (err) { 
            toast.error('Failed to fetch orders');
            setOrders([]);
        } finally { 
            setLoading(false); 
        }
    };

    const updateStatus = async (orderId, currentStatus) => {
        const statusMap = { 'Processing': 'Shipped', 'Shipped': 'Delivered' };
        const newStatus = statusMap[currentStatus];
        if (!newStatus) return;
        if (!window.confirm(`Update order status from ${currentStatus} to ${newStatus}?`)) return;
        
        setUpdatingId(orderId);
        try {
            await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (err) { 
            toast.error('Failed to update status');
        } finally { 
            setUpdatingId(null);
        }
    };

    // ✅ Handle delete order
    const handleDeleteClick = (order) => {
        if (!canDeleteOrder && !isSuperAdmin) {
            toast.error('Only Super Admin can delete orders');
            return;
        }
        setOrderToDelete(order);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;
        
        setDeleteLoading(true);
        setShowDeleteModal(false);
        
        try {
            await API.delete(`/orders/admin/${orderToDelete._id}`);
            toast.success('Order deleted successfully!');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete order');
        } finally {
            setDeleteLoading(false);
            setOrderToDelete(null);
        }
    };

    const getStatusIcon = (status, isCancelled) => {
        if (isCancelled) return <FaTimesCircle className="text-red-600" />;
        switch(status) {
            case 'Delivered': return <FaCheckCircle className="text-green-600" />;
            case 'Shipped': return <FaTruck className="text-blue-600" />;
            case 'Processing': return <FaSpinner className="text-yellow-600 animate-spin" />;
            default: return <FaBox className="text-gray-600" />;
        }
    };

    const getStatusColor = (status, isCancelled) => {
        if (isCancelled) return 'bg-red-100 text-red-700';
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status, isCancelled) => {
        if (isCancelled) return 'Cancelled';
        return status;
    };

    const getTimeFilteredOrders = (ordersList) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        
        switch(timeFilter) {
            case 'today':
                return ordersList.filter(o => new Date(o.createdAt) >= today);
            case 'week':
                return ordersList.filter(o => new Date(o.createdAt) >= weekAgo);
            case 'month':
                return ordersList.filter(o => new Date(o.createdAt) >= monthAgo);
            default:
                return ordersList;
        }
    };

    const getFilteredOrders = () => {
        let filtered = [...orders];
        
        filtered = filtered.filter(order => {
            if (filter === 'all') return true;
            if (filter === 'pending') return order.status === 'Processing' && !order.isCancelled;
            if (filter === 'shipped') return order.status === 'Shipped' && !order.isCancelled;
            if (filter === 'delivered') return order.status === 'Delivered' && !order.isCancelled;
            if (filter === 'cancelled') return order.isCancelled === true;
            return true;
        });
        
        filtered = getTimeFilteredOrders(filtered);
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        filtered.sort((a, b) => {
            if (sortOrder === 'desc') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
        
        return filtered;
    };

    const getFilterCount = (filterType) => {
        if (filterType === 'all') return orders.length;
        if (filterType === 'pending') return orders.filter(o => o.status === 'Processing' && !o.isCancelled).length;
        if (filterType === 'shipped') return orders.filter(o => o.status === 'Shipped' && !o.isCancelled).length;
        if (filterType === 'delivered') return orders.filter(o => o.status === 'Delivered' && !o.isCancelled).length;
        if (filterType === 'cancelled') return orders.filter(o => o.isCancelled === true).length;
        return 0;
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const exportToCSV = () => {
        const filteredOrders = getFilteredOrders();
        const csvData = filteredOrders.map(order => ({
            'Order ID': order._id,
            'Customer': order.user?.name || 'Guest',
            'Email': order.user?.email || '',
            'Total': order.totalPrice,
            'Status': getStatusText(order.status, order.isCancelled),
            'Items': order.orderItems?.length || 0,
            'Date': new Date(order.createdAt).toLocaleString()
        }));
        
        const csvHeaders = Object.keys(csvData[0] || {});
        const csvRows = [csvHeaders, ...csvData.map(row => csvHeaders.map(header => row[header]))];
        const csvString = csvRows.map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Orders exported successfully!');
    };

    const filteredOrders = getFilteredOrders();
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm, timeFilter, sortOrder]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B1E2D] to-[#a83246] rounded-2xl shadow-xl p-4 md:p-6 text-white mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold">Orders</h1>
                        <p className="text-white/80 text-xs md:text-sm mt-1">Manage and track customer orders</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={exportToCSV} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition text-sm">
                            <FaDownload size={14} /> Export
                        </button>
                        <button onClick={fetchOrders} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition text-sm">
                            <FaSyncAlt size={14} /> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-[#8B1E2D]">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-yellow-500">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{getFilterCount('pending')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500">Shipped</p>
                    <p className="text-xl font-bold text-blue-600">{getFilterCount('shipped')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-green-500">
                    <p className="text-xs text-gray-500">Delivered</p>
                    <p className="text-xl font-bold text-green-600">{getFilterCount('delivered')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 text-center border-l-4 border-red-500">
                    <p className="text-xs text-gray-500">Cancelled</p>
                    <p className="text-xl font-bold text-red-600">{getFilterCount('cancelled')}</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer Name, Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D] text-sm bg-white">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                        <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            {sortOrder === 'desc' ? <FaSortAmountDown size={14} /> : <FaSortAmountUp size={14} />}
                            <span className="text-sm hidden sm:inline">{sortOrder === 'desc' ? 'Latest' : 'Oldest'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { key: 'all', label: 'All Orders', icon: FaShoppingBag },
                    { key: 'pending', label: 'Pending', icon: FaSpinner },
                    { key: 'shipped', label: 'Shipped', icon: FaTruck },
                    { key: 'delivered', label: 'Delivered', icon: FaCheckCircle },
                    { key: 'cancelled', label: 'Cancelled', icon: FaTimesCircle }
                ].map((f) => {
                    const Icon = f.icon;
                    const count = getFilterCount(f.key);
                    const isActive = filter === f.key;
                    return (
                        <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 md:px-4 py-2 rounded-lg transition flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap ${isActive ? 'bg-[#8B1E2D] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <Icon size={12} /> {f.label}
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-300'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#8B1E2D]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-mono text-sm font-semibold">#{order._id?.slice(-8)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white text-xs font-bold">
                                                {(order.user?.name?.charAt(0) || order.user?.email?.charAt(0) || 'G').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[120px]">{order.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                                            <FaShoppingBag size={10} /> {order.orderItems?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-[#8B1E2D]">₹{order.totalPrice?.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.isCancelled)}`}>
                                            {getStatusIcon(order.status, order.isCancelled)} {getStatusText(order.status, order.isCancelled)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1"><FaCalendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && !order.isCancelled && (
                                                <button onClick={() => updateStatus(order._id, order.status)} disabled={updatingId === order._id} className="p-1.5 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622]">
                                                    {updatingId === order._id ? <FaSpinner className="animate-spin" size={12} /> : <FaSyncAlt size={12} />}
                                                </button>
                                            )}
                                            <button onClick={() => viewOrderDetails(order)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                <FaEye size={12} />
                                            </button>
                                            {(canDeleteOrder || isSuperAdmin) && (
                                                <button onClick={() => handleDeleteClick(order)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                                    <FaTrash size={12} />
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
            {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-lg">No orders found</p>
                    <p className="text-sm mt-1">Try changing the filters</p>
                </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"><FaChevronLeft size={14} /></button>
                        <span className="px-3 py-2 bg-[#8B1E2D] text-white rounded-lg text-sm">{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"><FaChevronRight size={14} /></button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {modalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Order Details</h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FaTimesCircle size={20} className="text-gray-600" /></button>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3 pb-4 border-b">
                                <div><p className="text-xs text-gray-500">Order ID</p><p className="font-mono font-semibold text-sm">#{selectedOrder._id}</p></div>
                                <div><p className="text-xs text-gray-500">Date</p><p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                                <div><p className="text-xs text-gray-500">Status</p><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status, selectedOrder.isCancelled)}`}>{getStatusIcon(selectedOrder.status, selectedOrder.isCancelled)} {getStatusText(selectedOrder.status, selectedOrder.isCancelled)}</span></div>
                                <div><p className="text-xs text-gray-500">Payment</p><p className="text-sm capitalize">{selectedOrder.paymentMethod || 'N/A'}</p></div>
                            </div>
                            <div className="pb-4 border-b">
                                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Customer Information</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B1E2D] to-[#a83246] flex items-center justify-center text-white font-bold">{(selectedOrder.user?.name?.charAt(0) || selectedOrder.user?.email?.charAt(0) || 'G').toUpperCase()}</div>
                                    <div><p className="font-medium text-gray-800 text-sm">{selectedOrder.user?.name || 'Guest'}</p><p className="text-xs text-gray-500">{selectedOrder.user?.email}</p></div>
                                </div>
                            </div>
                            <div className="pb-4 border-b">
                                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Order Items ({selectedOrder.orderItems?.length || 0})</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {selectedOrder.orderItems?.map((item, idx) => {
                                        const itemPrice = Number(item.price) || 0;
                                        const itemQuantity = Number(item.quantity) || 1;
                                        return (<div key={idx} className="flex justify-between items-start py-2 border-b last:border-0"><div className="flex-1"><p className="font-medium text-sm">{item.name || 'Product'}</p><p className="text-xs text-gray-500">Qty: {itemQuantity} × ₹{itemPrice.toLocaleString()}</p></div><p className="font-semibold text-[#8B1E2D] text-sm">₹{(itemPrice * itemQuantity).toLocaleString()}</p></div>);
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2"><p className="font-bold text-gray-800">Total Amount</p><p className="text-xl font-bold text-[#8B1E2D]">₹{Number(selectedOrder.totalPrice).toLocaleString()}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setOrderToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Order"
                message={`Are you sure you want to delete order #${orderToDelete?._id?.slice(-8)}?`}
                confirmText="Yes, Delete Order"
                cancelText="Cancel"
                isLoading={deleteLoading}
            />
        </div>
    );
};

export default Orders;