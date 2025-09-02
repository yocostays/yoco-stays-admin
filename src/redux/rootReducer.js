import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth';
import productReducer from './slices/product';
import usersReducer from './slices/users';
import roleReducer from './slices/roleSlice';
import hostelReducer from './slices/hostelSlice';
import staffReducer from './slices/staffSlice';
import messReducer from './slices/messSlice';
import permissionReducer from './slices/permissionsSlice';
import bulkUploadReducer from './slices/bulkUploadSlice';
import courseReducer from './slices/courseSlices';
import universityReducer from './slices/universitySlice'
import amenitiesReducer from './slices/amenitiesSlice';
import floorReducer from './slices/floorSlice';
import roomsReducer from './slices/roomSlice';
import templateReducer from './slices/templateSlice';
import noticeReducer from './slices/noticeslice';

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  permission: permissionReducer,
  users: usersReducer,
  product: persistReducer(productPersistConfig, productReducer),
  role: roleReducer,
  hostel: hostelReducer,
  staff: staffReducer,
  mess: messReducer,
  bulkUpload: bulkUploadReducer,  
  course: courseReducer,
  university: universityReducer,
  amenities: amenitiesReducer,
  floors: floorReducer,
  rooms: roomsReducer,
  template: templateReducer,
  notice: noticeReducer,
});

export default rootReducer;
