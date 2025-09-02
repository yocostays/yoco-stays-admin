import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getUsersAsync = createAsyncThunk('users/getUsersAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/users',
    method: 'get',
    params,
  })
);

export const addUserAsync = createAsyncThunk('users/addUsersAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/users',
    method: 'post',
    data,
  })
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUsersAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}`,
      method: 'put',
      data,
    })
);

export const deleteUserAsync = createAsyncThunk('users/updateUsersAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/users/${id}`,
    method: 'delete',
  })
);


export const getUserByHostelAsync = createAsyncThunk(
  'users/getUserByHostelAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/api/hostel/fetch-users',
      method: 'post',
      data,
    })
);