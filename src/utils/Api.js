// import axios from "axios";

// const API = axios.create({
//     baseURL: "https://piyush-sir.onrender.com/api",
// });

// // ✅ Fix: Check both adminToken and regular token
// API.interceptors.request.use((req) => {
//     const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
//     if (token) {
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// });

// export default API;


// src/utils/api.js
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Create axios instance
const API = axios.create({
    baseURL: "https://piyush-sir.onrender.com/api",
    timeout: 30000, // 30 seconds timeout
});

// ✅ Variable to prevent multiple refresh token calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ✅ Request Interceptor - Add Token
API.interceptors.request.use(
    (req) => {
        // Check for both token formats (for backward compatibility)
        const token = localStorage.getItem("accessToken") || 
                      localStorage.getItem("token") || 
                      localStorage.getItem("adminToken");
                      console.log("Refresh Token:", localStorage.getItem('refreshToken'));
        
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log(`📤 API Request: ${req.method.toUpperCase()} ${req.url}`);
        }
        
        return req;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

// ✅ Response Interceptor - Handle Errors
API.interceptors.response.use(
    (response) => {
        // Log response for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log(`📥 API Response: ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // ✅ Handle 429 Too Many Requests - Retry after delay
        if (error.response?.status === 429 && !originalRequest._retry) {
            originalRequest._retry = true;
            const retryAfter = parseInt(error.response.headers['retry-after']) || 5;
            
            toast.warning(`Rate limit hit. Retrying after ${retryAfter} seconds...`);
            
            // Wait and retry
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return API(originalRequest);
        }
        
        // ✅ Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while token is being refreshed
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return API(originalRequest);
                }).catch(err => Promise.reject(err));
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            const refreshToken = localStorage.getItem("refreshToken");
            
            if (!refreshToken) {
                // No refresh token, redirect to login
                localStorage.clear();
                window.location.href = '/login';
                toast.error("Session expired. Please login again.");
                return Promise.reject(error);
            }
            
            try {
                const response = await axios.post('https://piyush-sir.onrender.com/api/user/refresh-token', {
                    refreshToken
                });
                
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                // Store new tokens
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                localStorage.setItem("token", accessToken); // For backward compatibility
                
                // Update authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                // Process queued requests
                processQueue(null, accessToken);
                
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                window.location.href = '/login';
                toast.error("Session expired. Please login again.");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // ✅ Handle 403 Forbidden
        if (error.response?.status === 403) {
            toast.error("You don't have permission to perform this action.");
        }
        
        // ✅ Handle 404 Not Found
        if (error.response?.status === 404) {
            toast.error("Resource not found. Please refresh and try again.");
        }
        
        // ✅ Handle 500 Server Error
        if (error.response?.status === 500) {
            toast.error("Server error. Please try again later.");
        }
        
        // ✅ Handle Network Error
        if (error.message === "Network Error") {
            toast.error("Network connection failed. Please check your internet.");
        }
        
        // ✅ Handle Timeout
        if (error.code === "ECONNABORTED") {
            toast.error("Request timed out. Please try again.");
        }
        
        return Promise.reject(error);
    }
);

export default API;