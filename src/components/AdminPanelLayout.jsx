// // import React, { useState, useEffect } from "react";
// // import { NavLink, Outlet } from "react-router-dom";
// // import { 
// //     FaChartLine, FaBox, FaShoppingCart, FaUsers, FaTag, 
// //     FaEdit, FaSignOutAlt, FaUserCircle, FaBars, FaTimes,
// //     FaRupeeSign, FaBell, FaCog
// // } from "react-icons/fa";
// // import { toast } from "react-toastify";
// // import API from "../utils/api";
// // import logo from "../assets/LogoShoping.png";

// // const AdminPanelLayout = () => {
// //     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //     const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
// //     const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

// //     useEffect(() => {
// //         fetchStats();
// //     }, []);

// //     const fetchStats = async () => {
// //         try {
// //             const ordersRes = await API.get('/orders/admin/all');
// //             const orders = ordersRes.data.orders || ordersRes.data || [];
// //             setStats({
// //                 totalOrders: orders.length,
// //                 totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
// //             });
// //         } catch (err) { console.error("Failed to fetch stats:", err); }
// //     };

// //     const handleLogout = () => {
// //         localStorage.removeItem('adminToken');
// //         localStorage.removeItem('adminUser');
// //         toast.success("Logged out successfully");
// //         window.location.href = '/login';
// //     };

// //     const menuItems = [
// //         { id: "dashboard", label: "Dashboard", icon: FaChartLine, path: "/admin" },
// //         { id: "products", label: "Products", icon: FaBox, path: "/admin/products" },
// //         { id: "orders", label: "Orders", icon: FaShoppingCart, path: "/admin/orders" },
// //         { id: "users", label: "Users", icon: FaUsers, path: "/admin/users" },
// //         { id: "coupons", label: "Coupons", icon: FaTag, path: "/admin/coupons" },
// //         { id: "content", label: "Content", icon: FaEdit, path: "/admin/content" },
// //     ];

// //     return (
// //         <div className="min-h-screen bg-gray-100">
// //             {/* Mobile Menu Button */}
// //             <div className="lg:hidden fixed top-4 left-4 z-50">
// //                 <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#8B1E2D] text-white rounded-lg shadow-lg">
// //                     {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
// //                 </button>
// //             </div>

// //             {/* Sidebar Overlay (Mobile) */}
// //             {mobileMenuOpen && (
// //                 <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
// //             )}

// //             {/* Sidebar - Dark Red Background */}
// //             <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#8B1E2D] shadow-xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
// //                 {/* Logo - Size Badha Diya (h-16, p-6) */}
// //                 <div className="p-6 border-b border-white/20 flex items-center justify-center sticky top-0 bg-[#8B1E2D] z-10">
// //                     <img 
// //                         src={logo} 
// //                         alt="Logo" 
// //                         className="h-16 w-auto object-contain"
// //                         style={{ filter: 'brightness(0) invert(1)' }}
// //                     />
// //                 </div>

// //                 {/* Navigation - White Text */}
// //                 <nav className="p-4 space-y-1">
// //                     {menuItems.map((item) => (
// //                         <NavLink
// //                             key={item.id}
// //                             to={item.path}
// //                             onClick={() => setMobileMenuOpen(false)}
// //                             className={({ isActive }) => `
// //                                 flex items-center gap-3 px-4 py-3 rounded-lg transition-all
// //                                 ${isActive ? 'bg-white/20 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}
// //                             `}
// //                         >
// //                             <item.icon size={18} />
// //                             <span className="font-medium">{item.label}</span>
// //                         </NavLink>
// //                     ))}
// //                 </nav>

// //                 {/* Logout Button - White Text */}
// //                 <div className="p-4 border-t border-white/20 sticky bottom-0 bg-[#8B1E2D]">
// //                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all">
// //                         <FaSignOutAlt size={18} />
// //                         <span className="font-medium">Logout</span>
// //                     </button>
// //                 </div>
// //             </aside>

// //             {/* Main Content - Right Side */}
// //             <div className="lg:ml-64 min-h-screen">
// //                 {/* Header - Kam Height */}
// //                 <header className="bg-[#8B1E2D] shadow-md sticky top-0 z-30">
// //                     <div className="px-6 py-2 sm:py-3">
// //                         <div className="flex justify-between items-center flex-wrap gap-2">
// //                             {/* Welcome Text */}
// //                             <div>
// //                                 <h1 className="text-lg sm:text-xl font-bold text-white">
// //                                     Welcome back, {adminUser.name?.split(' ')[0] || 'Admin'}!
// //                                 </h1>
// //                             </div>

