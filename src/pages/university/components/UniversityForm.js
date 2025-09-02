import * as Yup from 'yup';
import PropTypes from 'prop-types';
import FormProvider, { RHFAutocomplete, RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, InputLabel, TextField } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MealTypes, PaymentCycleTypes, RoomTypes } from '@components/all-enums/UniversityEnums';
import { getCourseAsync } from '@redux/services';
import { addUniversityAsync, updateUniversityAsync } from '@redux/services/universityServices';
import axios from 'axios';
import { capitalize } from 'lodash';
import HostelDetailsForm from './HostelDetailsForm';

const UniversityForm = ({ isEdit = false, isView = false, currentUniversity }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isSubmitting } = useSelector((state) => state?.role);
  const { courseList } = useSelector((store) => store?.course);
  const apiKey = 'NnF1NWxKZm03bURIbHJmU3lyYnV3MXJoRk91UEZSb3FUNnRsbWdsQw==';

  // States to manage data and selected values
  const [arrayData, setArrayData] = useState([]);
  const [allCountryData, setAllCountryData] = useState([]);
  const [allStateData, setAllStateData] = useState([]);
  const [allCityData, setAllCityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Validation schema for all fields
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('College Name is required.'),
    address: Yup.string().required('Address is required.'),
    totalCapacity: Yup.string().required('Total Capacity is required.'),
    googleMapLink: Yup.string()
      .url('Must be a valid URL.')
      .required('Google Maps Link is required.'),
    // country: Yup.object()                                                             // Required Later
    //   .shape({
    //     name: Yup.string().required('Country name is required.'),
    //   })
    //   .nullable()
    //   .required('Country is required.'),
    // state: Yup.object()
    //   .shape({
    //     name: Yup.string().required('State name is required.'),
    //   })
    //   .nullable()
    //   .required('State is required.'),
    // city: Yup.object()
    //   .shape({
    //     name: Yup.string().required('City name is required.'),
    //   })
    //   .nullable()
    //   .required('City is required.'),
    courseOffered: Yup.array()
      .min(1, 'At least one course must be selected.')
      .required('Course Offered is required.'),
    roomTypes: Yup.array()
      .min(1, 'At least one room type must be selected.')
      .required('Room Types is required.'),
    paymentTypes: Yup.array()
      .min(1, 'At least one payment type must be selected.')
      .required('Payment Structure is required.'),
    mealTypes: Yup.array()
      .min(1, 'At least one meal type must be selected.')
      .required('Meal Type is required.'),
    evChargingStation: Yup.string().required('Total Number of EV Charge Stations is required.'),
    parkingSpaces: Yup.string().required('Total Number of Parking is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUniversity?.name || '',
      address: currentUniversity?.address || '',
      googleMapLink: currentUniversity?.googleMapLink || '',
      country: currentUniversity?.location?.country || null,
      state: currentUniversity?.state || null,
      city: currentUniversity?.location?.city || null,
      courseOffered: currentUniversity?.courseOffered || [],
      totalCapacity: currentUniversity?.totalCapacity || '',
      roomTypes: currentUniversity?.roomTypes || [],
      paymentTypes: currentUniversity?.paymentTypes || [],
      mealTypes: currentUniversity?.mealTypes || [],
      evChargingStation: currentUniversity?.evChargingStation || '',
      parkingSpaces: currentUniversity?.parkingSpaces || '',
    }),
    [currentUniversity]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue } = methods;

  const handleBack = () => {
    navigate(-1);
  };

  const hostelDetails = arrayData?.map((items) => ({
    hostelType: items?.hostelType?.value,
    noOfBuildings: items?.numberOfHostel,
    noOfBeds: items?.numberOfBeds,
  }));

  const onSubmit = async (data) => {
    const payload = {
      hostelDetails,
      name: data.name,
      address: data.address,
      googleMapLink: data.googleMapLink,
      location: {
        // country: selectedCountry?.name,
        country: {
          countryId: selectedCountry?.id,
          iso2: selectedCountry?.iso2,
          name: selectedCountry?.name,
        },
        state: {
          stateId: selectedState?.id,
          name: selectedState?.name,
          iso2: selectedState?.iso2,
        },
        city: {
          cityId: selectedCity?.id,
          name: selectedCity?.name,
        },
      },
      totalCapacity: data.totalCapacity,
      courseIds: data.courseOffered.map((course) => course._id),
      roomTypes: data.roomTypes.map((room) => room.value),
      paymentTypes: data.paymentTypes.map((payment) => payment.value),
      mealTypes: data.mealTypes.map((meal) => meal.value),
      evChargingStation: Number(data.evChargingStation),
      parkingSpaces: Number(data.parkingSpaces),
    };

    try {
      const response = await dispatch(
        isEdit
          ? updateUniversityAsync({ id: currentUniversity?._id, data: payload })
          : addUniversityAsync(payload)
      );
      // Handle API logic here.
      if (response?.payload?.statusCode === 200) {
        reset();
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.university.list);
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  useEffect(() => {
    if ((isEdit || isView) && currentUniversity) {
      // Set basic fields
      setValue('name', currentUniversity?.name);
      setValue('address', currentUniversity?.address);
      setValue('googleMapLink', currentUniversity?.googleMapLink);

      // Set location fields
      setSelectedCountry({
        name: currentUniversity?.location?.country?.name,
        iso2: currentUniversity?.location?.country?.iso2,
        countryId: currentUniversity?.location?.country?.countryId,
      });

      setSelectedState({
        stateId: currentUniversity?.location?.state?.stateId,
        name: currentUniversity?.location?.state?.name,
        iso2: currentUniversity?.location?.state?.iso2,
      });

      setSelectedCity({
        cityId: currentUniversity?.location?.city?.cityId,
        name: currentUniversity?.location?.city?.name,
      });

      // Set courses
      setValue(
        'courseOffered',
        currentUniversity?.courseIds?.map((course) => ({
          name: course?.name,
          _id: course?._id,
        }))
      );

      // Set room, payment, and meal types
      setValue(
        'roomTypes',
        currentUniversity?.roomTypes?.map((room) => ({
          value: room,
          label: capitalize(room),
        }))
      );

      setValue(
        'paymentTypes',
        currentUniversity?.paymentTypes?.map((payment) => ({
          value: payment,
          label: capitalize(payment),
        }))
      );

      setValue(
        'mealTypes',
        currentUniversity?.mealTypes?.map((meal) => ({
          value: meal,
          label: capitalize(meal),
        }))
      );

      // EV charging and parking spaces
      setValue('evChargingStation', currentUniversity?.evChargingStation);
      setValue('parkingSpaces', currentUniversity?.parkingSpaces);

      // Set hostel details
      setArrayData(
        currentUniversity?.hostelDetails?.map((hostel) => ({
          hostelType: { value: hostel?.hostelType, label: capitalize(hostel?.hostelType) },
          numberOfHostel: hostel?.noOfBuildings,
          numberOfBeds: hostel?.noOfBeds,
        }))
      );
    }
  }, [isEdit, isView, currentUniversity, setValue]);

  //   Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const config = {
          method: 'get',
          url: 'https://api.countrystatecity.in/v1/countries',
          headers: {
            'X-CSCAPI-KEY': apiKey,
          },
        };
        const response = await axios(config);
        setAllCountryData(response?.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  //   Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry?.iso2) {
        try {
          const config = {
            method: 'get',
            url: `https://api.countrystatecity.in/v1/countries/${selectedCountry.iso2}/states`,
            headers: {
              'X-CSCAPI-KEY': apiKey,
            },
          };
          const response = await axios(config);
          setAllStateData(response?.data);
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      } else {
        setAllStateData([]);
        setSelectedState(null);
        setAllCityData([]);
        setSelectedCity(null);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  //   Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState?.iso2) {
        try {
          const config = {
            method: 'get',
            url: `https://api.countrystatecity.in/v1/countries/${selectedCountry?.iso2}/states/${selectedState?.iso2}/cities`,
            headers: {
              'X-CSCAPI-KEY': apiKey,
            },
          };
          const response = await axios(config);
          setAllCityData(response?.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      } else {
        setAllCityData([]);
        setSelectedCity(null);
      }
    };

    fetchCities();
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    dispatch(getCourseAsync());
  }, [dispatch]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} gap={2}>
          <Card sx={{ p: 3, width: '100%' }}>
            <InputLabel sx={{ my: 2, color: '#000' }}>
              Section 1: Basic University Details
            </InputLabel>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField disabled={isView} name="name" label="University Name" />
              <RHFTextField disabled={isView} name="address" label="Address" />
              <RHFTextField disabled={isView} name="googleMapLink" label="Google Maps Link" />

              <RHFAutocomplete
                disabled={isView}
                name="country"
                label="Country"
                value={selectedCountry}
                options={allCountryData || []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, newValue) => {
                  setSelectedCountry(newValue);
                  setValue('country', newValue); // Update form value
                  setSelectedState(null);
                  setSelectedCity(null);
                  setAllStateData([]);
                  setAllCityData([]);
                }}
                fullWidth
              />

              <RHFAutocomplete
                name="state"
                label="State"
                value={selectedState}
                options={allStateData || []} // Ensure options is always an array
                getOptionLabel={(option) => option.name || ''} // Handle cases where option may not have a name
                onChange={(_, newValue) => {
                  setSelectedState(newValue);
                  setSelectedCity(null);
                  setAllCityData([]);
                }}
                fullWidth
                disabled={!selectedCountry || isView} // Disable if no country selected
              />

              <RHFAutocomplete
                name="city"
                label="City"
                value={selectedCity}
                options={allCityData || []} // Ensure options is always an array
                getOptionLabel={(option) => option.name || ''} // Handle cases where option may not have a name
                onChange={(_, newValue) => setSelectedCity(newValue)}
                fullWidth
                disabled={!selectedState || isView} // Disable if no state selected
              />

              <RHFTextField disabled={isView} type='number' name="totalCapacity" label="Total Capacity" />
            </Box>
          </Card>

          <Card sx={{ p: 3, width: '100%' }}>
            <InputLabel sx={{ my: 2, color: '#000' }}>Section 2: Academic Details</InputLabel>
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
                disabled={isView}
                multiple
                name="courseOffered"
                label="Course Offered"
                options={courseList || []}
                getOptionLabel={(option) => option.name || ''}
                getIsOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField {...params} label="Course Offered" variant="outlined" />
                )}
              />
            </Box>
          </Card>

          <HostelDetailsForm
            arrayData={arrayData}
            setArrayData={setArrayData}
            currentUniversity={currentUniversity}
            isEdit={isEdit}
            isView={isView}
          />

          <Card sx={{ p: 3, width: '100%' }}>
            <InputLabel sx={{ my: 2, color: '#000' }}>Section 4: Additional Details</InputLabel>
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
                disabled={isView}
                multiple
                name="roomTypes"
                label="Types Of Room"
                options={RoomTypes || []}
              />

              <RHFAutocomplete
                disabled={isView}
                multiple
                name="paymentTypes"
                label="Payment Types"
                options={PaymentCycleTypes || []}
              />

              <RHFAutocomplete
                disabled={isView}
                multiple
                name="mealTypes"
                label="Meal Type"
                options={MealTypes || []}
              />

              <RHFTextField
                disabled={isView}
                name="evChargingStation"
                label="Total Number of EV Charge Stations"
              />
              <RHFTextField
                disabled={isView}
                name="parkingSpaces"
                label="Total Number of Parking"
              />
            </Box>
          </Card>

          <Card sx={{ p: 3, width: '100%' }}>
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
          </Card>
        </Grid>
      </FormProvider>
      {/* <PersonalDetails /> */}
    </>
  );
};

export default UniversityForm;

UniversityForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUniversity: PropTypes.object,
};
