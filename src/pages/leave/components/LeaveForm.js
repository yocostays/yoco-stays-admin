import FormProvider, { RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { addUserAsync, updateUserAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

LeaveForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentLeave: PropTypes.object,
};

export default function LeaveForm({ isEdit = false, isView = false, currentLeave }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const LeaveSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    checkin: Yup.string().required('Check-In is required'),
    checkout: Yup.string().required('Check-Out is required'),
    phone: Yup.string().required('Phone number is required'),
    yocoid: Yup.string().required('YOCO ID is required'),
    roomNo: Yup.object()
      .shape({
        name: Yup.string().required('Room No. is required'),
      })
      .required('Room details are required'),
      email: Yup.string()
      .email('Invalid email address')
      .matches(/\.com$/, 'Email must end with .com')
      .required('Email is required'), 
  });

  const defaultValues = useMemo(
    () => ({
      name: currentLeave?.name || '',
      checkin: currentLeave?.checkin || '',
      checkout: currentLeave?.checkin || '',
      phone: currentLeave?.phone || '',
      email: currentLeave?.email || '',
      yocoid: currentLeave?.yocoid || '',
      roomNo: currentLeave?.roomNo || {},
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLeave]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if ((isEdit && currentLeave) || (isView && currentLeave)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentLeave]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        isEdit ? updateUserAsync({ id: currentLeave?.id, data }) : addUserAsync(data)
      );
      // If response is a success -
      reset();
      enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
      navigate(PATH_DASHBOARD.leave.list);
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField disabled={isView} name="yocoid" label="YOCO ID" />
            <RHFTextField disabled={isView} name="name" label="Full Name" />
            <RHFTextField disabled={isView} name="email" label="Email" />
            <RHFTextField disabled={isView} name="roomNo.name" label="Room No." />
            <RHFTextField disabled={isView} name="phone" label="Phone Number" />
            {/* PLease Add Date Calender */}
            <RHFTextField disabled={isView} name="checkin" label="Check-in" /> 
            <RHFTextField disabled={isView} name="checkout" label="Check-Out" /> 
          </Box>

          {isView ? (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={handleBack} type="button" variant="contained">
                Back
              </LoadingButton>
            </Stack>
          ) : (
            <>
              <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Leave' : 'Save Changes'}
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
            </>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
