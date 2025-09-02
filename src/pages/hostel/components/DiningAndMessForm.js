import { MealTypes } from '@components/all-enums/UniversityEnums';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import FormProvider, { RHFAutocomplete } from '@components/hook-form';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
} from '@mui/material';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getDiningAndMessDataAsync, updateDiningAndMessAsync } from '@redux/services';
import { capitalCase } from 'change-case';
import { capitalize } from 'lodash';
import DiningTimeSlotForm from './DiningTimeSlotForm';

const DiningAndMessForm = ({ isEdit, isView, currentHostel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const [arrayData, setArrayData] = useState([]);
  const { isSubmitDining, getDiningAndMessData } = useSelector((store) => store?.hostel);

  // Validation schema
  const UserSchema = Yup.object().shape({
    messAvailability: Yup.string().required('Mess availability is required'),
    mealTypes: Yup.object().nullable().required('At least one meal type is required'),
    specialDietary: Yup.string().required('Special dietary arrangement is required'),
  });

  const defaultValues = useMemo(
    () => ({
      messAvailability: getDiningAndMessData?.messDetails?.messAvailability || '',
      mealTypes: currentHostel?.mealTypes || null,
      specialDietary: getDiningAndMessData?.messDetails?.specialDietary || '',
    }),
    [currentHostel, getDiningAndMessData]
  );

  console.log(
    'getDiningAndMessData?.messDetails?.specialDietary',
    typeof getDiningAndMessData?.messDetails?.specialDietary
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const { control, setValue, handleSubmit, watch } = methods;

  const specialDietaryCheck = watch('specialDietary');

  const onSubmit = (data) => {
    if (arrayData.length === 0) {
      enqueueSnackbar('Dining details, Please.', { variant: 'warning' });
      return; // Prevent submission if bedDetails are empty
    }

    const diningTimeSlotsArray = arrayData?.map((items) => ({
      name: items.diningType?.value,
      startTime: dayjs(items.startTime).format('HH:mm'),
      endTime: dayjs(items.endTime).format('HH:mm'),
    }));

    const payload = {
      hostelId: id,
      specialDietary: specialDietaryCheck,
      messAvailability: data?.messAvailability,
      mealType: data?.mealTypes?.value,
      dietaryOptions: data?.specialDietaryOptions?.map((items) => items?.value),
      diningTimeSlot: diningTimeSlotsArray,
    };

    if (!specialDietaryCheck) {
      delete payload.dietaryOptions;
    }

    dispatch(updateDiningAndMessAsync(payload)).then((res) => {
      if (res?.payload?.statusCode === 200) {
        navigate(PATH_DASHBOARD.addhostel.list);
        enqueueSnackbar(res?.payload?.message, { variant: 'success' });
      } else {
        enqueueSnackbar(res?.payload?.message, { variant: 'error' });
      }
    });
  };
  const handleBack = () => navigate(-1);

  useEffect(() => {
    const dietaryOptionsData = getDiningAndMessData?.messDetails?.dietaryOptions?.map((items) => ({
      value: items,
      label: capitalCase(items),
    }));

    const messTypeData = {
      value: getDiningAndMessData?.messDetails?.mealType,
      label: capitalize(getDiningAndMessData?.messDetails?.mealType),
    };

    setValue('mealTypes', messTypeData);
    setValue('specialDietaryOptions', dietaryOptionsData);
    setValue('specialDietary', getDiningAndMessData?.messDetails?.specialDietary);
    setValue('messAvailability', getDiningAndMessData?.messDetails?.messAvailability);
  }, [getDiningAndMessData, setValue]);

  useEffect(() => {
    const payload = {
      hostelId: id,
    };
    dispatch(getDiningAndMessDataAsync(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Hostel: Dining And Mess | Yoco</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dining And Mess Facilities"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Hostel', href: PATH_DASHBOARD.addhostel.list },
            { name: 'Dining And Mess Facilities' },
          ]}
        />

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
                {/* Mess Availability Radio Group */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">Mess Availability</FormLabel>
                  <Controller
                    name="messAvailability"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                <RHFAutocomplete
                  // multiple
                  name="mealTypes"
                  label="Meal Type"
                  options={MealTypes || []}
                />

                {/* Special Dietary Arrangements Radio Group */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">Special Dietary Arrangements</FormLabel>
                  <Controller
                    name="specialDietary"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        {...field}
                        value={field.value === true ? 'true' : 'false'} // Convert boolean to string for the RadioGroup
                        onChange={(e) => field.onChange(e.target.value === 'true')} // Convert string back to boolean
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                {specialDietaryCheck === true && (
                  <RHFAutocomplete
                    multiple
                    name="specialDietaryOptions"
                    label="Special Dietary Options"
                    options={specialDietaryOption || []}
                  />
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                <DiningTimeSlotForm
                  arrayData={arrayData}
                  setArrayData={setArrayData}
                  currentHostel={getDiningAndMessData?.messDetails?.diningTimeSlot}
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
                  <LoadingButton loading={isSubmitDining} type="submit" variant="contained">
                    Save Changes
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
            </Card>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
};

export default DiningAndMessForm;

DiningAndMessForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentHostel: PropTypes.object,
};

const specialDietaryOption = [
  { label: 'Jain Food', value: 'jain-food' },
  { label: 'Gluten Free', value: 'gluten-free' },
  // { label: "Vegan", value: "vegan" },
];
