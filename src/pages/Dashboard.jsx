

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//     FaBox, FaShoppingCart, FaUsers, FaRupeeSign, FaEye, 
//     FaChartLine, FaArrowRight, FaSpinner, FaCheckCircle,
//     FaTruck, FaTimesCircle, FaPercent, FaUserCheck, 
//     FaUserPlus, FaStore, FaCalendarWeek, FaHourglassHalf,
//     FaClipboardList, FaExclamationTriangle
// } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import API from '../utils/api';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         totalProducts: 0,
//         totalOrders: 0,
//         totalUsers: 0,
//         totalRevenue: 0,
//         pendingOrders: 0,
//         deliveredOrders: 0,
//         cancelledOrders: 0,
//         lowStockProducts: 0,
//         outOfStockProducts: 0,
//         activeUsers: 0,
//         newUsersThisMonth: 0,
//         avgOrderValue: 0
//     });
//     const [recentOrders, setRecentOrders] = useState([]);
//     const [recentProducts, setRecentProducts] = useState([]);
//     const [recentUsers, setRecentUsers] = useState([]);

//     useEffect(() => {
//         fetchAllData();
//     }, []);

//     const fetchAllData = async () => {
//         setLoading(true);
//         try {
//             const [productsRes, usersRes, ordersRes] = await Promise.all([
//                 API.get('/products/all'),
//                 API.get('/admin/users'),
//                 API.get('/orders/admin/all')
//             ]);

//             const products = productsRes.data?.products || productsRes.data || [];
//             const users = usersRes.data?.users || usersRes.data || [];
//             const orders = ordersRes.data?.orders || ordersRes.data || [];

//             // Orders Stats
//             const pendingOrders = orders.filter(o => o.status === 'Processing' && !o.isCancelled).length;
//             const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
//             const cancelledOrders = orders.filter(o => o.isCancelled === true).length;
//             const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
//             const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

//             // Products Stats
//             const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
//             const outOfStockProducts = products.filter(p => p.stock === 0).length;

//             // Users Stats
//             const now = new Date();
//             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//             const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= startOfMonth).length;

//             const thirtyDaysAgo = new Date();
//             thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
//             const usersWithRecentOrder = new Set();
//             orders.forEach(order => {
//                 if (order.user?._id && new Date(order.createdAt) >= thirtyDaysAgo) {
//                     usersWithRecentOrder.add(order.user._id);
//                 }
//             });
            
//             const activeUsers = users.filter(u => {
//                 const lastLogin = u.lastLogin ? new Date(u.lastLogin) : null;
//                 const isRecentLogin = lastLogin && lastLogin >= thirtyDaysAgo;
//                 const hasRecentOrder = usersWithRecentOrder.has(u._id);
//                 return isRecentLogin || hasRecentOrder;
//             }).length;

//             setStats({
//                 totalProducts: products.length,
//                 totalOrders: orders.length,
//                 totalUsers: users.length,
//                 totalRevenue,
//                 pendingOrders,
//                 deliveredOrders,
//                 cancelledOrders,
//                 lowStockProducts,
//                 outOfStockProducts,
//                 activeUsers,
//                 newUsersThisMonth,
//                 avgOrderValue
//             });
            
//             setRecentOrders(orders.slice(0, 5));
//             setRecentProducts(products.slice(0, 6));
//             setRecentUsers(users.slice(0, 5));
            
