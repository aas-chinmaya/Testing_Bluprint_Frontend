



// // modules/marketing/slices/MarketingOverviewSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { axiosInstance } from '@/lib/axios'; // Assuming this is your configured axios


      
// const dummyData = {
//   statistics: [
//     { title: 'Total Contacts Received', value: 0 },
//     { title: 'New Contacts', value: 0 },
//     { title: 'Converted Leads', value: 0 },
//     { title: 'Follow-ups Taken', value: 0 },
//   ],
//   leadSources: [],
//   leadTrend: [],
// };

// export const fetchMarketingOverview = createAsyncThunk(
//   'marketingOverview/fetchOverview',
//   async (year, { rejectWithValue }) => {
//     try {
//       // Attempt real API call
//       const response = await axiosInstance.get(`/contact/analytics/${year}`);
     
   
//       return response.data.data  
      
//     } catch (error) {
//       // On any error (network, 404, 500, etc.), return dummy data silently
//       console.warn('Marketing overview API failed, returning dummy data:', error);
//       return dummyData;
//     }
//   }
// );

// const MarketingOverviewSlice = createSlice({
//   name: 'marketingOverview',
//   initialState: {
//     overviewData: null,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMarketingOverview.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchMarketingOverview.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.overviewData = action.payload; // Either real data or dummy
//         state.error = null;
//       })
//       .addCase(fetchMarketingOverview.rejected, (state) => {
//         // On reject, we still set dummy data in fulfilled case above
//         state.status = 'succeeded';
//         state.overviewData = dummyData;
//         state.error = null; // No error shown
//       });
//   },
// });

// export const MarketingOverviewReducer = MarketingOverviewSlice.reducer;
// export default MarketingOverviewReducer;



// modules/marketing/slices/MarketingOverviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

const dummyData = {
  statistics: [
    { title: 'Total Contacts Received', value: 0 },
    { title: 'New Contacts', value: 0 },
    { title: 'Converted Leads', value: 0 },
    { title: 'Follow-ups Taken', value: 0 },
  ],
  leadSources: [],
  leadTrend: [],
};

export const fetchMarketingOverview = createAsyncThunk(
  'marketingOverview/fetchOverview',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/contact/analytics', {
        params: {
          startDate,
          endDate,
        },
      });

      return response.data.data;
    } catch (error) {
      console.warn(
        'Marketing overview API failed, returning dummy data:',
        error
      );
      return dummyData;
    }
  }
);

const MarketingOverviewSlice = createSlice({
  name: 'marketingOverview',
  initialState: {
    overviewData: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketingOverview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarketingOverview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overviewData = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketingOverview.rejected, (state) => {
        state.status = 'succeeded';
        state.overviewData = dummyData;
        state.error = null;
      });
  },
});

export const MarketingOverviewReducer = MarketingOverviewSlice.reducer;
export default MarketingOverviewReducer;
