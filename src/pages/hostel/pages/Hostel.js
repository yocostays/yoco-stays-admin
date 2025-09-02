import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { CircularProgress, Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getHostelByIDAsync } from '@redux/services';
import HostelForm from '../components/HostelForm';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { isDetailLoading, hostelByID } = useSelector((store) => store?.hostel);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Hostel: Edit | YOCO',
        heading: 'Edit Hostel',
        user: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Hostel: View | YOCO',
        heading: 'View Hostel',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    if (id && /roommap/i?.test(pathname)) {
      return {
        title: 'Hostel: Mapping | YOCO',
        heading: 'Hostel Mapping',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Hostel: Create | YOCO',
      heading: 'Create Hostel',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getHostelByIDAsync(id));
    }
  }, [dispatch, id]);

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
              name: 'Hostel List',
              href: PATH_DASHBOARD.addhostel.list,
            },
            { name: editView?.user },
          ]}
        />
        {isDetailLoading ? 
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '30vh',
            }}
          >
            <CircularProgress />
          </div> : 

          <HostelForm
            isEdit={editView?.isEdit}
            isView={editView?.isView}
            currentHostel={editView?.isEdit || editView?.isView ? hostelByID : {}}
          />
        }
      </Container>
    </>
  );
}
