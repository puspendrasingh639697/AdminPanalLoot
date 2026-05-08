// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { 
//     FaEdit, FaTrash, FaPlus, FaEye, FaBox, FaTag, FaImage, 
//     FaSyncAlt, FaCheckCircle, FaTruck, FaSpinner, FaTimesCircle, 
//     FaChartLine, FaUsers, FaPercent, FaCalendarAlt, FaHeart
// } from "react-icons/fa";
// import { 
//     fetchAllCoupons, 
//     toggleCouponStatus, 
//     deleteCoupon,
//     selectAllCoupons,
//     selectCouponLoading
// } from "../redux/slices/couponSlice";
// // import CouponCreateModal from "../Component/CouponCreateModal";
// import API from "../utils/api";
// import CouponCreateModal from "../pages/CouponCreateModal";
// // import API from "../Util/Api";

// const AdminDashboard = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
    
//     // Redux Selectors
//     const coupons = useSelector(selectAllCoupons);
//     const couponLoading = useSelector(selectCouponLoading);
    
//     const [activeTab, setActiveTab] = useState("products");
//     const [loading, setLoading] = useState(true);
//     const [products, setProducts] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [orders, setOrders] = useState([]);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showCouponModal, setShowCouponModal] = useState(false);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState("");
//     const [updatingStatus, setUpdatingStatus] = useState(false);
    
//     // Stats State
//     const [stats, setStats] = useState({
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalProducts: 0,
//         totalUsers: 0,
//         pendingOrders: 0,
//         lowStockProducts: 0
//     });
    
//     const [formData, setFormData] = useState({
//         name: "",
//         category: "",
//         price: "",
//         description: "",
//         stock: "",
//         image: ""
//     });

//     const categoriesList = [
//         "Copper Utensils",
//         "Steel Bottles",
//         "Thermoware & Lunchboxes",
//         "Cookware Sets",
//         "Home Appliances",
//         "Cookers (Aluminum, Steel, Triply)"
//     ];

//     // Fetch all data
//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user') || '{}');
//         if (user.role !== "admin") {
//             toast.error("Admin access required!");
//             navigate('/');
//             return;
//         }
//         fetchProducts();
//         fetchUsers();
//         fetchOrders();
//         fetchStats();
//     }, []);

//     // Fetch coupons when tab changes
//     useEffect(() => {
//         if (activeTab === "coupons") {
//             dispatch(fetchAllCoupons());
//         }
//     }, [activeTab, dispatch]);

//     const fetchProducts = async () => {
//         try {
//             const response = await API.get('/products/all');
//             if (Array.isArray(response.data)) {
//                 setProducts(response.data);
//             } else if (response.data?.products) {
//                 setProducts(response.data.products);
//             } else {
//                 setProducts([]);
//             }
//         } catch (err) {
//             toast.error("Failed to fetch products");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchUsers = async () => {
//         try {
//             const response = await API.get('/admin/users');
//             if (Array.isArray(response.data)) {
//                 setUsers(response.data);
//             }
//         } catch (err) {
//             console.error("Failed to fetch users");
//         }
//     };

//     const fetchOrders = async () => {
//         try {
//             const response = await API.get('/orders/admin/all');
//             if (Array.isArray(response.data)) {
//                 setOrders(response.data);
//             } else if (response.data?.orders) {
//                 setOrders(response.data.orders);
//             }
//         } catch (err) {
//             console.error("Failed to fetch orders");
//         }
//     };

//     const fetchStats = async () => {
//         try {
//             const response = await API.get('/orders/admin/stats');
//             setStats(response.data);
//         } catch (err) {
//             console.error("Failed to fetch stats", err);
//             setStats({
//                 totalOrders: orders.length,
//                 totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
//                 totalProducts: products.length,
//                 totalUsers: users.length,
//                 pendingOrders: orders.filter(o => o.status === 'Processing' && !o.isCancelled).length,
//                 lowStockProducts: products.filter(p => p.stock < 5).length
//             });
//         }
//     };

//     useEffect(() => {
//         if (products.length > 0 || orders.length > 0 || users.length > 0) {
//             setStats({
//                 totalOrders: orders.length,
//                 totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
//                 totalProducts: products.length,
//                 totalUsers: users.length,
//                 pendingOrders: orders.filter(o => o.status === 'Processing' && !o.isCancelled).length,
//                 lowStockProducts: products.filter(p => p.stock < 5).length
//             });
//         }
//     }, [products, orders, users]);

