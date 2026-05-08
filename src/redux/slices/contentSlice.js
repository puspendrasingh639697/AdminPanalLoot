import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/Api';


// ✅ Fetch content (GET)
export const fetchContent = createAsyncThunk(
    'content/fetchContent',
    async (contentType, { rejectWithValue }) => {
        try {
            // ✅ Sahi endpoint
            const response = await API.get(`/content/${contentType}`);
            console.log(`Fetched ${contentType}:`, response.data);
            return { contentType, data: response.data };
        } catch (err) {
            console.error(`Failed to fetch ${contentType}:`, err);
            // Agar content nahi mila toh default return karo
            if (err.response?.status === 404) {
                return { contentType, data: { title: '', body: '' } };
            }
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch content');
        }
    }
);

// ✅ Update content (POST - backend `/update` endpoint)
export const updateContent = createAsyncThunk(
    'content/updateContent',
    async ({ contentType, title, body }, { rejectWithValue }) => {
        try {
            // ✅ Sahi endpoint - POST /content/update
            const response = await API.post('/content/update', { 
                type: contentType, 
                title, 
                body 
            });
            console.log(`Updated ${contentType}:`, response.data);
            return { contentType, data: response.data.content };
        } catch (err) {
            console.error(`Failed to update ${contentType}:`, err);
            return rejectWithValue(err.response?.data?.message || 'Failed to update content');
        }
    }
);

// ✅ Initial State
const initialState = {
    about: { title: '', body: '' },
    banner: { title: '', body: '', imageUrl: '', link: '' },
    contact: { title: '', body: '' },
    policy: { title: '', body: '' },
    isLoading: false,
    success: false,
    error: null,
};

// ✅ Content Slice
const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        clearContentState: (state) => {
            state.success = false;
            state.error = null;
        },
        resetContent: (state) => {
            state.about = { title: '', body: '' };
            state.banner = { title: '', body: '', imageUrl: '', link: '' };
            state.contact = { title: '', body: '' };
            state.policy = { title: '', body: '' };
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch content - Pending
            .addCase(fetchContent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // Fetch content - Fulfilled
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.isLoading = false;
                state[action.payload.contentType] = action.payload.data;
                state.success = true;
            })
            // Fetch content - Rejected
            .addCase(fetchContent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            
            // Update content - Pending
            .addCase(updateContent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            // Update content - Fulfilled
            .addCase(updateContent.fulfilled, (state, action) => {
                state.isLoading = false;
                state[action.payload.contentType] = action.payload.data;
                state.success = true;
            })
            // Update content - Rejected
            .addCase(updateContent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

// ✅ Export actions
export const { clearContentState, resetContent } = contentSlice.actions;

// ✅ Selectors
export const selectAbout = (state) => state.content.about;
export const selectBanner = (state) => state.content.banner;
export const selectContact = (state) => state.content.contact;
export const selectPolicy = (state) => state.content.policy;
export const selectContentLoading = (state) => state.content.isLoading;
export const selectContentSuccess = (state) => state.content.success;
export const selectContentError = (state) => state.content.error;

// ✅ Default export
export default contentSlice.reducer;