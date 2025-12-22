import {
  addHostelTemplateCategoryAsync,
  addTemplateAsync,
  createCategoryAsync,
  deleteTemplateAsync,
  deleteTemplateSubCategory,
  getHostelTemplateCategoryAsync,
  getTemplateByIDAsync,
  getTemplateCategoryAsync,
  getTemplateListAsync,
  getTemplateNewListAsync,
  updateHostelTemplateCategoryAsync,
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
  getNewTemplateList: [],
  getNewTemplateListPagination: {
    limit: 10,
    nextPage: false,
    page: 1,
    prevPage: false,
    totalHostels: 0
  },
  getTemplateById: [],
  getTemplateCategory: [],
  gateHostelCategory: [],
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

    builder.addMatcher(isAnyOf(getTemplateNewListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
      state.getNewTemplateList = [];
    });
    builder.addMatcher(isAnyOf(getTemplateNewListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.count;
      state.getNewTemplateList = payload?.data;
      state.getNewTemplateListPagination = {
        limit: payload?.limit ?? 10,
        nextPage: payload?.nextPage ?? false,
        page: payload?.page ?? 1,
        prevPage: payload?.prevPage ?? false,
        totalHostels: payload?.totalHostels ?? payload?.count
      };
    });
    builder.addMatcher(isAnyOf(getTemplateNewListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.getNewTemplateList = [];
    });
    // -------------
    // /---Hoste base template Category
    builder.addMatcher(isAnyOf(getHostelTemplateCategoryAsync.pending), (state, { payload }) => {
      state.isLoading = true;
      state.gateHostelCategory = [];
    });
    builder.addMatcher(isAnyOf(getHostelTemplateCategoryAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.count;
      state.gateHostelCategory = payload?.data;
    });
    builder.addMatcher(isAnyOf(getHostelTemplateCategoryAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.gateHostelCategory = [];
    });

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

    // ------- update templates hostel category         ----------------
    builder.addMatcher(isAnyOf(updateHostelTemplateCategoryAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateHostelTemplateCategoryAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateHostelTemplateCategoryAsync.rejected), (state) => {
      state.isSubmitting = false;
    });


    // ---------Delete template Category---------
    builder.addMatcher(isAnyOf(deleteTemplateSubCategory.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(deleteTemplateSubCategory.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(deleteTemplateSubCategory.rejected), (state) => {
      state.isSubmitting = false;
    });
    // add hostel template in hostel
    builder.addMatcher(isAnyOf(addHostelTemplateCategoryAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addHostelTemplateCategoryAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addHostelTemplateCategoryAsync.rejected), (state) => {
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

    builder.addMatcher(isAnyOf(getTemplateCategoryAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
      state.getTemplateCategory = [];
    });
    builder.addMatcher(isAnyOf(getTemplateCategoryAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.getTemplateCategory = payload?.data;
    });
    builder.addMatcher(isAnyOf(getTemplateCategoryAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.getTemplateCategory = [];
    });

    builder.addMatcher(isAnyOf(createCategoryAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(createCategoryAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(createCategoryAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { clearAlert } = templateSlice.actions;
export default templateSlice.reducer;
