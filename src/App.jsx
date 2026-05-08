// // import React from 'react';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import { Provider } from 'react-redux';
// // import { store } from './redux/store';
// // import AdminLogin from './pages/AdminLogin';
// // import AdminPanelLayout from './components/AdminPanelLayout';
// // import Dashboard from './pages/Dashboard';
// // import Products from './pages/Products';
// // import Orders from './pages/Orders';
// // import Users from './pages/Users';
// // import Coupons from './pages/Coupons';
// // import Content from './pages/Content';

// // function App() {
// //     return (
// //         <Provider store={store}>
// //             <ToastContainer position="top-right" autoClose={3000} />
// //             <Routes>
// //                 <Route path="/login" element={<AdminLogin />} />
// //                 <Route path="/admin" element={<AdminPanelLayout />}>
// //                     <Route index element={<Dashboard />} />
// //                     <Route path="products" element={<Products />} />
// //                     <Route path="orders" element={<Orders />} />
// //                     <Route path="users" element={<Users />} />
// //                     <Route path="coupons" element={<Coupons />} />
// //                     <Route path="content" element={<Content />} />
// //                 </Route>
// //                 <Route path="/" element={<Navigate to="/admin" replace />} />
// //                 <Route path="*" element={<Navigate to="/admin" replace />} />
// //             </Routes>
// //         </Provider>
// //     );
// // }

// // export default App;

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Provider } from 'react-redux';
// import { store } from './redux/store';
// import AdminLogin from './pages/AdminLogin';
// import AdminPanelLayout from './components/AdminPanelLayout';
// import AdminRoute from './components/AdminRoute'; // ✅ Import AdminRoute
// import Dashboard from './pages/Dashboard';
// import Products from './pages/Products';
// import Orders from './pages/Orders';
// import Users from './pages/Users';
// import Coupons from './pages/Coupons';
// import Content from './pages/Content';

// function App() {
//     return (
//         <Provider store={store}>
//             <ToastContainer position="top-right" autoClose={3000} />
//             <Routes>
//                 {/* Public Routes */}
//                 <Route path="/login" element={<AdminLogin />} />
                
//                 {/* Protected Admin Routes - Wrapped with AdminRoute */}
//                 <Route path="/admin" element={
//                     <AdminRoute>
//                         <AdminPanelLayout />
//                     </AdminRoute>
//                 }>
//                     <Route index element={<Dashboard />} />
//                     <Route path="products" element={<Products />} />
//                     <Route path="orders" element={<Orders />} />
//                     <Route path="users" element={<Users />} />
//                     <Route path="coupons" element={<Coupons />} />
//                     <Route path="content" element={<Content />} />
//                 </Route>
                
//                 {/* Redirects */}
//                 <Route path="/" element={<Navigate to="/admin" replace />} />
//                 <Route path="*" element={<Navigate to="/admin" replace />} />
//             </Routes>
//         </Provider>
//     );
// }

// export default App;


// App.js - Simplified with only 2 admin roles
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AdminLogin from './pages/AdminLogin';
import AdminPanelLayout from './components/AdminPanelLayout';
import AdminRoute from './components/AdminRoute';
import { ROLES } from './constants/roles';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Coupons from './pages/Coupons';
import Content from './pages/Content';

function App() {
    return (
        <Provider store={store}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                
                {/* Admin Routes - Both super_admin and admin can access */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminPanelLayout />
                    </AdminRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="users" element={<Users />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="content" element={<Content />} />
                </Route>
                
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Provider>
    );
}

export default App;