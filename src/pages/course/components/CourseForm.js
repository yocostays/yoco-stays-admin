import FormProvider, { RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, CircularProgress } from '@mui/material';
import { addCourseAsync, updateCourseAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

CourseForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  isLoading: PropTypes.bool,
  currentCourse: PropTypes.object,
};

export default function CourseForm({ isEdit = false, isView = false, currentCourse, isLoading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSubmitting } = useSelector((state => state?.course))

  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Course is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCourse?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCourse]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if ((isEdit && currentCourse) || (isView && currentCourse)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentCourse]);

  const onSubmit = async (data) => {
    const payload = {
      name: data?.name, 
    };
  
    try {
      const response = await dispatch(
        isEdit ? updateCourseAsync({ id: currentCourse?._id, data: payload }) : addCourseAsync(payload)
      );
      if (response?.payload?.statusCode === 200) {
        reset();
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.course.list);
      } else {
        enqueueSnackbar(response?.payload?.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (currentCourse && (isEdit || isView)) {
      reset(defaultValues);
    }
  }, [currentCourse, isEdit, isView, reset, defaultValues]);
  

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '30vh',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField disabled={isView} name="name" label="Course" />
              </Box>

              {isView ? (
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton onClick={handleBack} type="button" variant="contained">
                    Back
                  </LoadingButton>
                </Stack>
              ) : (
                <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create' : 'Save Changes'}
                  </LoadingButton>

                  {isEdit && (
                    <LoadingButton
                      onClick={handleBack}
                      type="button"
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </LoadingButton>
                  )}
                </Stack>
              )}
            </>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