// //                             {/* User Info - Right Side */}
// //                             <div className="flex items-center gap-2 sm:gap-3">
// //                                 {/* Notification Icon */}
// //                                 <button className="relative p-1.5 hover:bg-white/10 rounded-full transition">
// //                                     <FaBell className="text-white text-base sm:text-lg" />
// //                                     <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
// //                                 </button>
                                
// //                                 {/* Settings Icon */}
// //                                 <button className="p-1.5 hover:bg-white/10 rounded-full transition">
// //                                     <FaCog className="text-white text-base sm:text-lg" />
// //                                 </button>

// //                                 {/* User Profile */}
// //                                 <div className="flex items-center gap-2 ml-1 pl-2 border-l border-white/20">
// //                                     <FaUserCircle className="text-2xl sm:text-3xl text-white" />
// //                                     <div className="hidden sm:block">
// //                                         <p className="font-semibold text-white text-xs sm:text-sm">{adminUser.name || 'Admin'}</p>
// //                                         <p className="text-xs text-red-200 capitalize">{adminUser.role || 'Administrator'}</p>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Stats Cards - Smaller */}
// //                         <div className="flex gap-3 mt-2 pt-1">
// //                             <div className="bg-white/10 rounded-lg px-3 py-1.5">
// //                                 <p className="text-xs text-red-200">Revenue</p>
// //                                 <p className="text-sm sm:text-base font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
// //                             </div>
// //                             <div className="bg-white/10 rounded-lg px-3 py-1.5">
// //                                 <p className="text-xs text-red-200">Orders</p>
// //                                 <p className="text-sm sm:text-base font-bold text-white">{stats.totalOrders}</p>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </header>

// //                 {/* Main Content */}
// //                 <main className="p-4 sm:p-6">
// //                     <Outlet />
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AdminPanelLayout;


// import React, { useState, useEffect } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { 
//     FaChartLine, FaBox, FaShoppingCart, FaUsers, FaTag, 
//     FaEdit, FaSignOutAlt, FaUserCircle, FaBars, FaTimes,
//     FaRupeeSign, FaBell, FaCog
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import API from "../utils/api";
// import logo from "../assets/LogoShoping.png";

// const AdminPanelLayout = () => {
//     const navigate = useNavigate();
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
    
//     // ✅ Fix: Use consistent localStorage keys
//     const [adminUser, setAdminUser] = useState(null);
//  // AdminPanelLayout.jsx - useEffect mein dependency array check karo
// useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
    
//     if (!token || (user.role !== 'admin' && user.role !== 'super_admin')) {
//         navigate('/login');
//         return;
//     }
    
//     setAdminUser(user);
//     fetchStats();
// }, [navigate]); // ✅ sirf navigate dependency, kuch aur nahi
    
//     // ✅ Fix: Add token check before API call
//     const fetchStats = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) return;
        
//         try {
//             const ordersRes = await API.get('/orders/admin/all');
//             const orders = ordersRes.data.orders || ordersRes.data || [];
//             setStats({
//                 totalOrders: orders.length,
//                 totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
//             });
//         } catch (err) { 
//             console.error("Failed to fetch stats:", err);
//             if (err.response?.status === 401) {
//                 navigate('/login');
//             }
//         }
//     };

//     // ✅ Fix: Consistent logout - clear all keys
//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('adminToken'); // Cleanup old key
//         localStorage.removeItem('adminUser');  // Cleanup old key
//         toast.success("Logged out successfully");
//         navigate('/login');
//     };

//     const menuItems = [
//         { id: "dashboard", label: "Dashboard", icon: FaChartLine, path: "/admin" },
//         { id: "products", label: "Products", icon: FaBox, path: "/admin/products" },
//         { id: "orders", label: "Orders", icon: FaShoppingCart, path: "/admin/orders" },
//         { id: "users", label: "Users", icon: FaUsers, path: "/admin/users" },
//         { id: "coupons", label: "Coupons", icon: FaTag, path: "/admin/coupons" },
//         { id: "content", label: "Content", icon: FaEdit, path: "/admin/content" },
//     ];

//     // Show loading while checking auth
//     if (!adminUser) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B1E2D] border-t-transparent"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden fixed top-4 left-4 z-50">
//                 <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#8B1E2D] text-white rounded-lg shadow-lg">
//                     {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//                 </button>
//             </div>

