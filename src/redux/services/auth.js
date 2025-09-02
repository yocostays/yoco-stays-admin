import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const postLoginApiAsync = createAsyncThunk('admin/postLoginApi', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/auth/signin',
    method: 'post',
    data,
  })
);

export const postLogoutApiAsync = createAsyncThunk('admin/postLogoutApi', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/auth/logout',
    method: 'post',
    data,
  })
);




