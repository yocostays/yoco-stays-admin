import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { MessForm } from '../components';

export default function Mess() {
  const dispatch = useDispatch()
  const { themeStretch } = useSettingsContext();
  const { isIdLoading } = useSelector((store) => store?.staff)

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Mess: Edit | YOCO',
        heading: 'Edit Mess',
        user: state?.heading ?? 'Edit Mess',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Mess: View | YOCO',
        heading: 'View Mess',
        user: state?.heading ?? 'View Mess',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Mess: Create | YOCO',
      heading: 'Create Mess',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      // dispatch(getMessByIDAsync(id))
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
              name: 'Mess List',
              href: PATH_DASHBOARD.mess.list,
            },
            { name: editView?.user },
          ]}
        />
        <MessForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          loading={isIdLoading}
          currentStaff={(editView?.isEdit || editView?.isView) ? {} : {}} />
      </Container>
    </>
  );
}
