import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getTemplateListAsync = createAsyncThunk(
  'template/getTemplateList',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: 'api/template',
      method: 'get',
      params,
    })
);

export const getTemplateByIDAsync = createAsyncThunk(
  'template/getTemplateByID',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `api/template/${id}`,
      method: 'get',
    })
);

export const addTemplateAsync = createAsyncThunk('template/addTemplate', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/template/create',
    method: 'post',
    data,
  })
);

export const updateTemplateAsync = createAsyncThunk(
  'template/updateTemplate',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `api/template/update/${id}`,
      method: 'patch',
      data,
    })
);

export const deleteTemplateAsync = createAsyncThunk(
  'template/deleteTemplate',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `api/template/delete/${id}`,
      method: 'delete',
    })
);
