import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const getHostelListAsync = createAsyncThunk('hostel/getHostelListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel',
    method: 'get',
    params,
  })
);

export const getHostelByIDAsync = createAsyncThunk('hostel/getHostelByIDAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url:`api/hostel/${id}` ,
    method: 'get',
    
  })
);

export const addHostelAsync = createAsyncThunk('hostel/addHostelAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/create',
    method: 'post',
    data,
  })
);


export const updateHostelAsync = createAsyncThunk('hostel/updateHostelAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/hostel/update/${id}`,
    method: 'patch',
    data,
  })
);


export const deleteHostelAsync = createAsyncThunk('hostel/deleteHostelAsync', async ({id, data}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `api/hostel/delete/${id}`,
    method: 'post',
    data
  })
);

export const createRoomMapAsync = createAsyncThunk('hostel/createRoomMapAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/rooms/configuration',
    method: 'post',
    data,
  })
);

export const getRoomMapAsync = createAsyncThunk('hostel/getRoomMapAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/fetch-mapped-room',
    method: 'post',
    data,
  })
);

export const getBedTypeAsync = createAsyncThunk('hostel/getBedTypeAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/bedTypes',
    method: 'post',
    data,
  })
);

export const getRoomNo = createAsyncThunk('hostel/getRoomNo', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/bed-type/rooms',
    method: 'post',
    data,
  })
);


export const getVacantRoom = createAsyncThunk('hostel/getVacantRoom', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/vacant-room-details',
    method: 'post',
    data,
  })
);


// Dining And Mess Update 
export const updateDiningAndMessAsync = createAsyncThunk('hostel/updateDiningAndMess', async ( data , toolkit) =>
  AxiosClient({
    toolkit,
    url: `/api/hostel/update-mess`,
    method: 'patch',
    data,
  })
);


export const getDiningAndMessDataAsync = createAsyncThunk('hostel/getDiningAndMessData', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/fetch-mess',
    method: 'post',
    data,
  })
);

// Upload Legal Document 
export const uploadLegalDocumentsAsync = createAsyncThunk('hostel/uploadLegalDocuments', async ( data , toolkit) =>
  AxiosClient({
    toolkit,
    url: `/api/hostel/upload-documents`,
    method: 'patch',
    data,
  })
);

export const getLegalDocumentsAsync = createAsyncThunk('hostel/getLegalDocuments', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/hostel/documents',
    method: 'post',
    data,
  })
);

export const getHostelListDD = createAsyncThunk('hostel/getHostelListDD', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: 'api/staff/get-assign-hostel',
    method: 'post',
    data,
  })
);