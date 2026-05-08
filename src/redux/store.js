import { configureStore } from '@reduxjs/toolkit';
import couponReducer from './slices/couponSlice';
import contentReducer from './slices/contentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
         auth: authReducer,   
        coupon: couponReducer,
        content: contentReducer,
    },
});