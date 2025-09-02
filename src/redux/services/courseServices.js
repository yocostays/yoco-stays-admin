import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getCourseAsync = createAsyncThunk('course/getCourseAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/course',
    method: 'get',
    params,
  })
);

export const getCourseByIDAsync = createAsyncThunk('course/getCourseByIDAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/course/${id}`,
    method: 'get',
  })
);

export const addCourseAsync = createAsyncThunk('course/addCourseAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/course/create',
    method: 'post',
    data,
  })
);

export const updateCourseAsync = createAsyncThunk('course/updateCourseAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/course/update/${id}`,
    method: 'patch',
    data,
  })
);


export const deleteCourseAsync = createAsyncThunk('role/deleteStaffAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/course/delete/${id}`,
    method: 'delete',
  })
);
