import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getFloorList } from '@redux/services/floorService';
  
const initialState = {
    floorList : []
};

const FloorSlice = createSlice({
  name: 'floor',
  initialState,
  extraReducers: (builder) => {

    // Get Floor List ----------
    builder.addMatcher(isAnyOf(getFloorList.pending), (state, { payload }) => {
    });
    builder.addMatcher(isAnyOf(getFloorList.fulfilled), (state, { payload }) => {
      state.floorList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getFloorList.rejected), (state, { payload }) => {
      state.floorList = [];
    });
    // -------------
    
  },
});

export const { clearAlert } = FloorSlice.actions;
export default FloorSlice.reducer;
