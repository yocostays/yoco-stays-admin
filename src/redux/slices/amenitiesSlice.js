import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  addAmenitiesAsync,
  deleteAmenitiesAsync,
  getAmenitiesAsync,
  getAmenitiesByIDAsync,
  updateAmenitiesAsync,
} from '@redux/services/amenitiesServices';

const initialState = {
  isLoading: false,
  isIdLoading: false,
  isSubmitting: false,
  isDeleting: false,
  alert: {
    type: '',
    message: '',
  },
  amenitiesList: [],
  amenitiesListById: [],
  count: 0,
};
const AmenitiesSlice = createSlice({
  name: 'amenities',
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
    builder.addMatcher(isAnyOf(getAmenitiesAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getAmenitiesAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'success',
        message: 'Course List fetched successfully.',
      };
      state.count = payload?.count;
      state.amenitiesList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getAmenitiesAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.amenitiesList = [];
    });
    // -------------

    // Get Staff By Id ----------
    builder.addMatcher(isAnyOf(getAmenitiesByIDAsync.pending), (state, { payload }) => {
      state.isIdLoading = true;
    });
    builder.addMatcher(isAnyOf(getAmenitiesByIDAsync.fulfilled), (state, { payload }) => {
      state.isIdLoading = false;
      state.alert = {
        type: 'success',
        message: 'Course List fetched successfully.',
      };
      state.amenitiesListById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getAmenitiesByIDAsync.rejected), (state, { payload }) => {
      state.isIdLoading = false;
      state.alert = {
        type: 'error',
        message: 'Something went wrong.',
      };
      state.amenitiesListById = [];
    });
    // -------------

    // Create Staff ----------
    builder.addMatcher(isAnyOf(addAmenitiesAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addAmenitiesAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addAmenitiesAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateAmenitiesAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateAmenitiesAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateAmenitiesAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteAmenitiesAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteAmenitiesAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteAmenitiesAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { clearAlert } = AmenitiesSlice.actions;
export default AmenitiesSlice.reducer;
