import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { createNoticeAsync, getAllNoticeAsync } from '@redux/services/notice';


const initialState = {
    isLoading: false,
    isIdLoading: false,
    isSubmitting: false,
    isDeleting: false,
    alert: {
        type: '',
        message: '',
    },
    noticeList: [],
    messById: [],
    totalCount: 0,
};

const noticeSlice = createSlice({
    name: 'notice',
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
        builder.addMatcher(isAnyOf(getAllNoticeAsync.pending), (state) => {
            state.isLoading = true;
        });
        builder.addMatcher(isAnyOf(getAllNoticeAsync.fulfilled), (state, { payload }) => {
            state.isLoading = false;
            state.totalCount = payload?.count;
            state.noticeList = payload?.data;
        });
        builder.addMatcher(isAnyOf(getAllNoticeAsync.rejected), (state) => {
            state.isLoading = false;
            state.alert = {
                type: 'error',
                message: 'Something went wrong.',
            };
            state.noticeList = [];
        });
        // -------------

        // // create Noitce menu ----------
        builder.addMatcher(isAnyOf(createNoticeAsync.pending), (state) => {
            state.isSubmitting = true;
        });
        builder.addMatcher(isAnyOf(createNoticeAsync.fulfilled), (state, { payload }) => {
            state.isSubmitting = false;
        });
        builder.addMatcher(isAnyOf(createNoticeAsync.rejected), (state) => {
            state.isSubmitting = false;
        });
        // -------------
    },
});

export const { clearAlert } = noticeSlice.actions;
export default noticeSlice.reducer;
