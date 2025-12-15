// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  main: {
    root: path(ROOTS_DASHBOARD, '/main'),
  },
  bulkUpload: {
    root: path(ROOTS_DASHBOARD, '/bulkupload'),
  },

  master: {
    root: path(ROOTS_DASHBOARD, '/master'),
  },
  role: {
    root: path(ROOTS_DASHBOARD, '/master/role'),
    list: path(ROOTS_DASHBOARD, '/master/role/list'),
    new: path(ROOTS_DASHBOARD, '/master/role/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/master/role/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/master/role/${id}/view`),
    permission: (id) => path(ROOTS_DASHBOARD, `/master/role/${id}/permission`),
  },

  staff: {
    root: path(ROOTS_DASHBOARD, '/master/staff'),
    list: path(ROOTS_DASHBOARD, '/master/staff/list'),
    new: path(ROOTS_DASHBOARD, '/master/staff/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/master/staff/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/master/staff/${id}/view`),
  },

  course: {
    root: path(ROOTS_DASHBOARD, '/master/course'),
    list: path(ROOTS_DASHBOARD, '/master/course/list'),
    new: path(ROOTS_DASHBOARD, '/master/course/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/master/course/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/master/course/${id}/view`),
  },
  amenities: {
    root: path(ROOTS_DASHBOARD, '/master/amenities'),
    list: path(ROOTS_DASHBOARD, '/master/amenities/list'),
    new: path(ROOTS_DASHBOARD, '/master/amenities/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/master/amenities/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/master/amenities/${id}/view`),
  },

  hostel: {
    root: path(ROOTS_DASHBOARD, '/hostel'),
  },
  addhostel: {
    root: path(ROOTS_DASHBOARD, '/hostel/addhostel'),
    list: path(ROOTS_DASHBOARD, '/hostel/addhostel/list'),
    new: path(ROOTS_DASHBOARD, '/hostel/addhostel/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/hostel/addhostel/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/hostel/addhostel/${id}/view`),
    roommap: (id) => path(ROOTS_DASHBOARD, `/hostel/addhostel/${id}/roommap`),
    legalDocument: (id) => path(ROOTS_DASHBOARD, `/hostel/addhostel/${id}/legalDocument`),
    diningmess: (id) => path(ROOTS_DASHBOARD, `/hostel/addhostel/${id}/diningmess`),
  },

  users: {
    root: path(ROOTS_DASHBOARD, '/user'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/user/${id}/view`),
  },

  mess: {
    root: path(ROOTS_DASHBOARD, '/mess'),
    list: path(ROOTS_DASHBOARD, '/mess/list'),
    new: path(ROOTS_DASHBOARD, '/mess/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/mess/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/mess/${id}/view`),
  },
  leave: {
    root: path(ROOTS_DASHBOARD, '/leave'),
    list: path(ROOTS_DASHBOARD, '/leave/list'),
    new: path(ROOTS_DASHBOARD, '/leave/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/leave/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/leave/${id}/view`),
  },
  maintenance: {
    root: path(ROOTS_DASHBOARD, '/maintenance'),
  },
  complain: {
    root: path(ROOTS_DASHBOARD, '/maintenance/complain'),
    list: path(ROOTS_DASHBOARD, '/maintenance/complain/list'),
    new: path(ROOTS_DASHBOARD, '/maintenance/complain/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/maintenance/complain/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/maintenance/complain/${id}/view`),
  },

  university: {
    root: path(ROOTS_DASHBOARD, '/university'),
    list: path(ROOTS_DASHBOARD, '/university/list'),
    new: path(ROOTS_DASHBOARD, '/university/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/university/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/university/${id}/view`),
  },

  template: {
    root: path(ROOTS_DASHBOARD, '/template'),
    newlist : path(ROOTS_DASHBOARD,'/template/new_list'),
    list: path(ROOTS_DASHBOARD, '/template/list'),
    new: path(ROOTS_DASHBOARD, '/template/new'),
    category: path(ROOTS_DASHBOARD, '/template/category'),
    edit: (id) => path(ROOTS_DASHBOARD, `/template/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/template/${id}/view`),
    viewTemplate: (id) => path(ROOTS_DASHBOARD, `/template/${id}/hostel`),
  },

   notice: {
    root: path(ROOTS_DASHBOARD, '/notice'),
    list: path(ROOTS_DASHBOARD, '/notice/list'),
    new: path(ROOTS_DASHBOARD, '/notice/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/notice/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/notice/${id}/view`),
  },
};