//         } catch (err) {
//             console.error("Dashboard API Error:", err);
//             toast.error("Failed to load dashboard data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getStatusBadge = (status, isCancelled) => {
//         if (isCancelled) {
//             return { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, text: 'Cancelled' };
//         }
//         switch(status) {
//             case 'Delivered':
//                 return { color: 'bg-green-100 text-green-700', icon: FaCheckCircle, text: 'Delivered' };
//             case 'Shipped':
//                 return { color: 'bg-blue-100 text-blue-700', icon: FaTruck, text: 'Shipped' };
//             case 'Processing':
//                 return { color: 'bg-yellow-100 text-yellow-700', icon: FaSpinner, text: 'Processing' };
//             default:
//                 return { color: 'bg-gray-100 text-gray-700', icon: FaBox, text: status || 'Placed' };
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading dashboard data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
//             {/* Header with Brand Color */}
//             <div className="bg-gradient-to-r from-[#8B1E2D] to-[#a83246] rounded-2xl shadow-xl p-6 text-white">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
//                         <p className="text-white/80 text-sm mt-1">Real-time data from your store</p>
//                     </div>
//                     <div className="mt-3 md:mt-0 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
//                         <FaCalendarWeek className="text-white/80" />
//                         <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Main KPI Cards - All API Data */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/orders')}>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-sm opacity-90">Total Revenue</p>
//                             <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
//                         </div>
//                         <FaRupeeSign className="text-3xl opacity-80" />
//                     </div>
//                     <div className="mt-3 text-xs opacity-80">From {stats.totalOrders} orders</div>
//                 </div>
                
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#9e2a3a] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/orders')}>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-sm opacity-90">Total Orders</p>
//                             <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
//                         </div>
//                         <FaShoppingCart className="text-3xl opacity-80" />
//                     </div>
//                     <div className="mt-3 flex justify-between items-center">
//                         <span className="text-xs opacity-80">Delivered: {stats.deliveredOrders}</span>
//                         <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Pending: {stats.pendingOrders}</span>
//                     </div>
//                 </div>
                
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#7a1a28] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/users')}>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-sm opacity-90">Total Users</p>
//                             <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
//                         </div>
//                         <FaUsers className="text-3xl opacity-80" />
//                     </div>
//                     <div className="mt-3 flex justify-between items-center">
//                         <span className="text-xs opacity-80">Active (30d): {stats.activeUsers}</span>
//                         <span className="text-xs bg-white/20 px-2 py-1 rounded-full">New: {stats.newUsersThisMonth}</span>
//                     </div>
//                 </div>
                
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#8a1d2c] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/products')}>
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <p className="text-sm opacity-90">Total Products</p>
//                             <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
//                         </div>
//                         <FaBox className="text-3xl opacity-80" />
//                     </div>
//                     <div className="mt-3 flex justify-between items-center">
//                         <span className="text-xs opacity-80">In Stock: {stats.totalProducts - stats.outOfStockProducts}</span>
//                         {stats.lowStockProducts > 0 && (
//                             <span className="text-xs bg-yellow-400 text-[#8B1E2D] px-2 py-1 rounded-full font-semibold">{stats.lowStockProducts} low stock</span>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Secondary Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                 <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D] cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
//                     <div className="flex items-center gap-2">
//                         <FaHourglassHalf className="text-[#8B1E2D]" />
//                         <p className="text-gray-500 text-sm">Pending Orders</p>
//                     </div>
//                     <p className="text-2xl font-bold mt-1">{stats.pendingOrders}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
//                     <div className="flex items-center gap-2">
//                         <FaCheckCircle className="text-green-500" />
//                         <p className="text-gray-500 text-sm">Delivered</p>
//                     </div>
//                     <p className="text-2xl font-bold mt-1">{stats.deliveredOrders}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
//                     <div className="flex items-center gap-2">
//                         <FaTimesCircle className="text-red-500" />
//                         <p className="text-gray-500 text-sm">Cancelled</p>
//                     </div>
//                     <p className="text-2xl font-bold mt-1">{stats.cancelledOrders}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D] cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/products')}>
//                     <div className="flex items-center gap-2">
//                         <FaExclamationTriangle className="text-[#8B1E2D]" />
//                         <p className="text-gray-500 text-sm">Low Stock</p>
//                     </div>
//                     <p className="text-2xl font-bold text-[#8B1E2D]">{stats.lowStockProducts}</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D]">
//                     <div className="flex items-center gap-2">
//                         <FaRupeeSign className="text-[#8B1E2D]" />
//                         <p className="text-gray-500 text-sm">Avg Order Value</p>
//                     </div>
//                     <p className="text-2xl font-bold mt-1">₹{Math.round(stats.avgOrderValue).toLocaleString()}</p>
//                 </div>
//             </div>

