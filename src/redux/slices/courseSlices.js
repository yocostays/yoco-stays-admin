import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addCourseAsync,
  updateCourseAsync,
  deleteCourseAsync,
  getCourseAsync,
  getCourseByIDAsync,
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
  courseList: [],
  courseListById: [],
  courseRoles: [],
  totalCount: 0,
};

const CourseSlice = createSlice({
  name: 'course',
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
    builder.addMatcher(isAnyOf(getCourseAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getCourseAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'success',
        message: 'Course List fetched successfully.',
      };
      state.totalCount = payload?.count;
      state.courseList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getCourseAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.courseList = [];
    });
    // -------------
   
    // Get Staff By Id ----------
    builder.addMatcher(isAnyOf(getCourseByIDAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
    });
    builder.addMatcher(isAnyOf(getCourseByIDAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.courseListById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getCourseByIDAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.courseListById = [];
    });
    // -------------
   
    // Create Staff ----------
    builder.addMatcher(isAnyOf(addCourseAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addCourseAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addCourseAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
   
    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateCourseAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateCourseAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateCourseAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    
    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteCourseAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteCourseAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteCourseAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
    
  },
});

export const { clearAlert } = CourseSlice.actions;
export default CourseSlice.reducer;
