import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getAllRoutesAsync = createAsyncThunk('permissions/getAllRoutesAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/page-routes',
    method: 'get',
    params,
  })
);

export const createPermissions = createAsyncThunk('permissions/createPermissions', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/permission/create',
    method: 'post',
    data,
  })
);

export const getPermissionByID = createAsyncThunk('permissions/getPermissionByID', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/permission',
    method: 'post',
    data,
  })
);