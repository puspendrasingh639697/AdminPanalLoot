import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/Api";

// import API from "../../utils/Api";

export const fetchAllCoupons = createAsyncThunk(
    "coupon/fetchAllCoupons",
    async (_, { rejectWithValue }) => {
        try {
            // Admin endpoint - admin/all
            const response = await API.get('/coupon/admin/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
        }
    }
);

// Get active coupons (User side)
export const fetchActiveCoupons = createAsyncThunk(
    "coupon/fetchActiveCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/coupon/active');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch active coupons");
        }
    }
);

// Create new coupon (Admin)
export const createCoupon = createAsyncThunk(
    "coupon/createCoupon",
    async (couponData, { rejectWithValue }) => {
        try {
            const response = await API.post('/coupon/create', couponData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
        }
    }
);

// Toggle coupon status (Activate/Deactivate)
export const toggleCouponStatus = createAsyncThunk(
    "coupon/toggleCouponStatus",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/coupon/admin/${id}/toggle`, { isActive });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle coupon status");
        }
    }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
    "coupon/deleteCoupon",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/coupon/admin/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
        }
    }
);

// Apply coupon to order
export const applyCoupon = createAsyncThunk(
    "coupon/applyCoupon",
    async ({ code, orderAmount }, { rejectWithValue }) => {
        try {
            const response = await API.post('/coupon/apply', { code, orderAmount });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Invalid coupon code");
        }
    }
);

// Get coupon by code
export const getCouponByCode = createAsyncThunk(
    "coupon/getCouponByCode",
    async (code, { rejectWithValue }) => {
        try {
            const response = await API.get(`/coupon/code/${code}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Coupon not found");
        }
    }
);

// ✅ Initial State
const initialState = {
    coupons: [],           // All coupons
    activeCoupons: [],     // Active coupons for users
    selectedCoupon: null,  // Currently selected/validated coupon
    appliedCoupon: null,   // Applied coupon in cart
    loading: false,
    error: null,
    success: false,
};

// ✅ Coupon Slice
const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        clearCouponError: (state) => {
            state.error = null;
        },
        clearCouponSuccess: (state) => {
            state.success = false;
        },
        setAppliedCoupon: (state, action) => {
            state.appliedCoupon = action.payload;
        },
        clearAppliedCoupon: (state) => {
            state.appliedCoupon = null;
        },
        resetCouponState: (state) => {
            state.selectedCoupon = null;
            state.appliedCoupon = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ Fetch All Coupons
            .addCase(fetchAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload?.coupons || [];
                state.success = true;
            })
            .addCase(fetchAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Fetch Active Coupons
            .addCase(fetchActiveCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.activeCoupons = action.payload?.coupons || [];
            })
            .addCase(fetchActiveCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Create Coupon
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.coupons = [action.payload?.coupon, ...state.coupons];
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Toggle Coupon Status
            .addCase(toggleCouponStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleCouponStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCoupon = action.payload?.coupon;
                if (updatedCoupon) {
                    const index = state.coupons.findIndex(c => c._id === updatedCoupon._id);
                    if (index !== -1) {
                        state.coupons[index] = updatedCoupon;
                    }
                }
                state.success = true;
            })
            .addCase(toggleCouponStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Delete Coupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                state.coupons = state.coupons.filter(c => c._id !== deletedId);
                state.success = true;
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // ✅ Apply Coupon
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.appliedCoupon = action.payload?.coupon;
                state.selectedCoupon = action.payload?.coupon;
                state.success = true;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.appliedCoupon = null;
            })
            
            // ✅ Get Coupon By Code
            .addCase(getCouponByCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCouponByCode.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCoupon = action.payload?.coupon;
            })
            .addCase(getCouponByCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.selectedCoupon = null;
            });
    },
});

// ✅ Export actions
export const { 
    clearCouponError, 
    clearCouponSuccess, 
    setAppliedCoupon,
    clearAppliedCoupon,
    resetCouponState 
} = couponSlice.actions;

// ✅ Selectors
export const selectAllCoupons = (state) => state.coupon.coupons;
export const selectActiveCoupons = (state) => state.coupon.activeCoupons;
export const selectSelectedCoupon = (state) => state.coupon.selectedCoupon;
export const selectAppliedCoupon = (state) => state.coupon.appliedCoupon;
export const selectCouponLoading = (state) => state.coupon.loading;
export const selectCouponError = (state) => state.coupon.error;
export const selectCouponSuccess = (state) => state.coupon.success;

// ✅ Default export
export default couponSlice.reducer;