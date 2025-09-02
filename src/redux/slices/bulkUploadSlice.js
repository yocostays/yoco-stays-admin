import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getBulkFiles } from '@redux/services';

const initialState = {
    isLoading: false,
    isSubmitting: false,
    totalCount: 0,
    bukFileList: [],
};

const bulkUploadSlice = createSlice({
    name: 'bulkUpload',
    initialState,
    extraReducers: (builder) => {
        // get all routes ----------
        builder.addMatcher(isAnyOf(getBulkFiles.pending), (state, { payload }) => {
            state.isLoading = true;
        });
        builder.addMatcher(isAnyOf(getBulkFiles.fulfilled), (state, { payload }) => {
            state.isLoading = false;
            state.bukFileList = payload?.data;
            state.totalCount = payload?.count;
        });
        builder.addMatcher(isAnyOf(getBulkFiles.rejected), (state, { payload }) => {
            state.isLoading = false;
        });
        // -------------
    },
});


export default bulkUploadSlice.reducer;
