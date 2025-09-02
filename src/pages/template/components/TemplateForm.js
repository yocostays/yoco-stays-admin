import { templateType } from '@components/all-enums/templateEnums';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '@components/hook-form';
import RHFEditor from '@components/hook-form/RHFEditor';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { getHostelListAsync } from '@redux/services';
import { addTemplateAsync, updateTemplateAsync } from '@redux/services/templateServices';
import { PATH_DASHBOARD } from '@routes/paths';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

TemplateForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentTemplate: PropTypes.object,
  loading: PropTypes.bool,
};

// Validation Schema
const templateSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  hostel: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string().required('Hostel is required'),
    })
    .nullable()
    .required('Hostel is required'),
  templateType: Yup.string().required('Template type is required'),
});

export default function TemplateForm({ isEdit = false, isView = false, currentTemplate, loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hostelList } = useSelector((store) => store?.hostel);
  const { isSubmitting } = useSelector((store) => store?.template);
  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState(false);

  const hostelOptions = hostelList?.map((item) => ({
    label: item?.name,
    value: item?._id,
  }));

  // Default values for the form
  const defaultValues = useMemo(() => {
    const hostelValue = hostelList?.find((h) => h._id === currentTemplate?.hostelId);

    return {
      title: currentTemplate?.title || '',
      description: currentTemplate?.description || '',
      hostel: hostelValue ? { label: hostelValue.name, value: hostelValue._id } : null,
      templateType:currentTemplate?.templateType  || '',
      image: currentTemplate?.image || null,
    };
  }, [currentTemplate, hostelList]);

  const methods = useForm({
    resolver: yupResolver(templateSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;
console.log(errors,'errors')
  const handleDropSingleImage = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64File = reader.result;

        setValue('image', { url: base64File }, { shouldValidate: true });
      };

      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const handleRemoveImage = () => {
    setValue('image', null, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    try {
      // Create a payload object based on form data
      const payload = {
        hostelId: data?.hostel?.value,
        title: data.title,
        description: data.description,
        templateType: data?.templateType,
        image: data?.image?.url || currentTemplate?.image,
      };

      // If editing, update the staff information

      if (isEdit) {
        const response = await dispatch(
          updateTemplateAsync({ id: currentTemplate?._id, data: payload })
        );

        if (response?.payload?.statusCode === 200) {
          reset();
          enqueueSnackbar(response?.payload?.message, { variant: 'success' });
          navigate(PATH_DASHBOARD.template.list);
        } else {
          enqueueSnackbar(response?.payload?.message, { variant: 'error' });
        }
      } else {
        // If not editing, create a new template
        const response = await dispatch(addTemplateAsync(payload));

        if (response?.payload?.statusCode === 200) {
          reset();
          enqueueSnackbar(response?.payload?.message, { variant: 'success' });
          navigate(PATH_DASHBOARD.template.list);
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

  // Fetch roles and reset form when currentTemplate or view/edit modes change
  useEffect(() => {
    dispatch(getHostelListAsync({}));
  }, [dispatch]);

  useEffect(() => {
    if ((isEdit || isView) && currentTemplate && hostelList?.length > 0) {
      reset(defaultValues);
    }
  }, [currentTemplate, isEdit, isView, hostelList, reset, defaultValues]);

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
                sx={{ marginBottom: 1 }}
              >
                <RHFAutocomplete
                  name="hostel"
                  label="Select Hostel"
                  options={hostelOptions}
                  getOptionLabel={(option) => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                  disabled={isView}
                />
                <RHFTextField disabled={isView} name="title" label="Title" />
                <RHFAutocomplete
                  name="templateType"
                  label="Template Type"
                  options={templateType || []}
                  getOptionLabel={(option) => capitalize(option) || ''}
                  disabled={isView}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Description
                    </Typography>
                    <RHFEditor disabled={isView} name="description" label="Description" />
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Upload Image (370px x 210px)
                    </Typography>
                    <RHFUpload
                      thumbnail
                      name="image"
                      onDrop={handleDropSingleImage}
                      onRemove={handleRemoveImage}
                      accept={{ 'image/*': [] }}
                      disabled={isView}
                    />
                  </Stack>
                </Grid>
              </Grid>
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
