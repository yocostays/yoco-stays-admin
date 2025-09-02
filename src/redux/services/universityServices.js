import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getUniversityListAsync = createAsyncThunk('university/getUniversityList', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/university',
    method: 'get',
    params,
  })
);

export const getUniversityByIDAsync = createAsyncThunk('university/getUniversityByID', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/university/${id}`,
    method: 'get',
  })
);

export const addUniversityAsync = createAsyncThunk('university/addUniversity', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/university/create',
    method: 'post',
    data,
  })
);

export const updateUniversityAsync = createAsyncThunk('course/updateUniversityAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/university/update/${id}`,
    method: 'patch',
    data,
  })
);


export const deleteUniversityAsync = createAsyncThunk('role/deleteStaffAsync', async ({id, data}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/university/delete/${id}`,
    method: 'post',
    data
  })
);
