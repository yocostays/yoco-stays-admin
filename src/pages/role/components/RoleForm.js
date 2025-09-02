import FormProvider, { RHFAutocomplete, RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, CircularProgress } from '@mui/material';
import { addRoleAsync, updateRoleAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

RoleForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  isLoading: PropTypes.bool,
  currentRole: PropTypes.object,
};

export default function RoleForm({ isEdit = false, isView = false, currentRole, isLoading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSubmitting } = useSelector((state) => state?.role);

  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Role is required'),
    category: Yup.object().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentRole?.name || '',
      category: ComplaintTypes.find((option) => option.value === currentRole?.categoryType) || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if ((isEdit && currentRole) || (isView && currentRole)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentRole]);

  const onSubmit = async (data) => {
    const payload = {
      name : data?.name,
      categoryType : data?.category?.value,
    }
    try {
      const response = await dispatch(
        isEdit ? updateRoleAsync({ id: currentRole?._id, data: payload }) : addRoleAsync(payload)
      );
      // If response is a success -
      if (response?.payload?.statusCode === 200) {
        reset();
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.role.list);
      } else {
        enqueueSnackbar(response?.payload?.message, { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if ((isEdit && currentRole) || (isView && currentRole)) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole, isEdit, isView]);

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
                <RHFTextField disabled={isView} name="name" label="Role" />
                <RHFAutocomplete
                  disabled={isView}
                  name="category"
                  label="Category"
                  options={ComplaintTypes || []}
                />
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

const ComplaintTypes = [
  { label: 'Warden', value: 'warden',},
  { label: 'Security', value: 'security' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Mess', value: 'mess' },
];