//     const handleUpdateOrderStatus = async (orderId, currentStatus) => {
//         let newStatus = "";
//         switch(currentStatus) {
//             case "Processing":
//                 newStatus = "Shipped";
//                 break;
//             case "Shipped":
//                 newStatus = "Delivered";
//                 break;
//             case "Delivered":
//                 toast.info("Order already delivered");
//                 return;
//             case "Cancelled":
//                 toast.info("Order is cancelled");
//                 return;
//             default:
//                 newStatus = "Processing";
//         }

//         if (!window.confirm(`Change order status from ${currentStatus} to ${newStatus}?`)) {
//             return;
//         }

//         setUpdatingStatus(true);
//         try {
//             const response = await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
//             if (response.data.success || response.data.updatedOrder) {
//                 toast.success(`Order status updated to ${newStatus}!`);
//                 fetchOrders();
//                 fetchStats();
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to update status");
//         } finally {
//             setUpdatingStatus(false);
//         }
//     };

//     // Coupon Handlers
//     const handleToggleCouponStatus = async (couponId, currentStatus) => {
//         const result = await dispatch(toggleCouponStatus({ id: couponId, isActive: !currentStatus }));
//         if (result.payload?.success) {
//             toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}!`);
//         } else {
//             toast.error(result.payload || "Failed to update coupon status");
//         }
//     };

//     const handleDeleteCoupon = async (couponId) => {
//         if (window.confirm("Delete this coupon permanently?")) {
//             const result = await dispatch(deleteCoupon(couponId));
//             if (result.payload?.success) {
//                 toast.success("Coupon deleted!");
//             } else {
//                 toast.error(result.payload || "Failed to delete coupon");
//             }
//         }
//     };

//     const handleCouponCreated = () => {
//         dispatch(fetchAllCoupons());
//     };

//     const getStatusBadge = (status, isCancelled) => {
//         if (isCancelled) {
//             return { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Cancelled' };
//         }
//         switch(status) {
//             case 'Delivered':
//                 return { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Delivered' };
//             case 'Shipped':
//                 return { color: 'bg-blue-100 text-blue-800', icon: FaTruck, text: 'Shipped' };
//             case 'Processing':
//                 return { color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner, text: 'Processing' };
//             default:
//                 return { color: 'bg-gray-100 text-gray-800', icon: FaBox, text: status || 'Placed' };
//         }
//     };

//     const handleLocalImageSelect = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//                 setFormData({ ...formData, image: reader.result });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmitProduct = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('name', formData.name);
//             formDataToSend.append('category', formData.category);
//             formDataToSend.append('price', formData.price);
//             formDataToSend.append('description', formData.description);
//             formDataToSend.append('stock', formData.stock);
            
//             if (selectedImage) {
//                 formDataToSend.append('image', selectedImage);
//             } else if (formData.image && formData.image.startsWith('http')) {
//                 formDataToSend.append('imageUrl', formData.image);
//             }
            
//             if (editingProduct) {
//                 await API.put(`/products/${editingProduct._id}`, formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//                 toast.success("Product updated successfully!");
//             } else {
//                 await API.post('/products/add', formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//                 toast.success("Product added successfully!");
//             }
            
//             setShowAddModal(false);
//             setEditingProduct(null);
//             setFormData({ name: "", category: "", price: "", description: "", stock: "", image: "" });
//             setImagePreview("");
//             setSelectedImage(null);
//             fetchProducts();
//             fetchStats();
//         } catch (err) {
//             console.error("Error:", err.response?.data);
//             toast.error(err.response?.data?.message || "Failed to save product");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditProduct = (product) => {
//         setEditingProduct(product);
//         setFormData({
//             name: product.name,
//             category: product.category,
//             price: product.price,
//             description: product.description,
//             stock: product.stock,
//             image: product.image
//         });
//         setImagePreview(product.image);
//         setShowAddModal(true);
//     };

//     const handleDeleteProduct = async (id) => {
//         if (window.confirm("Delete this product?")) {
//             try {
//                 await API.delete(`/products/${id}`);
//                 toast.success("Deleted!");
//                 fetchProducts();
//                 fetchStats();
//             } catch (err) {
//                 toast.error("Failed to delete");
//             }
//         }
//     };

//     if (loading && activeTab === "products") {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading Admin Dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//                     <button
//                         onClick={() => navigate('/admin/content')}
//                         className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
//                     >
//                         <FaEdit /> Manage Content
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-90">Total Revenue</p>
//                                 <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
//                             </div>
//                             <FaChartLine className="text-3xl opacity-80" />
//                         </div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white cursor-pointer hover:opacity-90 transition" onClick={() => setActiveTab("orders")}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-90">Total Orders</p>
//                                 <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
//                             </div>
//                             <FaBox className="text-3xl opacity-80" />
//                         </div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white cursor-pointer hover:opacity-90 transition" onClick={() => setActiveTab("orders")}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-90">Pending Orders</p>
//                                 <p className="text-2xl font-bold">{stats.pendingOrders || 0}</p>
//                             </div>
//                             <FaSpinner className="text-3xl opacity-80" />
//                         </div>
//                     </div>
                    