//             {/* Sidebar Overlay (Mobile) */}
//             {mobileMenuOpen && (
//                 <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
//             )}

//             {/* Sidebar - Dark Red Background */}
//             <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#8B1E2D] shadow-xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
//                 {/* Logo */}
//                 <div className="p-6 border-b border-white/20 flex items-center justify-center sticky top-0 bg-[#8B1E2D] z-10">
//                     <img 
//                         src={logo} 
//                         alt="Logo" 
//                         className="h-16 w-auto object-contain"
//                         style={{ filter: 'brightness(0) invert(1)' }}
//                     />
//                 </div>

//                 {/* Navigation - White Text */}
//                 <nav className="p-4 space-y-1">
//                     {menuItems.map((item) => (
//                         <NavLink
//                             key={item.id}
//                             to={item.path}
//                             onClick={() => setMobileMenuOpen(false)}
//                             className={({ isActive }) => `
//                                 flex items-center gap-3 px-4 py-3 rounded-lg transition-all
//                                 ${isActive ? 'bg-white/20 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}
//                             `}
//                         >
//                             <item.icon size={18} />
//                             <span className="font-medium">{item.label}</span>
//                         </NavLink>
//                     ))}
//                 </nav>

//                 {/* Logout Button */}
//                 <div className="p-4 border-t border-white/20 sticky bottom-0 bg-[#8B1E2D]">
//                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all">
//                         <FaSignOutAlt size={18} />
//                         <span className="font-medium">Logout</span>
//                     </button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <div className="lg:ml-64 min-h-screen">
//                 {/* Header */}
//                 <header className="bg-[#8B1E2D] shadow-md sticky top-0 z-30">
//                     <div className="px-6 py-2 sm:py-3">
//                         <div className="flex justify-between items-center flex-wrap gap-2">
//                             <div>
//                                 <h1 className="text-lg sm:text-xl font-bold text-white">
//                                     Welcome back, {adminUser.name?.split(' ')[0] || 'Admin'}!
//                                 </h1>
//                             </div>

//                             <div className="flex items-center gap-2 sm:gap-3">
//                                 <button className="relative p-1.5 hover:bg-white/10 rounded-full transition">
//                                     <FaBell className="text-white text-base sm:text-lg" />
//                                     <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
//                                 </button>
                                
//                                 <button className="p-1.5 hover:bg-white/10 rounded-full transition">
//                                     <FaCog className="text-white text-base sm:text-lg" />
//                                 </button>

//                                 <div className="flex items-center gap-2 ml-1 pl-2 border-l border-white/20">
//                                     <FaUserCircle className="text-2xl sm:text-3xl text-white" />
//                                     <div className="hidden sm:block">
//                                         <p className="font-semibold text-white text-xs sm:text-sm">{adminUser.name || 'Admin'}</p>
//                                         <p className="text-xs text-red-200 capitalize">{adminUser.role || 'Administrator'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Stats Cards */}
//                         <div className="flex gap-3 mt-2 pt-1">
//                             <div className="bg-white/10 rounded-lg px-3 py-1.5">
//                                 <p className="text-xs text-red-200">Revenue</p>
//                                 <p className="text-sm sm:text-base font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
//                             </div>
//                             <div className="bg-white/10 rounded-lg px-3 py-1.5">
//                                 <p className="text-xs text-red-200">Orders</p>
//                                 <p className="text-sm sm:text-base font-bold text-white">{stats.totalOrders}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <main className="p-4 sm:p-6">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default AdminPanelLayout;


// src/components/AdminPanelLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
    FaChartLine, FaBox, FaShoppingCart, FaUsers, FaTag, 
    FaEdit, FaSignOutAlt, FaUserCircle, FaBars, FaTimes,
    FaBell, FaCog, FaHome, FaClipboardList, FaStore
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../utils/Api";
import logo from "../assets/LogoShoping.png";

const AdminPanelLayout = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 });
    const [adminUser, setAdminUser] = useState(null);

   // AdminPanelLayout.jsx
useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || (user.role !== 'admin' && user.role !== 'super_admin')) {
            navigate('/login');
            return;
        }
        
        setAdminUser(user);
        
        // ✅ Sirf ek baar fetch karo, har render mein nahi
        if (isMounted) {
            await fetchStats();
            await fetchExtraStats();
        }
    };
    
    fetchData();
    
    return () => {
        isMounted = false;
    };
}, [navigate]); // ✅ Sirf navigate dependency - kuch aur nahi

    const fetchStats = async () => {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) return;
        
        try {
            const ordersRes = await API.get('/orders/admin/all');
            const orders = ordersRes.data.orders || ordersRes.data || [];
            setStats(prev => ({
                ...prev,
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
            }));
        } catch (err) { 
            console.error("Failed to fetch stats:", err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const fetchExtraStats = async () => {
        try {
            const [productsRes, usersRes] = await Promise.all([
                API.get('/products/all'),
                API.get('/admin/users')
            ]);
            const products = productsRes.data.products || productsRes.data || [];
            const users = usersRes.data.users || usersRes.data || [];
            setStats(prev => ({
                ...prev,
                totalProducts: products.length,
                totalUsers: users.length
            }));
        } catch (err) {
            console.error("Failed to fetch extra stats:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: FaChartLine, path: "/admin", color: "hover:bg-blue-500/20" },
        { id: "products", label: "Products", icon: FaBox, path: "/admin/products", color: "hover:bg-green-500/20" },
        { id: "orders", label: "Orders", icon: FaShoppingCart, path: "/admin/orders", color: "hover:bg-orange-500/20" },
        { id: "users", label: "Users", icon: FaUsers, path: "/admin/users", color: "hover:bg-purple-500/20" },
        { id: "coupons", label: "Coupons", icon: FaTag, path: "/admin/coupons", color: "hover:bg-yellow-500/20" },
        { id: "content", label: "Content", icon: FaEdit, path: "/admin/content", color: "hover:bg-indigo-500/20" },
    ];

    if (!adminUser) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8B1E2D] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="p-3 bg-[#8B1E2D] text-white rounded-xl shadow-lg hover:bg-[#6B1622] transition-all duration-300"
                >
                    {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-full w-72 bg-gradient-to-b from-[#8B1E2D] to-[#6B1622] shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
                {/* Logo Section */}
                <div className="p-6 border-b border-white/20 sticky top-0 bg-gradient-to-b from-[#8B1E2D] to-[#7a1a28] z-10">
                    <div className="flex items-center justify-center">
                        <img src={logo} alt="Logo" className="h-14 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <p className="text-center text-white/60 text-xs mt-2">Admin Dashboard</p>
                </div>

                {/* Stats Cards in Sidebar */}
                <div className="p-4 grid grid-cols-2 gap-2 border-b border-white/10">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-white/60 text-xs">Revenue</p>
                        <p className="text-white font-bold text-sm">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-white/60 text-xs">Orders</p>
                        <p className="text-white font-bold text-sm">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-white/60 text-xs">Products</p>
                        <p className="text-white font-bold text-sm">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-white/60 text-xs">Users</p>
                        <p className="text-white font-bold text-sm">{stats.totalUsers}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                                ${isActive 
                                    ? 'bg-white/20 text-white shadow-md' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={18} />
                            <span className="font-medium text-sm">{item.label}</span>
                            {item.id === 'orders' && stats.totalOrders > 0 && (
                                <span className="ml-auto bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {stats.totalOrders}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-gradient-to-t from-[#8B1E2D] to-transparent">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                        <FaSignOutAlt size={18} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-72 min-h-screen">
                {/* Header */}
                <header className="bg-[#8B1E2D] shadow-md sticky top-0 z-30 border-b border-[#a83246]">
    <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
            {/* Welcome Section */}
            <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Welcome back, {adminUser.name?.split(' ')[0] || 'Admin'}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 mt-0.5">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative p-2 hover:bg-[#a83246] rounded-full transition">
                    <FaBell className="text-white text-lg" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full border border-[#8B1E2D]"></span>
                </button>
                <button className="p-2 hover:bg-[#a83246] rounded-full transition">
                    <FaCog className="text-white text-lg" />
                </button>
                
                <div className="flex items-center gap-3 pl-3 border-l border-[#a83246]">
                    {/* Avatar - Border white kar diya taaki dark red par dikhe */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#8B1E2D] font-bold">
                        {adminUser.name?.charAt(0) || 'A'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="font-semibold text-white text-sm">{adminUser.name}</p>
                        <p className="text-xs text-gray-200 capitalize">
                            {adminUser.role?.replace('_', ' ') || 'Administrator'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

                {/* Main Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPanelLayout;
