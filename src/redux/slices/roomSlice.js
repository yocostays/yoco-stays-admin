import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getRoomsAsync } from '@redux/services/roomsService';
  
const initialState = {
    roomsList : []
};

const RoomSlice = createSlice({
  name: 'room',
  initialState,
  extraReducers: (builder) => {

    // Get Room List ----------
    builder.addMatcher(isAnyOf(getRoomsAsync.pending), (state, { payload }) => {
    });
    builder.addMatcher(isAnyOf(getRoomsAsync.fulfilled), (state, { payload }) => {
      state.roomsList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRoomsAsync.rejected), (state, { payload }) => {
      state.roomsList = [];
    });
    // -------------
    
  },
});

export const { clearAlert } = RoomSlice.actions;
export default RoomSlice.reducer;
