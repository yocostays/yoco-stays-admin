import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { PATH_DASHBOARD } from '@routes/paths';
import { getAmenitiesByIDAsync } from '@redux/services/amenitiesServices';
import { useDispatch, useSelector } from 'react-redux';
import AmenitiesForm from '../components/AmenitiesForm';



export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const dispatch = useDispatch();
  const { isLoading, amenitiesListById } = useSelector((store) => store?.amenities)
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Amenities: Edit | YOCO',
        heading: 'Edit Amenities',
        user: state?.heading ?? 'Edit Amenities',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Amenities: View | YOCO',
        heading: 'View Amenities',
        user: state?.heading ?? 'View Amenities',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Amenities: Create | YOCO',
      heading: 'Create Amenities',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getAmenitiesByIDAsync(id))
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
              name: 'Amenities',
              href: PATH_DASHBOARD.amenities.list,

            },
            { name: editView?.user },
          ]}
        />
        
        <AmenitiesForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          isLoading={isLoading}
          currentamenities={(editView?.isEdit || editView?.isView) ? amenitiesListById : {}} 
          />

      </Container>
    </>
  );
}
