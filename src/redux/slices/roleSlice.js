import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addRoleAsync,
  getRoleAsync,
  getRoleByIDAsync,
  updateRoleAsync,
  deleteRoleAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  alert: {
    type: '',
    message: '',
  },
  roleList: [],
  roleById: [],
  totalCount: 0,
};

const roleSlice = createSlice({
  name: 'role',
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
    // Get Role List ----------
    builder.addMatcher(isAnyOf(getRoleAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getRoleAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'success',
        message: 'Role List fetched successfully.',
      };
      state.totalCount = payload?.count;
      state.roleList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRoleAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.roleList = [];
    });
    // -------------
   
    // Get Role By Id ----------
    builder.addMatcher(isAnyOf(getRoleByIDAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getRoleByIDAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'success',
        message: 'Role List fetched successfully.',
      };
      state.roleById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRoleByIDAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.roleById = [];
    });
    // -------------
   
    // Create Role ----------
    builder.addMatcher(isAnyOf(addRoleAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addRoleAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addRoleAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
   
    // Update Role ----------
    builder.addMatcher(isAnyOf(updateRoleAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateRoleAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateRoleAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteRoleAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(deleteRoleAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(deleteRoleAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { clearAlert } = roleSlice.actions;
export default roleSlice.reducer;
