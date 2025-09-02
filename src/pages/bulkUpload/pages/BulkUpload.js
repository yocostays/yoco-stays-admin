import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getRoleByIDAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { BulkUploadForm } from '../components';

export default function BulkUploadPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const dispatch = useDispatch();
  const {roleById, isLoading} = useSelector((store) => store?.role)

  // console.log('state', state)   //required later

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Role: Edit | YOCO',
        heading: 'Edit Role',
        user: state?.heading ?? 'Edit Role',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Role: View | YOCO',
        heading: 'View Role',
        user: state?.heading ?? 'View Role',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Role: Create | YOCO',
      heading: 'Create Role',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getRoleByIDAsync(id))
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
              name: 'Bulk Upload',
              href: PATH_DASHBOARD.bulkUpload.list,
            },
            { name: editView?.user },
          ]}
        />
        <BulkUploadForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          isLoading={isLoading}
          currentRole={(editView?.isEdit || editView?.isView) ? roleById : {}} />
      </Container>
    </>
  );
}
