import { Navigate, useRoutes } from 'react-router-dom';

import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';

import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';

import { PATH_AFTER_LOGIN } from '../config-global';

import {
  LoginPage,
  Page404,
  Home,
  BulkUploadList,
  Role,
  RoleList,
  RolePermissionList,
  Hostel,
  HostelList,
  RoomMapping,
  Staff,
  StaffList,
  UserList,
  User,
  MessList,
  Mess,
  Leave,
  LeaveList,
  Complain,
  ComplainList,
  CourseList,
  Course,
  AmenitiesList,
  Amenities,
  UniversityList,
  University,
  LegalDocument,
  DiningAndMessForm,
  TemplateList,
  TemplateNewList,
  Template,
  NoticeList,
  Notice,
  CreateCategory,
  ViewHostelTemplate
} from './elements';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <User /> },
            { path: ':id/edit', element: <User /> },
            { path: ':id/view', element: <User /> },
          ],
        },
        { path: 'main', element: <Home />, index: true },
        {
          path: 'bulkUpload',
          children: [
            { element: <Navigate to="/dashboard/bulkupload/list" replace />, index: true },
            { path: 'list', element: <BulkUploadList /> },
            // { path: 'new', element: <Mess /> },
            // { path: ':id/edit', element: <Mess /> },
            // { path: ':id/view', element: <Mess /> },
          ],
        },
        {
          path: 'master',
          children: [
            {
              path: 'role',
              children: [
                { element: <Navigate to="/dashboard/master/role/list" replace />, index: true },
                { path: 'list', element: <RoleList /> },
                { path: 'new', element: <Role /> },
                { path: ':id/edit', element: <Role /> },
                { path: ':id/view', element: <Role /> },
                { path: ':id/permission', element: <RolePermissionList /> },
              ],
            },

            {
              path: 'course',
              children: [
                { element: <Navigate to="/dashboard/master/course/list" replace />, index: true },
                { path: 'list', element: <CourseList /> },
                { path: 'new', element: <Course /> },
                { path: ':id/edit', element: <Course /> },
                { path: ':id/view', element: <Course /> },
              ],
            },

            {
              path: 'staff',
              children: [
                { element: <Navigate to="/dashboard/master/staff/list" replace />, index: true },
                { path: 'list', element: <StaffList /> },
                { path: 'new', element: <Staff /> },
                { path: ':id/edit', element: <Staff /> },
                { path: ':id/view', element: <Staff /> },
              ],
            },

            {
              path: 'amenities',
              children: [
                {
                  element: <Navigate to="/dashboard/master/amenities/list" replace />,
                  index: true,
                },
                { path: 'list', element: <AmenitiesList /> },
                { path: 'new', element: <Amenities /> },
                { path: ':id/edit', element: <Amenities /> },
                { path: ':id/view', element: <Amenities /> },
              ],
            },
          ],
        },

        {
          path: 'hostel',
          children: [
            {
              path: 'addhostel',
              children: [
                {
                  element: <Navigate to="/dashboard/hostel/addhostel/list" replace />,
                  index: true,
                },
                { path: 'list', element: <HostelList /> },
                { path: 'new', element: <Hostel /> },
                { path: ':id/edit', element: <Hostel /> },
                { path: ':id/view', element: <Hostel /> },
                { path: ':id/roommap', element: <RoomMapping /> },
                { path: ':id/legalDocument', element: <LegalDocument /> },
                { path: ':id/diningmess', element: <DiningAndMessForm /> },
              ],
            },
          ],
        },
        {
          path: 'mess',
          children: [
            { element: <Navigate to="/dashboard/mess/list" replace />, index: true },
            { path: 'list', element: <MessList /> },
            { path: 'new', element: <Mess /> },
            { path: ':id/edit', element: <Mess /> },
            { path: ':id/view', element: <Mess /> },
          ],
        },
        {
          path: 'leave',
          children: [
            { element: <Navigate to="/dashboard/leave/list" replace />, index: true },
            { path: 'list', element: <LeaveList /> },
            { path: 'new', element: <Leave /> },
            { path: ':id/edit', element: <Leave /> },
            { path: ':id/view', element: <Leave /> },
          ],
        },
        {
          path: 'maintenance',
          children: [
            {
              path: 'complain',
              children: [
                {
                  element: <Navigate to="/dashboard/maintenance/complain/list" replace />,
                  index: true,
                },
                { path: 'list', element: <ComplainList /> },
                { path: 'new', element: <Complain /> },
                { path: ':id/edit', element: <Complain /> },
                { path: ':id/view', element: <Complain /> },
              ],
            },
          ],
        },

        {
          path: 'university',
          children: [
            { element: <Navigate to="/dashboard/university/list" replace />, index: true },
            { path: 'list', element: <UniversityList /> },
            { path: 'new', element: <University /> },
            { path: ':id/edit', element: <University /> },
            { path: ':id/view', element: <University /> },
          ],
        },

        {
          path: 'template',
          children: [
            { element: <Navigate to="/dashboard/template/new_list" replace />, index: true },
            { path: 'new_list', element: <TemplateNewList /> },
            // { path: 'list', element: <TemplateList /> },
            { path: 'new', element: <Template /> },
            { path: ':id/hostel', element: <ViewHostelTemplate /> },
            { path: ':id/edit', element: <Template /> },
            { path: ':id/view', element: <Template /> },
            { path: 'category', element: <CreateCategory /> },
          ],
        },
        {
          path: 'notice',
          children: [
            { element: <Navigate to="/dashboard/notice/list" replace />, index: true },
            { path: 'list', element: <NoticeList /> },
            { path: 'new', element: <Notice /> },
            { path: ':id/edit', element: <Notice /> },
            { path: ':id/view', element: <Notice /> },
          ],
        }
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
