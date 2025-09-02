// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  chatbot: icon('chatbot'),
  master: icon('master'),
  dashboard: icon('dashboard'),
  hostel: icon('hostel'),
  user: icon('user'),
  mess: icon('mess'),
  leave: icon('leave'),
  maintenance: icon('maintenance'),
  bulkUpload: icon('bulkUpload'),
  university: icon('university'),
  notice: icon('notice'),
};

const navConfig = [
  {
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.main.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'Bulk Upload',
        path: PATH_DASHBOARD.bulkUpload.root,
        icon: ICONS.bulkUpload,
      },
      {
        title: 'User',
        path: PATH_DASHBOARD.users.root,
        icon: ICONS.user,
      },
      {
        title: 'Leave',
        path: PATH_DASHBOARD.leave.root,
        icon: ICONS.leave,
      },
      {
        title: 'University',
        path: PATH_DASHBOARD.university.root,
        icon: ICONS.university,
      },
      {
        title: 'Maintenance',
        path: PATH_DASHBOARD.maintenance.root,
        icon: ICONS.maintenance,
        children: [
         {
          title: "Complain",
          path: PATH_DASHBOARD.complain.root,
         }
        ]
      },
      {
        title: 'Master',
        path: PATH_DASHBOARD.master.root,
        icon: ICONS.master,
        children: [
          {
            title: 'Role',
            path: PATH_DASHBOARD.role.root,
          },
          {
            title: 'Staff',
            path: PATH_DASHBOARD.staff.root,
          },
          {
            title: 'Course',
            path: PATH_DASHBOARD.course.root,
          },
          {
            title: 'Amenities',
            path: PATH_DASHBOARD.amenities.root,
          },
        ]
      },
      {
        title: 'Hostel',
        path: PATH_DASHBOARD.hostel.root,
        icon: ICONS.hostel,
        children: [
          {
            title: 'Add Hostel',
            path: PATH_DASHBOARD.addhostel.root,
          },
         
        ],
      },
      {
        title: 'Mess',
        path: PATH_DASHBOARD.mess.root,
        icon: ICONS.mess,
      },
            {
        title: 'Template',
        path: PATH_DASHBOARD.template.root,
        icon: ICONS.master,
      },
      {
        title: 'Notice',
        path: PATH_DASHBOARD.notice.root,
        icon: ICONS.notice,
      },
    ]
  },
];

export default navConfig;