//             {/* Recent Orders & Recent Users - Side by Side */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Orders Table */}
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
//                         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                             <FaClipboardList className="text-[#8B1E2D]" />
//                             Recent Orders
//                         </h2>
//                         <button onClick={() => navigate('/admin/orders')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
//                             View All <FaArrowRight size={12} />
//                         </button>
//                     </div>
//                     <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 sticky top-0">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {recentOrders.map((order) => {
//                                     const statusInfo = getStatusBadge(order.status, order.isCancelled);
//                                     const StatusIcon = statusInfo.icon;
//                                     return (
//                                         <tr key={order._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/order/${order._id}`)}>
//                                             <td className="px-4 py-3 font-mono text-sm">#{order._id?.slice(-8)}</td>
//                                             <td className="px-4 py-3">
//                                                 <div className="flex items-center gap-2">
//                                                     {/* User Image from API */}
//                                                     <img 
//                                                         src={order.user?.profileImage || order.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.name || 'User')}&background=8B1E2D&color=fff`}
//                                                         alt={order.user?.name}
//                                                         className="w-8 h-8 rounded-full object-cover"
//                                                         onError={(e) => {
//                                                             e.target.onerror = null;
//                                                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.name || 'User')}&background=8B1E2D&color=fff`;
//                                                         }}
//                                                     />
//                                                     <div>
//                                                         <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
//                                                         <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.user?.email}</p>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-4 py-3 font-semibold text-gray-800">₹{order.totalPrice}</td>
//                                             <td className="px-4 py-3">
//                                                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
//                                                     <StatusIcon size={12} /> {statusInfo.text}
//                                                 </span>
//                                             </td>
//                                             <td className="px-4 py-3">
//                                                 <button className="text-[#8B1E2D] hover:text-[#6B1622] transition">
//                                                     <FaEye size={18} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                                 {recentOrders.length === 0 && (
//                                     <tr>
//                                         <td colSpan="5" className="text-center py-8 text-gray-500">No orders found</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Recent Users List with Profile Images */}
//                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
//                         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                             <FaUsers className="text-[#8B1E2D]" />
//                             Recent Users
//                         </h2>
//                         <button onClick={() => navigate('/admin/users')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
//                             View All <FaArrowRight size={12} />
//                         </button>
//                     </div>
//                     <div className="divide-y divide-gray-200 max-h-[450px] overflow-y-auto">
//                         {recentUsers.map((user) => (
//                             <div 
//                                 key={user._id} 
//                                 className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer flex items-center justify-between"
//                                 onClick={() => navigate(`/admin/users/${user._id}`)}
//                             >
//                                 <div className="flex items-center gap-3">
//                                     {/* User Profile Image from API */}
//                                     <img 
//                                         src={user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=8B1E2D&color=fff`}
//                                         alt={user.name}
//                                         className="w-10 h-10 rounded-full object-cover border-2 border-[#8B1E2D]"
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=8B1E2D&color=fff`;
//                                         }}
//                                     />
//                                     <div>
//                                         <p className="font-semibold text-gray-800">{user.name || 'N/A'}</p>
//                                         <p className="text-sm text-gray-500">{user.email}</p>
//                                         <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                                         <FaUserCheck size={10} /> Active
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                         {recentUsers.length === 0 && (
//                             <div className="text-center py-8 text-gray-500">No users found</div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Products with Images */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
//                     <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                         <FaStore className="text-[#8B1E2D]" />
//                         Recent Products
//                     </h2>
//                     <button onClick={() => navigate('/admin/products')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
//                         View All <FaArrowRight size={12} />
//                     </button>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-6">
//                     {recentProducts.map((product) => (
//                         <div 
//                             key={product._id} 
//                             className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
//                             onClick={() => navigate(`/admin/products/edit/${product._id}`)}
//                         >
//                             <div className="relative h-48 overflow-hidden bg-gray-100">
//                                 {/* Product Image from API */}
//                                 <img 
//                                     src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
//                                     alt={product.name}
//                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
//                                     }}
//                                 />
//                                 {product.stock === 0 && (
//                                     <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
//                                         Out of Stock
//                                     </div>
//                                 )}
//                                 {product.stock > 0 && product.stock < 10 && (
//                                     <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
//                                         Low Stock: {product.stock}
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="p-3">
//                                 <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
//                                 <p className="text-[#8B1E2D] font-bold text-lg mt-1">₹{product.price}</p>
//                                 <div className="flex justify-between items-center mt-2">
//                                     <p className="text-xs text-gray-500">Stock: {product.stock}</p>
//                                     <p className="text-xs text-gray-400">ID: {product._id?.slice(-6)}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                     {recentProducts.length === 0 && (
//                         <div className="col-span-full text-center py-12 text-gray-500">
//                             No products found
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Footer Stats */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] rounded-xl shadow p-4 text-white">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-xs opacity-80">Out of Stock</p>
//                             <p className="text-xl font-bold">{stats.outOfStockProducts}</p>
//                         </div>
//                         <FaBox className="text-2xl opacity-80" />
//                     </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#7a1a28] rounded-xl shadow p-4 text-white cursor-pointer" onClick={() => navigate('/admin/coupons')}>
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-xs opacity-80">Active Coupons</p>
//                             <p className="text-xl font-bold">—</p>
//                         </div>
//                         <FaPercent className="text-2xl opacity-80" />
//                     </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#8a1d2c] rounded-xl shadow p-4 text-white">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-xs opacity-80">Completion Rate</p>
//                             <p className="text-xl font-bold">
//                                 {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%
//                             </p>
//                         </div>
//                         <FaChartLine className="text-2xl opacity-80" />
//                     </div>
//                 </div>
//                 <div className="bg-gradient-to-r from-[#8B1E2D] to-[#9e2a3a] rounded-xl shadow p-4 text-white cursor-pointer" onClick={() => navigate('/admin/users')}>
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <p className="text-xs opacity-80">Active Users (30d)</p>
//                             <p className="text-xl font-bold">{stats.activeUsers}</p>
//                         </div>
//                         <FaUserPlus className="text-2xl opacity-80" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaBox, FaShoppingCart, FaUsers, FaRupeeSign, FaEye, 
    FaChartLine, FaArrowRight, FaSpinner, FaCheckCircle,
    FaTruck, FaTimesCircle, FaPercent, FaUserCheck, 
    FaUserPlus, FaStore, FaCalendarWeek, FaHourglassHalf,
    FaClipboardList, FaExclamationTriangle, FaChartLine as FaTrendUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/Api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        avgOrderValue: 0,
        revenueGrowth: 0,
        orderGrowth: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    // Dashboard.jsx
useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
        if (isMounted) {
            await fetchAllData();
        }
    };
    
    fetchData();
    
    return () => {
        isMounted = false;
    };
}, []); // ✅ Empty dependency array - sirf ek baar

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [productsRes, usersRes, ordersRes] = await Promise.all([
                API.get('/products/all'),
                API.get('/admin/users'),
                API.get('/orders/admin/all')
            ]);

            const products = productsRes.data?.products || productsRes.data || [];
            const users = usersRes.data?.users || usersRes.data || [];
            const orders = ordersRes.data?.orders || ordersRes.data || [];

            // Orders Stats
            const pendingOrders = orders.filter(o => o.status === 'Processing' && !o.isCancelled).length;
            const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
            const cancelledOrders = orders.filter(o => o.isCancelled === true).length;
            const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

            // Growth calculation (compare last 30 days with previous 30 days)
            const now = new Date();
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 60));
            
            const recentOrdersData = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
            const previousOrdersData = orders.filter(o => new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo);
            
            const recentRevenue = recentOrdersData.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            const previousRevenue = previousOrdersData.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            
            const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
            const orderGrowth = previousOrdersData.length > 0 ? ((recentOrdersData.length - previousOrdersData.length) / previousOrdersData.length) * 100 : 0;

            // Products Stats
            const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
            const outOfStockProducts = products.filter(p => p.stock === 0).length;

            // Users Stats
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= startOfMonth).length;
            
            const usersWithRecentOrder = new Set();
            orders.forEach(order => {
                if (order.user?._id && new Date(order.createdAt) >= thirtyDaysAgo) {
                    usersWithRecentOrder.add(order.user._id);
                }
            });
            
            const activeUsers = users.filter(u => {
                const lastLogin = u.lastLogin ? new Date(u.lastLogin) : null;
                const isRecentLogin = lastLogin && lastLogin >= thirtyDaysAgo;
                const hasRecentOrder = usersWithRecentOrder.has(u._id);
                return isRecentLogin || hasRecentOrder;
            }).length;

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalUsers: users.length,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                lowStockProducts,
                outOfStockProducts,
                activeUsers,
                newUsersThisMonth,
                avgOrderValue,
                revenueGrowth,
                orderGrowth
            });
            
            setRecentOrders(orders.slice(0, 5));
            setRecentProducts(products.slice(0, 6));
            setRecentUsers(users.slice(0, 5));
            
        } catch (err) {
            console.error("Dashboard API Error:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status, isCancelled) => {
        if (isCancelled) return { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, text: 'Cancelled' };
        switch(status) {
            case 'Delivered': return { color: 'bg-green-100 text-green-700', icon: FaCheckCircle, text: 'Delivered' };
            case 'Shipped': return { color: 'bg-blue-100 text-blue-700', icon: FaTruck, text: 'Shipped' };
            case 'Processing': return { color: 'bg-yellow-100 text-yellow-700', icon: FaSpinner, text: 'Processing' };
            default: return { color: 'bg-gray-100 text-gray-700', icon: FaBox, text: status || 'Placed' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Growth Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.revenueGrowth !== 0 && (
                    <div className={`flex items-center gap-2 text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'} bg-white rounded-lg px-4 py-2 shadow-sm`}>
                        <FaTrendUp />
                        <span>Revenue {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth).toFixed(1)}% from last month</span>
                    </div>
                )}
                {stats.orderGrowth !== 0 && (
                    <div className={`flex items-center gap-2 text-sm ${stats.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'} bg-white rounded-lg px-4 py-2 shadow-sm`}>
                        <FaTrendUp />
                        <span>Orders {stats.orderGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.orderGrowth).toFixed(1)}% from last month</span>
                    </div>
                )}
            </div>

            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/orders')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-90">Total Revenue</p>
                            <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <FaRupeeSign className="text-3xl opacity-80" />
                    </div>
                    <div className="mt-3 text-xs opacity-80">From {stats.totalOrders} orders</div>
                </div>
                
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#9e2a3a] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/orders')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-90">Total Orders</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                        </div>
                        <FaShoppingCart className="text-3xl opacity-80" />
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs opacity-80">Delivered: {stats.deliveredOrders}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Pending: {stats.pendingOrders}</span>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#7a1a28] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/users')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-90">Total Users</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                        </div>
                        <FaUsers className="text-3xl opacity-80" />
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs opacity-80">Active (30d): {stats.activeUsers}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">New: {stats.newUsersThisMonth}</span>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#8a1d2c] rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/admin/products')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm opacity-90">Total Products</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                        </div>
                        <FaBox className="text-3xl opacity-80" />
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs opacity-80">In Stock: {stats.totalProducts - stats.outOfStockProducts}</span>
                        {stats.lowStockProducts > 0 && (
                            <span className="text-xs bg-yellow-400 text-[#8B1E2D] px-2 py-1 rounded-full font-semibold">{stats.lowStockProducts} low stock</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D] cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
                    <div className="flex items-center gap-2">
                        <FaHourglassHalf className="text-[#8B1E2D]" />
                        <p className="text-gray-500 text-sm">Pending Orders</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <p className="text-gray-500 text-sm">Delivered</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats.deliveredOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/orders')}>
                    <div className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-500" />
                        <p className="text-gray-500 text-sm">Cancelled</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stats.cancelledOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D] cursor-pointer hover:shadow-md transition" onClick={() => navigate('/admin/products')}>
                    <div className="flex items-center gap-2">
                        <FaExclamationTriangle className="text-[#8B1E2D]" />
                        <p className="text-gray-500 text-sm">Low Stock</p>
                    </div>
                    <p className="text-2xl font-bold text-[#8B1E2D]">{stats.lowStockProducts}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-[#8B1E2D]">
                    <div className="flex items-center gap-2">
                        <FaRupeeSign className="text-[#8B1E2D]" />
                        <p className="text-gray-500 text-sm">Avg Order Value</p>
                    </div>
                    <p className="text-2xl font-bold mt-1">₹{Math.round(stats.avgOrderValue).toLocaleString()}</p>
                </div>
            </div>

            {/* Recent Orders & Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaClipboardList className="text-[#8B1E2D]" />
                            Recent Orders
                        </h2>
                        <button onClick={() => navigate('/admin/orders')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
                            View All <FaArrowRight size={12} />
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.map((order) => {
                                    const statusInfo = getStatusBadge(order.status, order.isCancelled);
                                    const StatusIcon = statusInfo.icon;
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/order/${order._id}`)}>
                                            <td className="px-4 py-3 font-mono text-sm">#{order._id?.slice(-8)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <img src={`https://ui-avatars.com/api/?name=${order.user?.name || 'User'}&background=8B1E2D&color=fff`} alt={order.user?.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{order.user?.name || 'Guest'}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-800">₹{order.totalPrice}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon size={12} /> {statusInfo.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-[#8B1E2D] hover:text-[#6B1622] transition">
                                                    <FaEye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {recentOrders.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-8 text-gray-500">No orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Users List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaUsers className="text-[#8B1E2D]" />
                            Recent Users
                        </h2>
                        <button onClick={() => navigate('/admin/users')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
                            View All <FaArrowRight size={12} />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-[450px] overflow-y-auto">
                        {recentUsers.map((user) => (
                            <div key={user._id} className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer flex items-center justify-between" onClick={() => navigate(`/admin/users/${user._id}`)}>
                                <div className="flex items-center gap-3">
                                    <img src={`https://ui-avatars.com/api/?name=${user.name || user.email || 'User'}&background=8B1E2D&color=fff`} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#8B1E2D]" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <FaUserCheck size={10} /> Active
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentUsers.length === 0 && <div className="text-center py-8 text-gray-500">No users found</div>}
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FaStore className="text-[#8B1E2D]" />
                        Recent Products
                    </h2>
                    <button onClick={() => navigate('/admin/products')} className="text-[#8B1E2D] text-sm hover:underline flex items-center gap-1">
                        View All <FaArrowRight size={12} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-6">
                    {recentProducts.map((product) => (
                        <div key={product._id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1" onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                            <div className="relative h-40 overflow-hidden bg-gray-100">
                                <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                {product.stock === 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Out of Stock</div>}
                                {product.stock > 0 && product.stock < 10 && <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Low Stock: {product.stock}</div>}
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-800 truncate text-sm">{product.name}</h3>
                                <p className="text-[#8B1E2D] font-bold text-base mt-1">₹{product.price?.toLocaleString()}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                    <p className="text-xs text-gray-400">ID: {product._id?.slice(-6)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recentProducts.length === 0 && <div className="col-span-full text-center py-12 text-gray-500">No products found</div>}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] rounded-xl shadow p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div><p className="text-xs opacity-80">Out of Stock</p><p className="text-xl font-bold">{stats.outOfStockProducts}</p></div>
                        <FaBox className="text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#7a1a28] rounded-xl shadow p-4 text-white cursor-pointer" onClick={() => navigate('/admin/coupons')}>
                    <div className="flex justify-between items-center">
                        <div><p className="text-xs opacity-80">Active Coupons</p><p className="text-xl font-bold">—</p></div>
                        <FaPercent className="text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#8a1d2c] rounded-xl shadow p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div><p className="text-xs opacity-80">Completion Rate</p><p className="text-xl font-bold">{stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%</p></div>
                        <FaChartLine className="text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#9e2a3a] rounded-xl shadow p-4 text-white cursor-pointer" onClick={() => navigate('/admin/users')}>
                    <div className="flex justify-between items-center">
                        <div><p className="text-xs opacity-80">Active Users (30d)</p><p className="text-xl font-bold">{stats.activeUsers}</p></div>
                        <FaUserPlus className="text-2xl opacity-80" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;