//                     <div className={`rounded-lg shadow p-6 text-white cursor-pointer hover:opacity-90 transition ${stats.lowStockProducts > 0 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`} onClick={() => setActiveTab("products")}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm opacity-90">Low Stock Products</p>
//                                 <p className="text-2xl font-bold">{stats.lowStockProducts || 0}</p>
//                             </div>
//                             <FaTag className="text-3xl opacity-80" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab Buttons */}
//                 <div className="flex gap-2 mb-6 border-b flex-wrap">
//                     <button 
//                         onClick={() => setActiveTab("products")} 
//                         className={`px-6 py-3 font-medium transition ${activeTab === "products" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"}`}
//                     >
//                         Products ({stats.totalProducts})
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab("users")} 
//                         className={`px-6 py-3 font-medium transition ${activeTab === "users" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"}`}
//                     >
//                         Users ({stats.totalUsers})
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab("orders")} 
//                         className={`px-6 py-3 font-medium transition ${activeTab === "orders" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"}`}
//                     >
//                         Orders ({stats.totalOrders})
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab("coupons")} 
//                         className={`px-6 py-3 font-medium transition ${activeTab === "coupons" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500"}`}
//                     >
//                         Coupons ({coupons.length})
//                     </button>
//                     {activeTab === "products" && (
//                         <button 
//                             onClick={() => { setEditingProduct(null); setFormData({ name: "", category: "", price: "", description: "", stock: "", image: "" }); setImagePreview(""); setShowAddModal(true); }} 
//                             className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
//                         >
//                             <FaPlus /> Add Product
//                         </button>
//                     )}
//                     {activeTab === "coupons" && (
//                         <button 
//                             onClick={() => setShowCouponModal(true)} 
//                             className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
//                         >
//                             <FaPlus /> Create Coupon
//                         </button>
//                     )}
//                 </div>

//                 {/* Products Tab */}
//                 {activeTab === "products" && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left">Image</th>
//                                         <th className="px-6 py-3 text-left">Name</th>
//                                         <th className="px-6 py-3 text-left">Category</th>
//                                         <th className="px-6 py-3 text-left">Price</th>
//                                         <th className="px-6 py-3 text-left">Stock</th>
//                                         <th className="px-6 py-3 text-left">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {products.map((product) => (
//                                         <tr key={product._id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4">
//                                                 <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
//                                             </td>
//                                             <td className="px-6 py-4 font-medium">{product.name}</td>
//                                             <td className="px-6 py-4">{product.category}</td>
//                                             <td className="px-6 py-4">₹{product.price}</td>
//                                             <td className={`px-6 py-4 font-medium ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
//                                                 {product.stock || 15}
//                                                 {product.stock < 5 && product.stock > 0 && <span className="ml-2 text-xs text-orange-500">(Low Stock!)</span>}
//                                                 {product.stock === 0 && <span className="ml-2 text-xs text-red-500">(Out of Stock)</span>}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex gap-3">
//                                                     <button onClick={() => handleEditProduct(product)} className="text-green-600 hover:text-green-800">
//                                                         <FaEdit />
//                                                     </button>
//                                                     <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800">
//                                                         <FaTrash />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {/* Users Tab */}
//                 {activeTab === "users" && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left">Name</th>
//                                         <th className="px-6 py-3 text-left">Email</th>
//                                         <th className="px-6 py-3 text-left">Role</th>
//                                         <th className="px-6 py-3 text-left">Joined</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.map((user) => (
//                                         <tr key={user._id} className="border-t">
//                                             <td className="px-6 py-4">{user.name}</td>
//                                             <td className="px-6 py-4">{user.email}</td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//                                                     {user.role || 'user'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {/* Orders Tab */}
//                 {activeTab === "orders" && (
//                     <div className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left">Order ID</th>
//                                         <th className="px-6 py-3 text-left">Customer</th>
//                                         <th className="px-6 py-3 text-left">Items</th>
//                                         <th className="px-6 py-3 text-left">Total</th>
//                                         <th className="px-6 py-3 text-left">Status</th>
//                                         <th className="px-6 py-3 text-left">Payment</th>
//                                         <th className="px-6 py-3 text-left">Date</th>
//                                         <th className="px-6 py-3 text-left">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {orders.map((order) => {
//                                         const statusInfo = getStatusBadge(order.status, order.isCancelled);
//                                         const StatusIcon = statusInfo.icon;
                                        
