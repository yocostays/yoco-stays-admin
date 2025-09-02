import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
    getMessAsync,
} from '../services';

const initialState = {
    isLoading: false,
    isIdLoading: false,
    isSubmitting: false,
    isDeleting: false,
    alert: {
        type: '',
        message: '',
    },
    messList: [],
    messById: [],
    totalCount: 0,
};

const messSlice = createSlice({
    name: 'mess',
    initialState,
    reducers: {
        clearAlert(state) {
            state.alert = {
                type: '',
                message: '',
            };
        },
    },
    extraReducers: (builder) => {
        // Get Mess List ----------
        builder.addMatcher(isAnyOf(getMessAsync.pending), (state) => {
            state.isLoading = true;
        });
        builder.addMatcher(isAnyOf(getMessAsync.fulfilled), (state, { payload }) => {
            state.isLoading = false;
            state.alert = {
                type: 'success',
                message: 'Staff List fetched successfully.',
            };
            state.totalCount = payload?.count;
            state.messList = payload?.data;
        });
        builder.addMatcher(isAnyOf(getMessAsync.rejected), (state) => {
            state.isLoading = false;
            state.alert = {
                type: 'error',
                message: 'Something went wrong.',
            };
            state.messList = [];
        });
        // -------------

        // create Mess menu ----------
        builder.addMatcher(isAnyOf(getMessAsync.pending), (state) => {
            state.isSubmitting = true;
        });
        builder.addMatcher(isAnyOf(getMessAsync.fulfilled), (state, { payload }) => {
            state.isSubmitting = false;
        });
        builder.addMatcher(isAnyOf(getMessAsync.rejected), (state) => {
            state.isSubmitting = false;
        });
        // -------------
    },
});

export const { clearAlert } = messSlice.actions;
export default messSlice.reducer;
