import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const getBulkFiles = createAsyncThunk('bulkUpload/getBulkFiles', async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: 'api/bulk-upload',
      method: 'get',
      params,
    })
  );