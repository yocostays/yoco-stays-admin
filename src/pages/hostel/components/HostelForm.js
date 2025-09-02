import FormProvider, {
  RHFAutocomplete,
  RHFCheckbox,
  RHFTextField,
  RHFTimePicker,
  RHFUpload,
} from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { PATH_DASHBOARD } from '@routes/paths';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { addHostelAsync, updateHostelAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { getUniversityListAsync } from '@redux/services/universityServices';
import { getAmenitiesAsync } from '@redux/services/amenitiesServices';
import BedDetailForm from './BedDetailForm';
import RulesAndEmergancyForm from './RulesAndEmergancyForm';

HostelForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentHostel: PropTypes.object,
};

export default function HostelForm({ isEdit = false, isView = false, currentHostel }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isSubmitting } = useSelector((store) => store?.hostel);
  const { getUniversityList } = useSelector((store) => store?.university);
  const { amenitiesList } = useSelector((store) => store?.amenities);
  const [isAvailable, setIsAvailable] = useState(false); // State to track checkbox status
  const [visitingHourForGuest, setVisitingHourForGuest] = useState([]);

  const handleCheckboxChange = (event) => {
    setIsAvailable(event.target.checked);
  };

  // Validation schema
  const UserSchema = Yup.object().shape({
    university: Yup.object().nullable().required('University is required'),
    // university: Yup.array()
    // .min(1, 'At least one university must be selected.')
    // .required('University are required.'),
    name: Yup.string().required('Name is required'),
    identifier: Yup.string().required('Identifier is required'),
    building: Yup.object()
      .shape({
        number: Yup.string().required('Building number is required'),
      })
      .required('Building details are required'),
    address: Yup.string().required('Address is required'),
    description: Yup.string().required('Description is required'),
    securityFee: Yup.string().required('Security Fee is required'),
    amenities: Yup.array()
      .min(1, 'At least one amenity must be selected.')
      .required('Amenities are required.'),
    image: Yup.array()
      .of(
        Yup.object().shape({
          url: Yup.string().required('Image URL is required'),
        })
      )
      .required('Image is required'),
    // startAvailableTime: Yup.object().nullable().required('Start available time is required'),
    // endAvailableTime: Yup.object().nullable().required('End available time is required'),
    warden: Yup.string()
      .required('warden number is required')
      .matches(/^\d{10}$/, 'warden number must be exactly 10 digits'),
    security: Yup.string()
      .required('Security number is required')
      .matches(/^\d{10}$/, 'Security number must be exactly 10 digits'),
    medicalAssistance: Yup.string()
      .required('Medical assistance number is required')
      .matches(/^\d{10}$/, 'Medical assistance number must be exactly 10 digits'),
    others: Yup.string()
      .required('Others number is required')
      .matches(/^\d{10}$/, 'Others number must be exactly 10 digits'),
    numberOfGaurds: Yup.string().required('Number of guards is required'),
  });

  const defaultValues = useMemo(
    () => ({
      university: currentHostel?.universityId || null,
      name: currentHostel?.name || '',
      identifier: currentHostel?.identifier || '',

      building: {
        number: currentHostel?.buildingNumber || '',
      },

      address: currentHostel?.address || '',
      description: currentHostel?.description || '',
      securityFee: currentHostel?.securityFee || '0',
      image: currentHostel?.image || [],
      bedDetails: currentHostel?.bedDetails || [],
      amenities: currentHostel?.amenitieIds || [],
      agreementCheck: currentHostel?.isAgreementRequired || false,

      // Security Features
      numberOfGaurds: currentHostel?.securityDetails?.numberOfGuards || '',
      startAvailableTime:
        (currentHostel && dayjs(`1970-01-01T${currentHostel?.securityDetails?.startTime}`)) || null,
      endAvailableTime:
        (currentHostel && dayjs(`1970-01-01T${currentHostel?.securityDetails?.endTime}`)) || null,

      // Fields with 10-digit validation
      warden: currentHostel?.emergencyNumbers?.wardenNumber || '',
      security: currentHostel?.emergencyNumbers?.securityGuardNumber || '',
      medicalAssistance: currentHostel?.emergencyNumbers?.medicalNumber || '',
      others: currentHostel?.emergencyNumbers?.otherNumber || '',
    }),
    [currentHostel]
  );

  const [bedDetails, setBedDetails] = useState(defaultValues.bedDetails);

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const values = watch();

  const onSubmit = async (data) => {
    if (bedDetails.length === 0) {
      enqueueSnackbar('Add bed details, please.', { variant: 'warning' });
      return; // Prevent submission if bedDetails are empty
    }

    const payload = {
      universityId: data?.university?._id,
      name: data.name,
      identifier: data.identifier,
      buildingNumber: data.building.number,
      address: data.address,
      amenitieIds: data?.amenities?.map((items) => items?._id),

      image:
        data?.image?.map((img) => ({
          url: img?.url,
        })) || [],
      description: data.description,
      securityFee: data.securityFee,
      isAgreementRequired: data?.agreementCheck,

      // Visiting Hours for Guests
      visitingHours: visitingHourForGuest,

      // Emergency Numbers
      emergencyNumbers: {
        wardenNumber: data?.warden,
        securityGuardNumber: data?.security,
        medicalNumber: data?.medicalAssistance,
        otherNumber: data?.others,
      },

      // Sequerity Features
      securityDetails: {
        numberOfGuards: data?.numberOfGaurds,
        availablity: isAvailable,
        startTime: dayjs(data.startAvailableTime).format('HH:mm') || null,
        endTime: dayjs(data.endAvailableTime).format('HH:mm') || null,
      },

      // Bed Details
      bedDetails:
        bedDetails.map((bed) => ({
          bedType: bed.bedType,
          numberOfRooms: bed.numberOfRooms,
          totalBeds: bed.totalBeds,
          accommodationFee: bed.accommodationFee,
        })) || [],
    };

    if (isAvailable) {
      delete payload.securityDetails.startTime;
      delete payload.securityDetails.endTime;
    }

    try {
      const response = await dispatch(
        isEdit
          ? updateHostelAsync({ id: currentHostel?._id, data: payload })
          : addHostelAsync(payload)
      );
      if (response?.payload?.statusCode === 200) {
        reset();
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.addhostel.list);
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleDropMultipleImage = useCallback(
    (acceptedFiles) => {
      const files = values.image || []; // Existing images
      const newFiles = acceptedFiles.map((file) => {
        const reader = new FileReader();
        const url = URL.createObjectURL(file);

        return new Promise((resolve) => {
          reader.onloadend = () => {
            const base64File = reader.result;
            resolve({
              preview: url,
              url: base64File,
              file,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newFiles).then((allFiles) => {
        setValue('image', [...files, ...allFiles], { shouldValidate: true });
      });
    },
    [setValue, values.image]
  );

  const handleRemoveImage = (inputFile) => {
    const filteredImages = values.image?.filter((file) => file.url !== inputFile.url);
    setValue('image', filteredImages, { shouldValidate: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // useEffect(() => {                                                  // Required Later
  //   if (isEdit || isView || currentHostel) {
  //     reset(defaultValues);
  //     setBedDetails(defaultValues.bedDetails);
  //     setIsAvailable(currentHostel?.securityDetails?.availablity);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isEdit, isView, currentHostel]);

  useEffect(() => {
    dispatch(getUniversityListAsync());
    dispatch(getAmenitiesAsync());
  }, [dispatch]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            rowGap={3}
            columnGap={2}
          >
            <RHFAutocomplete
              disabled={isView}
              name="university"
              label="University"
              options={getUniversityList || []}
            />

            <RHFTextField disabled={isView} name="name" label="Hostel Name" />
            <RHFTextField disabled={isView} name="identifier" label="Identifier" />
            <RHFTextField disabled={isView} name="building.number" label="Building Number" />
            <RHFTextField disabled={isView} name="address" label="Address" />
            <RHFTextField disabled={isView} name="description" label="Description" />

            <RHFTextField
              disabled={isView}
              name="securityFee"
              label="Security Fee"
              type="number"
            />

            <RHFAutocomplete
              disabled={isView}
              multiple
              name="amenities"
              label="Amenities"
              options={amenitiesList || []}
            />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1} maxWidth={480}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Upload Image (370px x 210px)
                  </Typography>
                  <RHFUpload
                    thumbnail
                    multiple
                    name="image"
                    onDrop={handleDropMultipleImage}
                    onRemove={handleRemoveImage}
                    accept={{ 'image/*': [] }}
                    disabled={isView}
                  />
                </Stack>
              </Grid>
            </Grid>

            {/* Resident Checkbox */}
          </Box>
          <Box m={3} display="flex" alignItems="center">
            <RHFCheckbox
              name="agreementCheck"
              label="Resident Agreement or Terms of Stay Shared"
              disabled={isView}
            />
          </Box>

          <RulesAndEmergancyForm // Required Later
            control={control}
            watch={watch}
            values={values}
            register={register}
            errors={errors}
            apiData={currentHostel?.visitingHours}
            setVisitingHourForGuest={setVisitingHourForGuest}
          />

          <Card sx={{ p: 3, mt: 5 }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Emergency Contact Numbers
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              rowGap={3}
              columnGap={2}
            >
              <RHFTextField
                disabled={isView}
                type="number"
                name="warden"
                label="warden"
                onInput={(e) => {
                  // Prevent more than 10 characters being entered
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />

              <RHFTextField
                type="number"
                name="security"
                label="Security"
                onInput={(e) => {
                  // Prevent more than 10 characters being entered
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />

              <RHFTextField
                type="number"
                name="medicalAssistance"
                label="Medical Assistance"
                onInput={(e) => {
                  // Prevent more than 10 characters being entered
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />

              <RHFTextField
                type="number"
                name="others"
                label="Others"
                onInput={(e) => {
                  // Prevent more than 10 characters being entered
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
            </Box>
          </Card>

          <Card sx={{ p: 3, mt: 5 }}>
            <Typography variant="h5">Security Features</Typography>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              mt={3}
              rowGap={3}
              columnGap={2}
            >
              <Box sx={{ mt: 2 }}>
                <RHFTextField type="number" name="numberOfGaurds" label="Number of Guards" />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <InputLabel>Availability:</InputLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    name="availabilityCheck"
                    checked={isAvailable}
                    onChange={handleCheckboxChange}
                    inputProps={{ 'aria-label': 'Availability' }}
                  />
                }
                label="24/7"
              />

              {/* Show the input field when the checkbox is not checked */}
              {!isAvailable && (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <RHFTimePicker name="startAvailableTime" label="Start Time" />

                  <RHFTimePicker name="endAvailableTime" label="End Time" />
                </Box>
              )}
            </Box>
          </Card>

          <BedDetailForm
            isEdit={isEdit}
            isView={isView}
            bedDetailsArray={bedDetails}
            setBedDetailsArray={setBedDetails}
          />

          <Stack
            direction="row"
            justifyContent={isView ? 'flex-start' : 'flex-end'}
            sx={{ mt: 3 }}
            gap={2}
          >
            {isView ? (
              <LoadingButton variant="contained" onClick={handleBack}>
                Back
              </LoadingButton>
            ) : (
              <>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {isEdit ? 'Save Changes' : 'Create Hostel'}
                </LoadingButton>
                <LoadingButton variant="outlined" onClick={handleBack}>
                  Cancel
                </LoadingButton>
              </>
            )}
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