//                                         return (
//                                             <tr key={order._id} className="border-t hover:bg-gray-50">
//                                                 <td className="px-6 py-4 font-mono text-sm">{order._id?.slice(-8)}</td>
//                                                 <td className="px-6 py-4">
//                                                     <div>
//                                                         <p className="font-medium">{order.user?.name || 'N/A'}</p>
//                                                         <p className="text-xs text-gray-500">{order.user?.email}</p>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="space-y-1">
//                                                         {order.orderItems?.slice(0, 2).map((item, idx) => (
//                                                             <p key={idx} className="text-sm">
//                                                                 {item.name} x{item.qty || item.quantity}
//                                                             </p>
//                                                         ))}
//                                                         {order.orderItems?.length > 2 && (
//                                                             <p className="text-xs text-gray-500">+{order.orderItems.length - 2} more</p>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 font-bold">₹{order.totalPrice}</td>
//                                                 <td className="px-6 py-4">
//                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
//                                                         <StatusIcon size={12} />
//                                                         {statusInfo.text}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <span className={`px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                                                         {order.isPaid ? 'Paid' : 'Pending'}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex gap-2">
//                                                         {!order.isCancelled && order.status !== 'Delivered' && (
//                                                             <button
//                                                                 onClick={() => handleUpdateOrderStatus(order._id, order.status)}
//                                                                 disabled={updatingStatus}
//                                                                 className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
//                                                             >
//                                                                 <FaSyncAlt size={12} /> Update
//                                                             </button>
//                                                         )}
//                                                         <button
//                                                             onClick={() => navigate(`/order/${order._id}`)}
//                                                             className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
//                                                         >
//                                                             <FaEye size={12} /> View
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//                 {/* Coupons Tab */}
//                 {activeTab === "coupons" && (
//                     <div>
//                         {couponLoading && activeTab === "coupons" ? (
//                             <div className="text-center py-12">
//                                 <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
//                                 <p className="text-gray-600">Loading coupons...</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {coupons.map((coupon) => (
//                                     <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
//                                         {/* Coupon Header */}
//                                         <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 text-white">
//                                             <div className="flex justify-between items-start">
//                                                 <div>
//                                                     <p className="text-xs opacity-80">COUPON CODE</p>
//                                                     <p className="text-2xl font-bold tracking-wider">{coupon.code}</p>
//                                                 </div>
//                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
//                                                     {coupon.isActive ? 'Active' : 'Inactive'}
//                                                 </span>
//                                             </div>
//                                         </div>
                                        
//                                         {/* Coupon Body */}
//                                         <div className="p-4">
//                                             <p className="text-gray-600 text-sm mb-3">{coupon.description || "Special discount for you!"}</p>
                                            
//                                             <div className="space-y-2">
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-gray-500 text-sm">Discount:</span>
//                                                     <span className="font-bold text-red-600">
//                                                         {coupon.voucherType === 'discount' 
//                                                             ? `${coupon.discountPercent}% OFF` 
//                                                             : `₹${coupon.fixedAmount} OFF`}
//                                                     </span>
//                                                 </div>
                                                
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-gray-500 text-sm">Min. Order:</span>
//                                                     <span className="font-medium">₹{coupon.minOrderAmount || 0}</span>
//                                                 </div>
                                                
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-gray-500 text-sm">Used:</span>
//                                                     <span className="font-medium">{coupon.usedCount || 0} / {coupon.maxUsage || 1}</span>
//                                                 </div>
                                                
//                                                 {coupon.isFirstOrderOnly && (
//                                                     <div className="mt-2">
//                                                         <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🎯 First Order Only</span>
//                                                     </div>
//                                                 )}
                                                
//                                                 {coupon.expiresAt && (
//                                                     <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
//                                                         <span>Expires:</span>
//                                                         <span>{new Date(coupon.expiresAt).toLocaleDateString()}</span>
//                                                     </div>
//                                                 )}
//                                             </div>
                                            
//                                             {/* Action Buttons */}
//                                             <div className="flex gap-2 mt-4 pt-3 border-t">
//                                                 <button
//                                                     onClick={() => handleToggleCouponStatus(coupon._id, coupon.isActive)}
//                                                     className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
//                                                         coupon.isActive 
//                                                             ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
//                                                             : 'bg-green-100 text-green-700 hover:bg-green-200'
//                                                     }`}
//                                                 >
//                                                     {coupon.isActive ? 'Deactivate' : 'Activate'}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteCoupon(coupon._id)}
//                                                     className="flex-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
                        
