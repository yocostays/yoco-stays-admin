import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getAmenitiesAsync = createAsyncThunk('course/getAmenitiesAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/amenitie',
    method: 'get',
    params,
  })
);

export const getAmenitiesByIDAsync = createAsyncThunk('course/getAmenitiesByIDAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/amenitie/${id}`,
    method: 'get',
  })
);

export const addAmenitiesAsync = createAsyncThunk('course/addAmenitiesAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/amenitie/create',
    method: 'post',
    data,
  })
);

export const updateAmenitiesAsync = createAsyncThunk('course/updateAmenitiesAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/amenitie/update/${id}`,
    method: 'patch',
    data,
  })
);


export const deleteAmenitiesAsync = createAsyncThunk('role/deleteAmenitiesAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/amenitie/delete/${id}`,
    method: 'delete',
  })
);
