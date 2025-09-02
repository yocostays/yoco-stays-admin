import {
  addTemplateAsync,
  deleteTemplateAsync,
  getTemplateByIDAsync,
  getTemplateListAsync,
  updateTemplateAsync,
} from '@redux/services/templateServices';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isIdLoading: false,
  isSubmitting: false,
  isDeleting: false,
  alert: {
    type: '',
    message: '',
  },
  getTemplateList: [],
  getTemplateById: [],
  totalCount: 0,
};

const templateSlice = createSlice({
  name: 'template',
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
    builder.addMatcher(isAnyOf(getTemplateListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
      state.getTemplateList = [];
    });
    builder.addMatcher(isAnyOf(getTemplateListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.count;
      state.getTemplateList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getTemplateListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.getTemplateList = [];
    });
    // -------------

    // Get Staff By Id ----------
    builder.addMatcher(isAnyOf(getTemplateByIDAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
      state.getTemplateById = [];
    });
    builder.addMatcher(isAnyOf(getTemplateByIDAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.getTemplateById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getTemplateByIDAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.getTemplateById = [];
    });
    // -------------

    // Create Staff ----------
    builder.addMatcher(isAnyOf(addTemplateAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addTemplateAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addTemplateAsync.rejected), (state) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateTemplateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateTemplateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateTemplateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteTemplateAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteTemplateAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteTemplateAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { clearAlert } = templateSlice.actions;
export default templateSlice.reducer;
