import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getHostelListAsync,
  getHostelByIDAsync,
  updateDiningAndMessAsync,
  addHostelAsync,
  updateHostelAsync,
  deleteHostelAsync,
  createRoomMapAsync,
  getRoomMapAsync,
  getBedTypeAsync,
  getRoomNo,
  getVacantRoom,
  getDiningAndMessDataAsync,
  uploadLegalDocumentsAsync,
  getLegalDocumentsAsync,
  getHostelListDD,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDetailLoading: false,
  isSubmitDining: false,
  isSubmitDocument: false,
  alert: {
    type: '',
    message: '',
  },
  hostelList: [],
  hostelByID: [],
  getRoomMap: [],
  bedType: [],
  roomNo: [],
  vacantRoom: [],
  getDiningAndMessData: [],
  getLegalDocuments: [],
  hostelListDD: [],
  totalCount: 0,
};

const hostelSlice = createSlice({
  name: 'hostel',
  initialState,
  reducers: {
    clearAlert(state) {
      state.alert = { type: '', message: '' };
    },
  },
  extraReducers: (builder) => {
    // get hostel list

    builder.addMatcher(isAnyOf(getHostelListAsync.pending), (state) => {
      state.isLoading = true;
      state.alert = { type: '', message: '' };
    });
    builder.addMatcher(isAnyOf(getHostelListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.hostelList = payload?.data || [];
      state.totalCount = payload?.count || 0;
      state.alert = {
        type: 'success',
        message: 'Hostel list fetched successfully.',
      };
    });
    builder.addMatcher(isAnyOf(getHostelListAsync.rejected), (state, action) => {
      state.isLoading = false;
      state.alert = {
        type: 'error',
        message: action.error.message || 'Failed to fetch hostel list.',
      };
      state.hostelList = [];
    });

    // get hostel by id

    builder.addMatcher(isAnyOf(getHostelByIDAsync.pending), (state) => {
      state.isDetailLoading = true;
    });
    builder.addMatcher(isAnyOf(getHostelByIDAsync.fulfilled), (state, { payload }) => {
      state.isDetailLoading = false;
      state.hostelByID = payload?.data || [];
    });
    builder.addMatcher(isAnyOf(getHostelByIDAsync.rejected), (state, action) => {
      state.isDetailLoading = false;
      state.hostelByID = [];
    });

    // create hostel

    builder.addMatcher(isAnyOf(addHostelAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addHostelAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addHostelAsync.rejected), (state) => {
      state.isSubmitting = false;
    });

    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateHostelAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateHostelAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateHostelAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // Delete Role ----------
    builder.addMatcher(isAnyOf(deleteHostelAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteHostelAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteHostelAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });

    // -------------

    // Create Hostel Map
    builder.addMatcher(isAnyOf(createRoomMapAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(createRoomMapAsync.fulfilled), (state) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(createRoomMapAsync.rejected), (state) => {
      state.isSubmitting = false;
    });

    // get Hostel map
    builder.addMatcher(isAnyOf(getRoomMapAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getRoomMapAsync.fulfilled), (state, payload ) => {
      state.isSubmitting = false;
      state.getRoomMap = payload?.payload;
    });
    builder.addMatcher(isAnyOf(getRoomMapAsync.rejected), (state) => {
      state.isSubmitting = false;
    });

    // get bedtype
    builder.addMatcher(isAnyOf(getBedTypeAsync.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getBedTypeAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.bedType = payload?.data;
    });
    builder.addMatcher(isAnyOf(getBedTypeAsync.rejected), (state) => {
      state.isSubmitting = false;
    });

    // get room number
    builder.addMatcher(isAnyOf(getRoomNo.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getRoomNo.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.roomNo = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRoomNo.rejected), (state) => {
      state.isSubmitting = false;
    });

    // get vacant room
    builder.addMatcher(isAnyOf(getVacantRoom.pending), (state) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(getVacantRoom.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
      state.vacantRoom = payload?.data;
    });
    builder.addMatcher(isAnyOf(getVacantRoom.rejected), (state) => {
      state.isSubmitting = false;
    });
  
    // Update Dining and Mess Facilities
    builder.addMatcher(isAnyOf(updateDiningAndMessAsync.pending), (state) => {
      state.isSubmitDining = true;
    });
    builder.addMatcher(isAnyOf(updateDiningAndMessAsync.fulfilled), (state) => {
      state.isSubmitDining = false;
    });
    builder.addMatcher(isAnyOf(updateDiningAndMessAsync.rejected), (state) => {
      state.isSubmitDining = false;
    });
  
    // Update Dining and Mess Facilities
    builder.addMatcher(isAnyOf(getDiningAndMessDataAsync.pending), (state) => {
      state.isSubmitDining = true;
    });
    builder.addMatcher(isAnyOf(getDiningAndMessDataAsync.fulfilled), (state, { payload }) => {
      state.isSubmitDining = false;
      state.getDiningAndMessData = payload?.data;
    });
    builder.addMatcher(isAnyOf(getDiningAndMessDataAsync.rejected), (state) => {
      state.isSubmitDining = false;
    });


    // Upload Legal Documents 
    builder.addMatcher(isAnyOf(uploadLegalDocumentsAsync.pending), (state) => {
      state.isSubmitDocument = true;
    });
    builder.addMatcher(isAnyOf(uploadLegalDocumentsAsync.fulfilled), (state) => {
      state.isSubmitDocument = false;
    });
    builder.addMatcher(isAnyOf(uploadLegalDocumentsAsync.rejected), (state) => {
      state.isSubmitDocument = false;
    });
    
    // Get Legal Documents 
    builder.addMatcher(isAnyOf(getLegalDocumentsAsync.pending), (state) => {
      state.isSubmitDocument = true;
    });
    builder.addMatcher(isAnyOf(getLegalDocumentsAsync.fulfilled), (state, { payload } ) => {
      state.isSubmitDocument = false;
      state.getLegalDocuments = payload?.data;
    });
    builder.addMatcher(isAnyOf(getLegalDocumentsAsync.rejected), (state) => {
      state.isSubmitDocument = false;
    });
    
    // Get Assigned Hostel List 
    builder.addMatcher(isAnyOf(getHostelListDD.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getHostelListDD.fulfilled), (state, { payload } ) => {
      state.isLoading = false;
      state.hostelListDD = payload?.data;
    });
    builder.addMatcher(isAnyOf(getHostelListDD.rejected), (state) => {
      state.isLoading = false;
    });

  },
});

export const { clearAlert } = hostelSlice.actions;
export default hostelSlice.reducer;
