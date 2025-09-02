import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, CircularProgress, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createMessAsync, getHostelListAsync, updateStaffAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import FormProvider, { RHFAutocomplete, RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

MessForm.propTypes = {
    isEdit: PropTypes.bool,
    isView: PropTypes.bool,
    currentMess: PropTypes.object,
    loading: PropTypes.bool,
};

// Validation Schema
const StaffSchema = Yup.object().shape({
    breakFast: Yup.string().required('BreakFast is required'),
    lunch: Yup.string().required('Lunch is required'),
    snack: Yup.string().required('Snack is required'),
    dinner: Yup.string().required('Dinner is required'),
    toDate: Yup.date().required('To Date is required').nullable(),
    fromDate: Yup.date().required('From Date is required').nullable(),
    hostel: Yup.object()
        .shape({
            label: Yup.string(),
            value: Yup.string().required('Hostel is required'),
        })
        .nullable()
        .required('Hostel is required'),
});

export default function MessForm({ isEdit = false, isView = false, currentMess, loading }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hostelList } = useSelector((store) => store?.hostel)
    const { isSubmitting } = useSelector((store) => store?.mess)
    const { enqueueSnackbar } = useSnackbar();


    const hostelOptions = hostelList?.map((item) => ({
        label: item?.name,
        value: item?._id,
    }));

    // Default values for the form
    const defaultValues = useMemo(
        () => ({
            breakFast: currentMess?.breakFast || '',
            lunch: currentMess?.lunch || '',
            snack: currentMess?.snack || '',
            dinner: currentMess?.dinner || '',
            toDate: currentMess?.toDate || null,
            fromDate: currentMess?.fromDate || null,
        }),
        [currentMess] // Include dependencies to ensure updates when these change
    );

    const methods = useForm({
        resolver: yupResolver(StaffSchema),
        defaultValues,
    });

    const { reset, handleSubmit, control, formState: { errors } } = methods;

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Create a payload object based on form data
            const payload = {
                breakfast: data.breakFast,
                lunch: data.lunch,
                snacks: data.snack,
                dinner: data.dinner,
                toDate: data.toDate,
                fromDate: data.fromDate,
                hostelId: data?.hostel?.value
            };

            console.log('payload', payload)

            // If editing, update the staff information

            if (isEdit) {
                const response = await dispatch(updateStaffAsync({ id: currentMess?._id, data: payload }));

                if (response?.payload?.statusCode === 200) {
                    reset();
                    enqueueSnackbar(response?.payload?.message, { variant: 'success' });
                    navigate(PATH_DASHBOARD.mess.list);
                } else {
                    enqueueSnackbar(response?.payload?.message, { variant: 'error' });
                }
            } else { // If not editing, create a new staff
                const response = await dispatch(createMessAsync(payload));

                if (response?.payload?.statusCode === 200) {
                    reset();
                    enqueueSnackbar(response?.payload?.message, { variant: 'success' });
                    navigate(PATH_DASHBOARD.staff.list);
                } else {
                    enqueueSnackbar(response?.payload?.message, { variant: 'error' });
                }
            }
        } catch (err) {
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
            console.error(err);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Fetch roles and reset form when currentMess or view/edit modes change
    useEffect(() => {
        dispatch(getHostelListAsync({}));
    }, [dispatch]);

    useEffect(() => {
        if ((isEdit && currentMess) || (isView && currentMess)) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMess, isEdit, isView]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Card sx={{ p: 3, width: '100%' }}>
                    {loading ? (
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
                                <RHFAutocomplete
                                    name="hostel"
                                    label="Select Hostel"
                                    options={hostelOptions}
                                    getOptionLabel={(option) => option?.label || ''}
                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                    disabled={isView}
                                />
                                {/* to date */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller
                                        name="toDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="To Date"
                                                value={field.value}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                renderInput={(params) => <TextField {...params} error={!!errors.toDate} helperText={errors.toDate?.message} />}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>

                                {/* from date */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller
                                        name="fromDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="From Date"
                                                value={field.value}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                renderInput={(params) => <TextField {...params} error={!!errors.fromDate} helperText={errors.fromDate?.message} />}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <RHFTextField disabled={isView} name="breakFast" label="Break Fast" />
                                <RHFTextField disabled={isView} name="lunch" label="Lunch" />
                                <RHFTextField disabled={isView} name="snack" label="Snack" />
                                <RHFTextField disabled={isView} name="dinner" label="Dinner" />
                            </Box>
                            <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                                <LoadingButton color="inherit" variant="outlined" onClick={handleBack}>
                                    Back
                                </LoadingButton>
                                {!isView && (
                                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                        {isEdit ? 'Update' : 'Create'}
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
