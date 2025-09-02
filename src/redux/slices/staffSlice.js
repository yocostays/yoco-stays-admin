import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addStaffAsync,
  updateStaffAsync,
  deleteStaffAsync,
  getStaffAsync,
  getStaffByIDAsync,
  getRoleForStaffAsync,
  assignHostelAsync,
  getAssignedHostelAsync,
  getComplaintCategoryAsync,
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
  totalCount: 0,
  staffList: [],
  staffById: [],
  staffRoles: [],
  getComplaintCategory: [],
};

const staffSlice = createSlice({
  name: 'staff',
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
    // Get Saff List ----------
    builder.addMatcher(isAnyOf(getStaffAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'success',
        message: 'Staff List fetched successfully.',
      };
      state.totalCount = payload?.count?.allUserCount;
      state.staffList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.staffList = [];
    });
    // -------------

    // Get Staff By Id ----------
    builder.addMatcher(isAnyOf(getStaffByIDAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffByIDAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.alert = {
        type: 'success',
        message: 'Staff List fetched successfully.',
      };
      state.staffById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffByIDAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.staffById = [];
    });
    // -------------

    // Create Staff ----------
    builder.addMatcher(isAnyOf(addStaffAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addStaffAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addStaffAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateStaffAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateStaffAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateStaffAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteStaffAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteStaffAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteStaffAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------

    // staff Role ----------
    builder.addMatcher(isAnyOf(getRoleForStaffAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getRoleForStaffAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.staffRoles = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRoleForStaffAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // staff Assign Hostel ----------
    builder.addMatcher(isAnyOf(assignHostelAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(assignHostelAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(assignHostelAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // staff Assign Hostel ----------
    builder.addMatcher(isAnyOf(getAssignedHostelAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getAssignedHostelAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(getAssignedHostelAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // staff Role ----------
    builder.addMatcher(isAnyOf(getComplaintCategoryAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getComplaintCategoryAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.getComplaintCategory = payload?.data;
    });
    builder.addMatcher(isAnyOf(getComplaintCategoryAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { clearAlert } = staffSlice.actions;
export default staffSlice.reducer;
