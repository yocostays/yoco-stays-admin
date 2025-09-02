import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { addUniversityAsync, deleteUniversityAsync, getUniversityByIDAsync, getUniversityListAsync, updateUniversityAsync } from '@redux/services/universityServices';

const initialState = {
  isLoading: false,
  isIdLoading: false,
  isSubmitting: false,
  isDeleting: false,
  alert: {
    type: '',
    message: '',
  },
  getUniversityList: [],
  getUniversityByID: [],
  totalCount: 0,
};

const universitySlice = createSlice({
  name: 'university',
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
    builder.addMatcher(isAnyOf(getUniversityListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
      state.getUniversityList = [];
    });
    builder.addMatcher(isAnyOf(getUniversityListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.count;
      state.getUniversityList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getUniversityListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.getUniversityList = [];
    });
    // -------------
   
    // Get Staff By Id ----------
    builder.addMatcher(isAnyOf(getUniversityByIDAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
      state.getUniversityByID = [];
    });
    builder.addMatcher(isAnyOf(getUniversityByIDAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.getUniversityByID = payload?.data;
    });
    builder.addMatcher(isAnyOf(getUniversityByIDAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.getUniversityByID = [];
    });
    // -------------
   
    // Create Staff ----------
    builder.addMatcher(isAnyOf(addUniversityAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addUniversityAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addUniversityAsync.rejected), (state) => {
      state.isSubmitting = false;
    });
    // -------------
   
    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateUniversityAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateUniversityAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateUniversityAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    
    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteUniversityAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteUniversityAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteUniversityAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
    
  },
});

export const { clearAlert } = universitySlice.actions;
export default universitySlice.reducer;
