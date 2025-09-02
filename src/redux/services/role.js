import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getRoleAsync = createAsyncThunk('role/getRoleAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/role',
    method: 'get',
    params,
  })
);

export const getRoleByIDAsync = createAsyncThunk('role/getRoleByIDAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/role/${id}`,
    method: 'get',
  })
);

export const addRoleAsync = createAsyncThunk('role/addRoleAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/role/create',
    method: 'post',
    data,
  })
);

export const updateRoleAsync = createAsyncThunk(
  'role/updateRoleAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `api/role/update/${id}`,
      method: 'patch',
      data,
    })
);

export const deleteRoleAsync = createAsyncThunk('role/deleteRoleAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/role/delete/${id}`,
    method: 'delete',
  })
);
