import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getRoomsAsync = createAsyncThunk('rooms/getRoomsAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/mupliple-floors/rooms',
    method: 'post',
    data,
  })
);
