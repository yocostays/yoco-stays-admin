import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getFloorList = createAsyncThunk('floor/getFloorList', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/fetch-floor',
    method: 'post',
    data,
  })
);
