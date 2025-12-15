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

export const getTemplateNewListAsync = createAsyncThunk(
  'template/getTemplateNewListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/api/template/hostel-templates/details',
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

export const createCategoryAsync = createAsyncThunk(
  'template/createtemplateCategory',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/create-category`,
      method: 'post',
      data
    })
);

export const getTemplateCategoryAsync = createAsyncThunk(
  'template/templateCategory',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/get-categories`,
      method: 'get',
    })
);

export const getHostelTemplateCategoryAsync = createAsyncThunk(
  'template/templateHostelCategory',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/hostel/${id}/categories`,
      method: 'get',
    })
);

export const addHostelTemplateCategoryAsync = createAsyncThunk(
  'template/addHostelTemplateCategory',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/hostel/add-subcategory`,
      method: 'post',
      data
    })
);

export const deleteTemplateCategoryAsync = createAsyncThunk(
  'template/deleteCategory',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/delete-category/${id}`,
      method: 'delete',
    })
);

export const creatTemplateSubCategoryAsync = createAsyncThunk(
  'template/createSubcategories',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/create-subcategories`,
      method: 'post',
      data
    })
);

export const deleteTemplateSubCategory = createAsyncThunk(
  'template/deleteTemplateSubCategory',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/api/template/delete-subcategory`,
      method: 'delete',
      data
    })
);


