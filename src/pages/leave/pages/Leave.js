import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import LeaveForm from '@pages/leave/components/LeaveForm';

export default function LeaveCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Leave: Edit | YOCO',
        heading: 'Edit Leave',
        leave: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Leave: View | YOCO',
        heading: 'View Leave',
        leave: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Leave: Create | YOCO',
      heading: 'Create Leave',
      leave: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

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
              name: 'Leave',
              href: PATH_DASHBOARD.leave.list,
            },
            { name: editView?.leave },
          ]}
        />
        <LeaveForm isEdit={editView?.isEdit} isView={editView?.isView} currentLeave={state ?? {}}/>
      </Container>
    </>
  );
}
