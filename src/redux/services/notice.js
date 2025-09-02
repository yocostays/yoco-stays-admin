import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getAllNoticeAsync = createAsyncThunk('staff/getAllNoticeAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/notice',
    method: 'get',
    params,
  })
);

export const createNoticeAsync = createAsyncThunk('staff/createNoticeAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/notice/create',
    method: 'post',
    data,
  })
);