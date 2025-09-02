import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getAllRoutesAsync, createPermissions, getPermissionByID } from '@redux/services';

const initialState = {
    isLoading: false,
    isSubmitting: false,
    allRoutes: [],
    permissionByRoleId: [],
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    extraReducers: (builder) => {
        // get all routes ----------
        builder.addMatcher(isAnyOf(getAllRoutesAsync.pending), (state, { payload }) => {
            state.isLoading = true;
        });
        builder.addMatcher(isAnyOf(getAllRoutesAsync.fulfilled), (state, { payload }) => {
            state.isLoading = false;
            state.allRoutes = payload?.data;
        });
        builder.addMatcher(isAnyOf(getAllRoutesAsync.rejected), (state, { payload }) => {
            state.isLoading = false;
        });
        // -------------

        // get all routes ----------
        builder.addMatcher(isAnyOf(createPermissions.pending), (state) => {
            state.isSubmitting = true;
        });
        builder.addMatcher(isAnyOf(createPermissions.fulfilled), (state) => {
            state.isSubmitting = false;
        });
        builder.addMatcher(isAnyOf(createPermissions.rejected), (state) => {
            state.isSubmitting = false;
        });
        // -------------

        // get all routes ----------
        builder.addMatcher(isAnyOf(getPermissionByID.pending), (state) => {
            state.isSubmitting = true;
        });
        builder.addMatcher(isAnyOf(getPermissionByID.fulfilled), (state, { payload }) => {
            state.isSubmitting = false;
            state.permissionByRoleId = payload?.data
        });
        builder.addMatcher(isAnyOf(getPermissionByID.rejected), (state) => {
            state.isSubmitting = false;
        });
        // -------------
    },
});


export default permissionSlice.reducer;
