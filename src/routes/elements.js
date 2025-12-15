import LoadingScreen from '@components/loading-screen';
import { Suspense, lazy } from 'react';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

export const LoginPage = Loadable(lazy(() => import('@pages/auth/pages/LoginPage')));
export const Home = Loadable(lazy(() => import('@pages/home/pages/Home')));

// Role
export const RoleList = Loadable(lazy(() => import('@pages/role/pages/RoleList')));
export const Role = Loadable(lazy(() => import('@pages/role/pages/Role')));
export const RolePermissionList = Loadable(
  lazy(() => import('@pages/rolepermission/pages/RolePermissionList'))
);

// Staff
export const StaffList = Loadable(lazy(() => import('@pages/staff/pages/StaffList')));
export const Staff = Loadable(lazy(() => import('@pages/staff/pages/Staff')));

// Hostel
export const Hostel = Loadable(lazy(() => import('@pages/hostel/pages/Hostel')));
export const HostelList = Loadable(lazy(() => import('@pages/hostel/pages/HostelList')));
export const RoomMapping = Loadable(lazy(() => import('@pages/hostel/components/RoomMapping')));
export const LegalDocument = Loadable(lazy(() => import('@pages/hostel/components/LegalDocument')));
export const DiningAndMessForm = Loadable(
  lazy(() => import('@pages/hostel/components/DiningAndMessForm'))
);

// User
export const User = Loadable(lazy(() => import('@pages/users/pages/User')));
export const UserList = Loadable(lazy(() => import('@pages/users/pages/UserList')));

// Mess
export const Mess = Loadable(lazy(() => import('@pages/mess/pages/Mess')));
export const MessList = Loadable(lazy(() => import('@pages/mess/pages/MessList')));

// Leave
export const Leave = Loadable(lazy(() => import('@pages/leave/pages/Leave')));
export const LeaveList = Loadable(lazy(() => import('@pages/leave/pages/LeaveList')));

// complaint
export const Complain = Loadable(lazy(() => import('@pages/complain/pages/Complain')));
export const ComplainList = Loadable(lazy(() => import('@pages/complain/pages/ComplainList')));

// Bulk Upload
export const BulkUploadList = Loadable(
  lazy(() => import('@pages/bulkUpload/pages/BulkUploadList'))
);

// Course
export const CourseList = Loadable(lazy(() => import('@pages/course/pages/CourseList')));
export const Course = Loadable(lazy(() => import('@pages/course/pages/Course')));
// Amenities
export const AmenitiesList = Loadable(lazy(() => import('@pages/amenities/pages/AmenitiesList')));
export const Amenities = Loadable(lazy(() => import('@pages/amenities/pages/Amenities')));

// Course
export const UniversityList = Loadable(
  lazy(() => import('@pages/university/pages/UniversityList'))
);
export const University = Loadable(lazy(() => import('@pages/university/pages/University')));
export const NoticeList = Loadable(lazy(() => import('@pages/notice/pages/NoticeList')));
export const Notice = Loadable(lazy(() => import('@pages/notice/pages/Notice')));
// Template
export const TemplateList = Loadable(lazy(() => import('@pages/template/pages/TemplateList')));
export const TemplateNewList = Loadable(lazy(() => import('@pages/template/pages/TemplateNewList')));
export const ViewHostelTemplate = Loadable(lazy(() => import('@pages/template/pages/ViewHostelTemplate')));
export const Template = Loadable(lazy(() => import('@pages/template/pages/Template')));
export const CreateCategory = Loadable(lazy(()=> import('@pages/template/components/CrateCategory')))

export const Page404 = Loadable(lazy(() => import('@pages/Page404')));
