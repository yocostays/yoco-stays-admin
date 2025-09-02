import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { postLoginApiAsync } from '@redux/services'; 

const initialState = {
  token: false,
  isSubmitting: false,
  resError : null,
  userData: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    // Login User ----------
    builder.addMatcher(isAnyOf(postLoginApiAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postLoginApiAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.userData = payload?.data;
    });
    builder.addMatcher(isAnyOf(postLoginApiAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
    // Logout User ----------
    builder.addMatcher(isAnyOf(postLoginApiAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postLoginApiAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postLoginApiAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});


export default authSlice.reducer;
