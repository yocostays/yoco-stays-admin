import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// import { getNotificationByIdAsync } from '@redux/services';
import PushNotificationForm from '../components/NoticeForm';

export default function Notice() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

//   const { notificationById } = useSelector((state) => state.notification);

  const { id } = useParams();
  const { pathname = '' } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Notice : Edit | MKC',
        breadcrumbs: 'Edit Notice',
        heading: 'Edit a Notice',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Notice : View | MKC',
        breadcrumbs: 'View Notice',
        heading: 'View a Notice',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Notice : Create | MKC',
      breadcrumbs: 'New Notice',
      heading: 'Create a new Notice',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) {
    //   dispatch(getNotificationByIdAsync({ id }));
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{editView?.title ?? ''}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={editView?.heading}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.main,
            },
            {
              name: 'Notice',
              href: PATH_DASHBOARD.notice.root,
            },
            { name: editView?.breadcrumbs },
          ]}
        />
        <PushNotificationForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentNotification={ {}}
        />
      </Container>
    </>
  );
}
