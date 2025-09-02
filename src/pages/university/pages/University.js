import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getUniversityByIDAsync } from '@redux/services/universityServices';
import UniversityForm from '../components/UniversityForm';

const University = () => {
      const { themeStretch } = useSettingsContext();
    
      const { id } = useParams();
      const { pathname = '', state } = useLocation();
      
      const dispatch = useDispatch();
      const {getUniversityByID} = useSelector((store) => store?.university)
        
      const editView = useMemo(() => {
        if (id && /edit/i?.test(pathname)) {
          return {
            title: 'University: Edit | YOCO',
            heading: 'Edit University',
            user: state?.heading ?? 'Edit University',
            isEdit: true,
            isView: false,
          };
        }
        if (id && /view/i?.test(pathname)) {
          return {
            title: 'University: View | YOCO',
            heading: 'View University',
            user: state?.heading ?? 'View University',
            isEdit: false,
            isView: true,
          };
        }
        return {
          title: 'University: Create | YOCO',
          heading: 'Create University',
          user: 'New',
          isEdit: false,
          isView: false,
        };
      }, [pathname, id, state]);
    
      useEffect(() => {
        if (id) {
          dispatch(getUniversityByIDAsync(id))
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
                  name: 'University',
                  href: PATH_DASHBOARD.university.list,
                },
                { name: editView?.user },
              ]}
            />
            
            <UniversityForm
              isEdit={editView?.isEdit}
              isView={editView?.isView}
              currentUniversity={
                (editView?.isEdit || editView?.isView) ? getUniversityByID : {} } 
              />
    
          </Container>
        </>
  )
}

export default University
