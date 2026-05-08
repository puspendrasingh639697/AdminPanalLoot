// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/Api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await API.post('/user/login', { email, password });
            const data = response.data;
            
            console.log("Response data:", data);
            
            // ✅ IMPORTANT: Read accessToken (not token)
            const token = data.accessToken || data.token;
            
            console.log("Extracted token:", token);
            
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('accessToken', token);
                localStorage.setItem('user', JSON.stringify({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    phone: data.phone || ''
                }));
                
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                toast.success(`Welcome back, ${data.name}!`);
                navigate('/admin');
            } else {
                console.error("No token found in response");
                toast.error('Login failed: No token received');
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#8B1E2D] to-[#6B1622] p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                    <p className="text-red-100 text-sm mt-1">Login to manage your store</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#8B1E2D] text-white rounded-lg hover:bg-[#6B1622] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;