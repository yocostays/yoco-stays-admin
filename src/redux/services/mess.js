import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getMessAsync = createAsyncThunk('staff/getMessAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/mess',
    method: 'get',
    params,
  })
);

export const createMessAsync = createAsyncThunk('staff/createMessAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/mess/create',
    method: 'post',
    data,
  })
);