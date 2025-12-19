import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Box, Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getTemplateByIDAsync } from '@redux/services/templateServices';
import Breadcrumbs from '@components/BreadCumbs/BreadCumbs';
import TemplateForm from '../components/TemplateForm';

export default function Template() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const dispatch = useDispatch();
  const { isIdLoading, getTemplateById } = useSelector((store) => store?.template);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Template: Edit | YOCO',
        heading: 'Edit Template',
        user: state?.heading ?? 'Edit Template',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Template: View | YOCO',
        heading: 'View Template',
        user: state?.heading ?? 'View Template',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Template: Create | YOCO',
      heading: 'Create Template',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  useEffect(() => {
    if (id) {
      dispatch(getTemplateByIDAsync(id));
    }
  }, [dispatch, id]);



  return (
    <>
      <Helmet>
        <title>{editView?.title ?? ''}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Breadcrumbs
          back
          heading="Create Template"
        />
        <TemplateForm />
      </Container>
    </>
  );
}
