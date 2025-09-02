import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getStaffAsync = createAsyncThunk('staff/getStaffAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/staff',
    method: 'get',
    params,
  })
);

export const getStaffByIDAsync = createAsyncThunk('staff/getStaffByIDAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/staff/${id}`,
    method: 'get',
  })
);

export const addStaffAsync = createAsyncThunk('staff/addStaffAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/staff/create-from-warden',
    method: 'post',
    data,
  })
);

export const updateStaffAsync = createAsyncThunk('staff/updateStaffAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/staff/update/${id}`,
    method: 'patch',
    data,
  })
);


export const deleteStaffAsync = createAsyncThunk('role/deleteStaffAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/staff/delete/${id}`,
    method: 'delete',
  })
);

export const getRoleForStaffAsync = createAsyncThunk('role/getRoleForStaffAsync', async (param, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/role/exclude-superadmin',
    method: 'post',
    param,
  })
);

export const assignHostelAsync = createAsyncThunk('role/assignHostelAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/staff/assign-hostel',
    method: 'post',
    data,
  })
);

export const getAssignedHostelAsync = createAsyncThunk('role/getAssignedHostelAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/staff/get-assign-hostel',
    method: 'post',
    data,
  })
);

export const getComplaintCategoryAsync = createAsyncThunk('staff/getComplaintCategory', async (_, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/complaint-category',
    method: 'post',
  })
);