//                         {/* No Coupons Message */}
//                         {coupons.length === 0 && !couponLoading && (
//                             <div className="text-center py-12 bg-white rounded-lg shadow">
//                                 <FaTag className="text-6xl text-gray-300 mx-auto mb-4" />
//                                 <p className="text-gray-500">No coupons created yet</p>
//                                 <button
//                                     onClick={() => setShowCouponModal(true)}
//                                     className="mt-4 text-red-600 hover:underline"
//                                 >
//                                     Create your first coupon
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Add/Edit Product Modal */}
//             {showAddModal && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
//                     <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
//                         <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
//                         <form onSubmit={handleSubmitProduct} className="space-y-4">
//                             <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
//                             <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg" required>
//                                 <option value="">Select Category</option>
//                                 {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                             </select>
//                             <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg" required />
//                             <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg" rows="3" required />
//                             <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-2 border rounded-lg" required />
                            
//                             <div className="flex gap-3 pt-2">
//                                 <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
//                                     {editingProduct ? "Update" : "Save"}
//                                 </button>
//                                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Coupon Create Modal */}
//             <CouponCreateModal
//                 isOpen={showCouponModal}
//                 onClose={() => setShowCouponModal(false)}
//                 onCouponCreated={handleCouponCreated}
//             />
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
    FaEdit, FaTrash, FaPlus, FaEye, FaBox, FaTag, FaImage, 
    FaSyncAlt, FaCheckCircle, FaTruck, FaSpinner, FaTimesCircle, 
    FaChartLine, FaUsers, FaPercent, FaCalendarAlt, FaHeart,
    FaBars, FaTimes, FaSignOutAlt, FaUserCircle, FaShoppingCart, FaRupeeSign
} from "react-icons/fa";
import { 
    fetchAllCoupons, 
    toggleCouponStatus, 
    deleteCoupon,
    selectAllCoupons,
    selectCouponLoading
} from "../redux/slices/couponSlice";
import API from "../utils/Api";
// import CouponCreateModal from "../components/CouponCreateModal";
import logo from "../assets/LogoShoping.png"; 
import CouponCreateModal from "../pages/CouponCreateModal";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Redux Selectors
    const coupons = useSelector(selectAllCoupons);
    const couponLoading = useSelector(selectCouponLoading);
    
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // Stats State - Default values
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        todayOrders: 0,
        thisMonthRevenue: 0,
        revenueGrowth: 0
    });
    
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "",
        image: ""
    });

    const categoriesList = [
        "Copper Utensils",
        "Steel Bottles",
        "Thermoware & Lunchboxes",
        "Cookware Sets",
        "Home Appliances",
        "Cookers (Aluminum, Steel, Triply)"
    ];

    // Get admin user info
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    // Fetch all data
    useEffect(() => {
        checkAdminAccess();
        fetchAllData();
    }, []);

    const checkAdminAccess = () => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }
        if (adminUser.role !== 'admin' && adminUser.role !== 'super_admin') {
            toast.error("Admin access required!");
            navigate('/login');
            return;
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchProducts(),
                fetchUsers(),
                fetchOrders(),
                fetchCouponsStats()
            ]);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await API.get('/products/all');
            let productsData = [];
            if (Array.isArray(response.data)) {
                productsData = response.data;
            } else if (response.data?.products) {
                productsData = response.data.products;
            }
            setProducts(productsData);
            
            // Update stats with product data
            setStats(prev => ({
                ...prev,
                totalProducts: productsData.length,
                lowStockProducts: productsData.filter(p => p.stock > 0 && p.stock < 10).length,
                outOfStockProducts: productsData.filter(p => p.stock === 0).length
            }));
            
            return productsData;
        } catch (err) {
            toast.error("Failed to fetch products");
            return [];
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await API.get('/admin/users');
            const usersData = response.data.users || response.data || [];
            setUsers(usersData);
            setStats(prev => ({ ...prev, totalUsers: usersData.length }));
            return usersData;
        } catch (err) {
            console.error("Failed to fetch users");
            return [];
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await API.get('/orders/admin/all');
            const ordersData = response.data.orders || response.data || [];
            setOrders(ordersData);
            
            // Calculate order stats
            const pendingOrders = ordersData.filter(o => o.status === 'Processing' && !o.isCancelled).length;
            const deliveredOrders = ordersData.filter(o => o.status === 'Delivered').length;
            const cancelledOrders = ordersData.filter(o => o.isCancelled === true).length;
            const totalRevenue = ordersData.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            
            // Today's orders
            const today = new Date().toDateString();
            const todayOrders = ordersData.filter(o => new Date(o.createdAt).toDateString() === today).length;
            
            setStats(prev => ({
                ...prev,
                totalOrders: ordersData.length,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                todayOrders
            }));
            
            return ordersData;
        } catch (err) {
            console.error("Failed to fetch orders");
            return [];
        }
    };

    const fetchCouponsStats = async () => {
        try {
            await dispatch(fetchAllCoupons());
        } catch (err) {
            console.error("Failed to fetch coupons");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const handleUpdateOrderStatus = async (orderId, currentStatus) => {
        let newStatus = "";
        switch(currentStatus) {
            case "Processing":
                newStatus = "Shipped";
                break;
            case "Shipped":
                newStatus = "Delivered";
                break;
            case "Delivered":
                toast.info("Order already delivered");
                return;
            case "Cancelled":
                toast.info("Order is cancelled");
                return;
            default:
                newStatus = "Processing";
        }

        if (!window.confirm(`Change order status from ${currentStatus} to ${newStatus}?`)) {
            return;
        }

        setUpdatingStatus(true);
        try {
            const response = await API.put(`/orders/admin/${orderId}/status`, { status: newStatus });
            if (response.data.success || response.data.updatedOrder) {
                toast.success(`Order status updated to ${newStatus}!`);
                fetchOrders();
                fetchProducts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Coupon Handlers
    const handleToggleCouponStatus = async (couponId, currentStatus) => {
        const result = await dispatch(toggleCouponStatus({ id: couponId, isActive: !currentStatus }));
        if (result.payload?.success) {
            toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}!`);
        } else {
            toast.error(result.payload || "Failed to update coupon status");
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (window.confirm("Delete this coupon permanently?")) {
            const result = await dispatch(deleteCoupon(couponId));
            if (result.payload?.success) {
                toast.success("Coupon deleted!");
            } else {
                toast.error(result.payload || "Failed to delete coupon");
            }
        }
    };

    const handleCouponCreated = () => {
        dispatch(fetchAllCoupons());
    };

    const getStatusBadge = (status, isCancelled) => {
        if (isCancelled) {
            return { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, text: 'Cancelled' };
        }
        switch(status) {
            case 'Delivered':
                return { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Delivered' };
            case 'Shipped':
                return { color: 'bg-blue-100 text-blue-800', icon: FaTruck, text: 'Shipped' };
            case 'Processing':
                return { color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner, text: 'Processing' };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: FaBox, text: status || 'Placed' };
        }
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('stock', formData.stock);
            
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            } else if (formData.image && formData.image.startsWith('http')) {
                formDataToSend.append('imageUrl', formData.image);
            }
            
            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Product updated successfully!");
            } else {
                await API.post('/products/add', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Product added successfully!");
            }
            
            setShowAddModal(false);
            setEditingProduct(null);
            setFormData({ name: "", category: "", price: "", description: "", stock: "", image: "" });
            setImagePreview("");
            setSelectedImage(null);
            fetchProducts();
        } catch (err) {
            console.error("Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            stock: product.stock,
            image: product.image
        });
        setImagePreview(product.image);
        setShowAddModal(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            try {
                await API.delete(`/products/${id}`);
                toast.success("Deleted!");
                fetchProducts();
            } catch (err) {
                toast.error("Failed to delete");
            }
        }
    };

    const handleLocalImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Sidebar menu items
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: FaChartLine, path: "/admin" },
        { id: "products", label: "Products", icon: FaBox, path: "/admin/products" },
        { id: "orders", label: "Orders", icon: FaShoppingCart, path: "/admin/orders" },
        { id: "users", label: "Users", icon: FaUsers, path: "/admin/users" },
        { id: "coupons", label: "Coupons", icon: FaTag, path: "/admin/coupons" },
        { id: "content", label: "Content", icon: FaEdit, path: "/admin/content" },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#8B1E2D] rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            );
        }

        switch(activeTab) {
            case "dashboard":
                return (
                    <div>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm opacity-90">Total Revenue</p>
                                        <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <FaRupeeSign className="text-3xl opacity-80" />
                                </div>
                                <div className="mt-3 text-sm">
                                    {stats.todayOrders > 0 && <span className="text-green-200">{stats.todayOrders} orders today</span>}
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition" onClick={() => setActiveTab("orders")}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm opacity-90">Total Orders</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                                    </div>
                                    <FaShoppingCart className="text-3xl opacity-80" />
                                </div>
                                <p className="text-sm opacity-80 mt-2">{stats.pendingOrders} pending</p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition" onClick={() => setActiveTab("users")}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm opacity-90">Total Users</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                                    </div>
                                    <FaUsers className="text-3xl opacity-80" />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-5 text-white cursor-pointer hover:opacity-90 transition" onClick={() => setActiveTab("products")}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm opacity-90">Total Products</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                                    </div>
                                    <FaBox className="text-3xl opacity-80" />
                                </div>
                                {stats.lowStockProducts > 0 && (
                                    <p className="text-sm text-yellow-200 mt-1">{stats.lowStockProducts} low stock</p>
                                )}
                            </div>
                        </div>

                        {/* Second Row Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
                                <p className="text-gray-500 text-sm">Pending Orders</p>
                                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                                <p className="text-gray-500 text-sm">Delivered</p>
                                <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
                                <p className="text-gray-500 text-sm">Cancelled</p>
                                <p className="text-2xl font-bold">{stats.cancelledOrders}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
                                <p className="text-gray-500 text-sm">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                                <button onClick={() => setActiveTab("orders")} className="text-[#8B1E2D] text-sm hover:underline">View All</button>
                            </div>
                            <div className="space-y-3">
                                {orders.slice(0, 5).map((order) => {
                                    const statusInfo = getStatusBadge(order.status, order.isCancelled);
                                    const StatusIcon = statusInfo.icon;
                                    return (
                                        <div key={order._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/order/${order._id}`)}>
                                            <div>
                                                <p className="font-mono text-sm font-medium">#{order._id?.slice(-8)}</p>
                                                <p className="text-sm text-gray-500">₹{order.totalPrice}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                                    <StatusIcon size={12} /> {statusInfo.text}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {orders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet</p>}
                            </div>
                        </div>
                    </div>
                );
            
            case "products":
                return (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
                            <h2 className="text-lg font-bold text-gray-800">Products ({products.length})</h2>
                            <button onClick={() => { setEditingProduct(null); setFormData({ name: "", category: "", price: "", description: "", stock: "", image: "" }); setImagePreview(""); setShowAddModal(true); }} className="bg-[#8B1E2D] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6B1622]">
                                <FaPlus /> Add Product
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm">Image</th>
                                        <th className="px-4 py-3 text-left text-sm">Name</th>
                                        <th className="px-4 py-3 text-left text-sm">Category</th>
                                        <th className="px-4 py-3 text-left text-sm">Price</th>
                                        <th className="px-4 py-3 text-left text-sm">Stock</th>
                                        <th className="px-4 py-3 text-left text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" /></td>
                                            <td className="px-4 py-3 font-medium">{product.name}</td>
                                            <td className="px-4 py-3">{product.category}</td>
                                            <td className="px-4 py-3">₹{product.price}</td>
                                            <td className={`px-4 py-3 ${product.stock < 5 ? 'text-red-600 font-medium' : 'text-green-600'}`}>{product.stock || 15}</td>
                                            <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEditProduct(product)} className="text-green-600 hover:text-green-800"><FaEdit /></button><button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case "orders":
                return (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b"><h2 className="text-lg font-bold text-gray-800">Orders ({orders.length})</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr><th className="px-4 py-3 text-left">Order ID</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Items</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Payment</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const statusInfo = getStatusBadge(order.status, order.isCancelled);
                                        const StatusIcon = statusInfo.icon;
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-mono text-sm">{order._id?.slice(-8)}</td>
                                                <td className="px-4 py-3"><p className="font-medium">{order.user?.name || 'N/A'}</p><p className="text-xs text-gray-500">{order.user?.email}</p></td>
                                                <td className="px-4 py-3">{order.orderItems?.length} items</td>
                                                <td className="px-4 py-3 font-bold">₹{order.totalPrice}</td>
                                                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}><StatusIcon size={12} /> {statusInfo.text}</span></td>
                                                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                                                <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="px-4 py-3"><div className="flex gap-2">{!order.isCancelled && order.status !== 'Delivered' && (<button onClick={() => handleUpdateOrderStatus(order._id, order.status)} disabled={updatingStatus} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"><FaSyncAlt size={12} /> Update</button>)}<button onClick={() => navigate(`/order/${order._id}`)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"><FaEye size={12} /> View</button></div></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case "users":
                return (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b"><h2 className="text-lg font-bold text-gray-800">Users ({users.length})</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Joined</th></tr></thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50"><td className="px-4 py-3">{user.name}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{user.role || 'user'}</span></td><td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case "coupons":
                return (
                    <div>
                        <div className="flex justify-end mb-4"><button onClick={() => setShowCouponModal(true)} className="bg-[#8B1E2D] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6B1622]"><FaPlus /> Create Coupon</button></div>
                        {couponLoading ? (<div className="text-center py-12"><div className="w-12 h-12 border-4 border-gray-300 border-t-[#8B1E2D] rounded-full animate-spin mx-auto mb-4"></div><p>Loading coupons...</p></div>) : coupons.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow"><FaTag className="text-6xl text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No coupons created yet</p><button onClick={() => setShowCouponModal(true)} className="mt-4 text-[#8B1E2D] hover:underline">Create your first coupon</button></div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{coupons.map((coupon) => (<div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition"><div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] p-4 text-white"><div className="flex justify-between items-start"><div><p className="text-xs opacity-80">COUPON CODE</p><p className="text-xl font-bold tracking-wider">{coupon.code}</p></div><span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></div></div><div className="p-4"><p className="text-gray-600 text-sm mb-3">{coupon.description || "Special discount!"}</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Discount:</span><span className="font-bold text-[#8B1E2D]">{coupon.voucherType === 'discount' ? `${coupon.discountPercent}% OFF` : `₹${coupon.fixedAmount} OFF`}</span></div><div className="flex justify-between"><span className="text-gray-500">Min. Order:</span><span>₹{coupon.minOrderAmount || 0}</span></div><div className="flex justify-between"><span className="text-gray-500">Used:</span><span>{coupon.usedCount || 0} / {coupon.maxUsage || 1}</span></div></div><div className="flex gap-2 mt-4 pt-3 border-t"><button onClick={() => handleToggleCouponStatus(coupon._id, coupon.isActive)} className={`flex-1 py-1.5 rounded-lg text-sm ${coupon.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{coupon.isActive ? 'Deactivate' : 'Activate'}</button><button onClick={() => handleDeleteCoupon(coupon._id)} className="flex-1 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">Delete</button></div></div></div>))}</div>)}
                    </div>
                );
            
            default:
                return <div>Select a menu option</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#8B1E2D] text-white rounded-lg shadow-lg">
                    {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:block`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 border-b flex items-center justify-center">
                        <img src={logo} alt="Logo" className="h-12 object-contain" />
                    </div>
                    
                    {/* Admin Info */}
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center gap-3">
                            <FaUserCircle className="text-3xl text-[#8B1E2D]" />
                            <div>
                                <p className="font-semibold text-gray-800">{adminUser.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500">{adminUser.role || 'Administrator'}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-[#8B1E2D] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <item.icon size={18} />
                                <span className="font-medium">{item.label}</span>
                                {item.id === 'orders' && stats.pendingOrders > 0 && activeTab !== item.id && (
                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                    
                    {/* Logout Button */}
                    <div className="p-4 border-t">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                            <FaSignOutAlt size={18} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                        <div className="flex items-center gap-3">
                            {/* Quick Stats */}
                            <div className="hidden sm:flex items-center gap-4 text-sm">
                                <span className="text-gray-500">Orders: <span className="font-semibold text-gray-800">{stats.totalOrders}</span></span>
                                <span className="text-gray-500">Revenue: <span className="font-semibold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span></span>
                            </div>
                            {/* Profile Dropdown (Mobile) */}
                            <div className="lg:hidden">
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center gap-2">
                                    <FaUserCircle className="text-2xl text-[#8B1E2D]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-4 sm:p-6">
                    {renderContent()}
                </main>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                            <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg" required>
                                <option value="">Select Category</option>
                                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg" required />
                            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg" rows="3" required />
                            <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-2 border rounded-lg" required />
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {imagePreview ? (
                                    <div className="relative"><img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" /><button type="button" onClick={() => { setImagePreview(""); setFormData({...formData, image: ""}); setSelectedImage(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FaTimesCircle /></button></div>
                                ) : (<><FaImage className="text-4xl text-gray-400 mx-auto mb-2" /><input type="file" accept="image/*" onChange={handleLocalImageSelect} className="hidden" id="imageUpload" /><label htmlFor="imageUpload" className="inline-block px-4 py-2 bg-gray-200 rounded-lg cursor-pointer text-sm">Choose Image</label></>)}
                            </div>
                            <input type="text" placeholder="Or enter image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded-lg" />
                            
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-[#8B1E2D] text-white py-2 rounded-lg hover:bg-[#6B1622]">{editingProduct ? "Update" : "Save"}</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Coupon Create Modal */}
            <CouponCreateModal isOpen={showCouponModal} onClose={() => setShowCouponModal(false)} onCouponCreated={handleCouponCreated} />
        </div>
    );
};

export default AdminDashboard;