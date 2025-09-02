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

ComplainForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentComplain: PropTypes.object,
};

export default function ComplainForm({ isEdit = false, isView = false, currentComplain }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const ComplainSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hostel: Yup.string().required('Hostel is required'),
    floor: Yup.string().required('Floor No. is required'),
    timestamp: Yup.string().required('Time Stamp is required'),
    ticketid: Yup.string().required('Ticket ID is required'),
    timeToResolve: Yup.string().required('Type is required'),
    type: Yup.string().required('Time To Resolve is required'),
    assignTo: Yup.string().required('Assign To is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentComplain?.name || '',
      hostel: currentComplain?.hostel || '',
      floor: currentComplain?.floor || '',
      timestamp: currentComplain?.timestamp || '',
      ticketid: currentComplain?.ticketid || '',
      timeToResolve: currentComplain?.timeToResolve || '',
      type: currentComplain?.type || '',
      assignTo: currentComplain?.assignTo || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentComplain]
  );

  const methods = useForm({
    resolver: yupResolver(ComplainSchema),
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
    if ((isEdit && currentComplain) || (isView && currentComplain)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentComplain]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        isEdit ? updateUserAsync({ id: currentComplain?.id, data }) : addUserAsync(data)
      );
      // If response is a success -
      reset();
      enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
      navigate(PATH_DASHBOARD.maintenance.list);
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
            <RHFTextField disabled={isView} name="ticketid" label="Ticket ID" />
            <RHFTextField disabled={isView} name="name" label="Full Name" />
            <RHFTextField disabled={isView} name="hostel" label="Hostel" /> 
            <RHFTextField disabled={isView} name="floor" label="Floor No." /> 
            <RHFTextField disabled={isView} name="timestamp" label="Time Stamp" />
            <RHFTextField disabled={isView} name="timeToResolve" label="Time To Resolve" />
            <RHFTextField disabled={isView} name="type" label="Type" />
            <RHFTextField disabled={isView} name="assignTo" label="Assogn To" />
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
                  {!isEdit ? 'Create Maintenance' : 'Save Changes'}
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
