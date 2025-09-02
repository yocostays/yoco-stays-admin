import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getCourseByIDAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import CourseForm from '../components/CourseForm';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const dispatch = useDispatch();
  const { courseListById } = useSelector((store) => store?.course)
  
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Course: Edit | YOCO',
        heading: 'Edit Course',
        user: state?.heading ?? 'Edit Course',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Course: View | YOCO',
        heading: 'View Course',
        user: state?.heading ?? 'View Course',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Course: Create | YOCO',
      heading: 'Create Course',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getCourseByIDAsync(id))
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
              name: 'Course',
              href: PATH_DASHBOARD.course.list,
            },
            { name: editView?.user },
          ]}
        />
        
        <CourseForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentCourse={(editView?.isEdit || editView?.isView) ? courseListById : {}} 
          />

      </Container>
    </>
  );
}
