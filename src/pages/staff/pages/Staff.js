import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffByIDAsync } from '@redux/services';
import { StaffForm } from '../components';

export default function Staff() {
  const dispatch = useDispatch()
  const { themeStretch } = useSettingsContext();
  const { isIdLoading, staffById } = useSelector((store) => store?.staff)

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Staff: Edit | YOCO',
        heading: 'Edit Staff',
        user: state?.heading ?? 'Edit Staff',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Staff: View | YOCO',
        heading: 'View Staff',
        user: state?.heading ?? 'View Staff',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Staff: Create | YOCO',
      heading: 'Create Staff',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getStaffByIDAsync(id))
    }
  }, [dispatch, id])

  return (
    <>
      <Helmet>
        <title>{editView?.title ?? ''}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={editView?.heading ?? ''}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Staff List',
              href: PATH_DASHBOARD.staff.list,
            },
            { name: editView?.user },
          ]}
        />
        <StaffForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          loading={isIdLoading}
          currentStaff={(editView?.isEdit || editView?.isView) ? staffById : {}} />
      </Container>
    </>
  );
}
