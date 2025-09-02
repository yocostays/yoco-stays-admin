import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  addStaffAsync,
  getBedTypeAsync,
  getHostelListAsync,
  getRoleForStaffAsync,
  getRoomNo,
  getVacantRoom,
  updateStaffAsync,
  getComplaintCategoryAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import FormProvider, {
  RHFAutocomplete,
  RHFRadioGroup,
  RHFTextField,
  RHFTimePicker,
  RHFAutocompleteMulti,
  RHFCalendar,
} from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import UploadAvatar from '@components/upload/UploadAvatar';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import VehicleForm from './VehicleForm';
import KYCUpload from './KYCUpload';
import HostelForm from './HostelForm';

StaffForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentStaff: PropTypes.object,
  loading: PropTypes.bool,
};

export default function StaffForm({ isEdit, isView, currentStaff, loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { isSubmitting, staffRoles, getComplaintCategory } = useSelector((state) => state?.staff);
  const complaintCategoryOptions = getComplaintCategory?.map((items) => ({
    value: items._id,
    label: items.name,
  }));
  const { hostelList, bedType, roomNo, vacantRoom } = useSelector((state) => state?.hostel);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  // const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedBedType, setSelectedBedType] = useState(null);
  const [selectedRoomNo, setSelectedRoomNo] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [kycDocuments, setKycDocuments] = useState({});
  const [hostelDetailsArray, setHostelDetailsArray] = useState([])

  const token = localStorage.getItem('token');

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    userName: Yup.string().required('User Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone is required'),
    // password: Yup.string()
    //   .min(8, 'Password must be minimum 8 characters')
    //   .max(15, 'Password must be maximum 15 characters'),
    gender: Yup.string().required('Gender is required'),
    // role: Yup.object()
    //   .shape({
    //     label: Yup.string(),
    //     value: Yup.string(),
    //   })
    //   .required('Role is required'),
    bloodGroup: Yup.string().required('Blood Group is required'),
    fathersName: Yup.string().required("Father's name is required"),
    mothersName: Yup.string().required("Mother's name is required"),
    spouseName: Yup.string(),
    assignHostel: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
      )
      .required('Assign Hostel is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    joiningDate: Yup.date().required('Joining Date is required'),
    startTime: Yup.date().required('Start Time is required'),
    endTime: Yup.date().required('End Time is required'),
  });

  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  const bloodGroups = ['Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const bedTypeLabels = {
    1: 'Single',
    2: 'Double',
    3: 'Triplet',
    4: 'Quadrille',
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    if ((newValue?.label || '').toLowerCase() !== 'maintenance') {
      setValue('complaintsCategory', null); // Reset the complaintsCategory field
    }
  };

  const formattedBedTypes = selectedHostel
    ? bedType.map((item) => ({
        label: bedTypeLabels[item.bedType] || 'Unknown', // Map number to label
        value: item.bedType, // Use bedType as value
      }))
    : [];

  const securityGuardRegex = /security guard/i;

  const handleHostelChange = (event, value) => {
    if (value === null) {
      setSelectedHostel(null);
      return;
    }
    setSelectedHostel(value);

    dispatch(getBedTypeAsync({ hostelId: value.value }));
  };

  const handleBedTypeChange = async (event, newValue) => {
    if (newValue === null || selectedHostel === null) {
      setSelectedBedType(null);
      return;
    }
    const payload = {
      hostelId: selectedHostel.value,
      bedType: newValue.value,
    };
    setSelectedBedType(newValue);

    dispatch(getRoomNo(payload));
  };

  const handleRoomNoTypeChange = async (event, selectedRoom) => {
    const payload = {
      hostelId: selectedHostel.value,
      bedType: selectedBedType.value,
      roomNumber: selectedRoom.label,
    };
    setSelectedRoomNo(selectedRoom);

    dispatch(getVacantRoom(payload));
  };

  // Default values for the form

  const defaultValues = useMemo(
    () => ({
      name: currentStaff?.name || '',
      userName: currentStaff?.userName || '',
      email: currentStaff?.email || '',
      phone: currentStaff?.phone || '',
      password: currentStaff?.password || '',
      gender: currentStaff?.gender || '',
      role:
        (currentStaff?.roleId && isEdit) || isView
          ? { label: currentStaff?.roleId?.name, value: currentStaff?.roleId?._id }
          : null,

      complaintsCategory: currentStaff?.categoryId
        ? { label: currentStaff.categoryId.name, value: currentStaff.categoryId._id }
        : null,

      image: currentStaff?.image || null,
      dateOfBirth: isEdit || isView ? dayjs(currentStaff?.dob) : null,
      bloodGroup: currentStaff?.bloodGroup || null,
      joiningDate: isEdit || isView ? dayjs(currentStaff?.joiningDate) : null,
      fathersName: currentStaff?.fatherName || '',
      mothersName: currentStaff?.motherName || '',
      spouseName: currentStaff?.spouseName || '',
      startTime:
        isEdit || isView || currentStaff ? dayjs(currentStaff?.shiftStartTime, 'h:mm A') : null,
      endTime: isEdit || isView ? dayjs(currentStaff?.shiftEndTime, 'h:mm A') : null,
      assignHostel:
        currentStaff?.hostelIds?.map((item) => ({ label: item?.name, value: item?._id })) || [],
      gateNumber: currentStaff?.gateNumber || '',
      selectBedType: currentStaff?.selectBedType || null,
      roomNo: currentStaff?.roomNo || null,
      bed: currentStaff?.hostelAllocationDetails?.bedNumber || null,
      selectHostel: currentStaff?.hostelAllocationDetails?.hostelId?._id || null,
      hostelDetails: currentStaff?.hostelDetails || [],
    }),
    [currentStaff, isEdit, isView]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = methods;

  const [hostelDetails, setHostelDetails] = useState(defaultValues.hostelDetails);
  const categoryId = watch("complaintsCategory");

  // Handle file drop for avatar upload
  const handleDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const imageFile = acceptedFiles[0];
      setFile(imageFile);
      setError(false);
      setValue('image', imageFile);

      // upload api for upload image to online storage bucket or other cloud storage service

      const formData = new FormData();
      formData.append('type', 'staff');
      formData.append('file', imageFile); // Append the file

      // Implement your upload logic here
      // Example: Using fetch to send the FormData to an API
      const apiUrl = process.env.REACT_APP_HOST_API_KEY; // Replace with your API URL

      fetch(`${apiUrl}api/auth/upload-media`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `${token}`, // Add your auth token here
          // 'Accept': 'application/json' // Optional, add if your API expects this
        },
      })
        .then(async (response) => {
          const responseData = await response.json();

          setImgUrl(responseData?.data);
        })
        .catch((err) => {
          console.error('Upload failed:', error);

          // setError("Upload failed. Please try again."); // Handle upload error
        });
    }
  };

  // Handle file rejection for avatar upload
  const handleReject = (fileRejections) => {
    if (fileRejections.length > 0) {
      setError(true);
    }
  };

  const handleVehiclesChange = (updatedVehicles) => {
    setVehicles(updatedVehicles);
  };

  const handleDocumentsChange = (updatedDocuments) => {
    setKycDocuments(updatedDocuments);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if(selectedRole?.label.toLowerCase() === "maintenance" && !categoryId?.value){
        toast.error("Please select a category", {position: "top-right"})
      } else {
        const payload = {
          name: data?.name,
          userName: data?.userName,
          email: data?.email,
          phone: data?.phone,
          gender: data?.gender,
          roleId: selectedRole?.value,
          categoryId: data?.complaintsCategory?.value,
          image: imgUrl,
          dob: dayjs(data?.dob).add(5, 'hours').add(30, 'minutes').toISOString(),
          joiningDate: dayjs(data?.joiningDate).add(5, 'hours').add(30, 'minutes').toISOString(),
          fatherName: data?.fathersName,
          motherName: data?.mothersName,
          spouseName: data?.spouseName,
          bloodGroup: data?.bloodGroup,
          vechicles: [...vehicles],
          kycDocuments: { ...kycDocuments },
          shiftStartTime: dayjs(data?.startTime).format('hh:mm A'),
          shiftEndTime: dayjs(data?.endTime).format('hh:mm A'),
          assignedHostelIds: data?.assignHostel?.map((hostel) => hostel.value),
          ...(selectedRole?.label === 'warden' && {
            bedNumber: data?.bed,
            roomNumber: selectedRoomNo?.label,
            bedType: selectedBedType?.value,
            hostelId: selectedHostel?.value,
          }),
          ...(selectedRole?.label === 'security' && {
            gateNumber: data?.gateNumber,
          }),
          ...(isEdit === false && { password: data?.password }), // Only add password if not editing
          hostelDetails: hostelDetailsArray.map((item)=>({
            ...item,
            hostelId: item?.hostelId?._id,
          }))
        };
  
        if (data?.gateNumber) {
          payload.gateNumber = data.gateNumber;
        }
  
        if (data?.password) {
          payload.password = data?.password;
        }
  
        if (selectedRole?.label?.toLowerCase() !== 'maintenance') {
          delete payload.complaintsCategory;
        }
  
        console.log('payload', payload);
  
        // If editing, update the staff information
  
        if (isEdit) {
          const response = await dispatch(updateStaffAsync({ id: currentStaff?._id, data: payload }));
  
          if (response?.payload?.statusCode === 200) {
            reset();
            enqueueSnackbar(response?.payload?.message, { variant: 'success' });
            navigate(PATH_DASHBOARD.staff.list);
          } else {
            enqueueSnackbar(response?.payload?.message, { variant: 'error' });
          }
        } else {
          // If not editing, create a new staff
          const response = await dispatch(addStaffAsync(payload));
  
          if (response?.payload?.statusCode === 200) {
            reset();
            enqueueSnackbar(response?.payload?.message, { variant: 'success' });
            navigate(PATH_DASHBOARD.staff.list);
          } else {
            enqueueSnackbar(response?.payload?.message, { variant: 'error' });
          }
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

  // Fetch roles and reset form when currentStaff or view/edit modes change
  useEffect(() => {
    dispatch(getRoleForStaffAsync({}));
    dispatch(getHostelListAsync({}));
    dispatch(getComplaintCategoryAsync({}));
  }, [dispatch]);

  useEffect(() => {
    if ((isEdit && currentStaff) || (isView && currentStaff)) {
      reset(defaultValues);
      setFile(currentStaff?.image);
      setImgUrl(currentStaff?.image);
      setSelectedRole({ label: currentStaff?.roleId?.name, value: currentStaff?.roleId?._id });
      setSelectedHostel({
        label: currentStaff?.hostelAllocationDetails?.hostelId?.name,
        value: currentStaff?.hostelAllocationDetails?.hostelId?._id,
      });
      setSelectedBedType({
        label: currentStaff?.hostelAllocationDetails?.bedType,
        value: currentStaff?.hostelAllocationDetails?.bedType,
      });
      setSelectedRoomNo({
        label: currentStaff?.hostelAllocationDetails?.roomNumber,
        value: currentStaff?.hostelAllocationDetails?.roomNumber,
      });
      setHostelDetailsArray(currentStaff?.hostelDetails)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStaff, isEdit, isView, reset]);

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
              <Box sx={{ my: 5 }}>
                <UploadAvatar
                  file={file}
                  error={error || !!errors.image}
                  onDrop={handleDrop}
                  onReject={handleReject}
                  disabled={isView}
                  helperText={
                    (error || errors.image) && (
                      <Typography color="error">
                        {errors.image?.message || 'Invalid file type or size'}
                      </Typography>
                    )
                  }
                  preview={file}
                />
              </Box>
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
                  name="role"
                  label="Role"
                  options={staffRoles?.map((item) => ({
                    label: item?.name,
                    value: item?._id,
                  }))}
                  getOptionLabel={(option) => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                  onChange={handleRoleChange}
                  value={selectedRole}
                />

                {/* {selectedRole?.label?.toLowerCase() === 'maintenance' && ( */}
                  <RHFAutocomplete
                    name="complaintsCategory"
                    label="Complaints Category"
                    options={complaintCategoryOptions}
                    getOptionLabel={(option) => option?.label}
                    onChange={(ev, newValue) => {
                      setValue('complaintsCategory', newValue);
                    }}
                    disabled={isView}
                  />
                {/* )} */}

                <RHFTextField disabled={isView} name="name" label="Staff Name" />

                <RHFTextField
                  disabled={isView}
                  name="userName"
                  label="User Name"
                  autoComplete="new-username"
                />

                <RHFCalendar
                  name="dateOfBirth"
                  label="Date of Birth"
                  helperText="Please select a date of birth"
                  disabled={isView} // Set to true if you want to disable
                  rules={{ required: 'Date of Birth is required' }} // Validation rule
                />

                <RHFTextField
                  disabled={isView}
                  name="phone"
                  label="Phone Number"
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 10,
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                />

                <RHFTextField disabled={isView} name="email" label="Email" />

                <RHFRadioGroup
                  row
                  name="gender"
                  label="Gender"
                  options={[
                    { value: 'female', label: 'Female' },
                    { value: 'male', label: 'Male' },
                    { value: 'other', label: 'Other' },
                  ]}
                  disabled={isView}
                  spacing={2}
                />

                <RHFAutocomplete
                  name="bloodGroup"
                  label="Blood Group"
                  options={bloodGroups}
                  getOptionLabel={(option) => option} // Directly use the string
                  isOptionEqualToValue={(option, value) => option === value} // Compare strings directly
                  disabled={isView}
                />

                <RHFCalendar
                  name="joiningDate"
                  label="Joining Date"
                  helperText="Please select a date"
                  disabled={isView} // Set to true if you want to disable
                  rules={{ required: 'Joining Date is required' }} // Validation rule
                />
                <RHFTextField disabled={isView} name="fathersName" label="Father's Name" />
                <RHFTextField disabled={isView} name="mothersName" label="Mother's Name" />
                <RHFTextField disabled={isView} name="spouseName" label="Spouse's Name" />

                <Stack sx={{ width: '100%' }}>
                  <Stack>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <RHFTimePicker
                            name="startTime"
                            label="Shift Start Time"
                            helperText="Select start time"
                            disabled={isView}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <RHFTimePicker
                            name="endTime"
                            label="Shift End Time"
                            helperText="Select end time"
                            disabled={isView}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Stack>

                {/* <RHFTextField                                                  // Required Later
                  sx={{ display: isEdit || isView ? 'none' : 'block' }}
                  name="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={
                    errors.password?.message || '*Password must min 8 and max 15 characters'
                  }
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <Icon icon="mdi:show" /> : <Icon icon="mdi:hide" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    inputProps: {
                      maxLength: 15,
                    },
                  }}
                /> */}

                <RHFAutocompleteMulti
                  name="assignHostel"
                  label="Assign Hostels"
                  options={hostelList?.map((item) => ({
                    label: item?.name,
                    value: item?._id,
                  }))}
                  getOptionLabel={(option) => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option?.value === value?.value}
                  disabled={isView}
                />

                {securityGuardRegex.test(selectedRole?.label) && (
                  <Stack sx={{ width: '100%' }}>
                    <RHFTextField disabled={isView} name="gateNumber" label="Gate Number" />
                  </Stack>
                )}

                {selectedRole?.label === 'warden' && (
                  <>
                    {currentStaff?.stayInHostel ? (
                      <>
                        <RHFTextField
                          disabled={isView || isEdit}
                          name="selectHostel"
                          label="Selected Hostel"
                          value={currentStaff?.hostelAllocationDetails?.hostelId?.name}
                        />
                        <RHFTextField
                          disabled={isView || isEdit}
                          name="bed"
                          label="Bed Number"
                          value={currentStaff?.hostelAllocationDetails?.bedNumber}
                        />
                        <RHFTextField
                          disabled={isView || isEdit}
                          name="bedType"
                          label="Bed Type"
                          value={bedTypeLabels[currentStaff?.hostelAllocationDetails?.bedType]}
                        />
                        <RHFTextField
                          disabled={isView || isEdit}
                          name="roomNo"
                          label="Room No."
                          value={currentStaff?.hostelAllocationDetails?.roomNumber}
                        />
                      </>
                    ) : (
                      <>
                        <RHFAutocomplete
                          name="selectHostel"
                          label="Select Hostel"
                          options={
                            hostelList?.map((item) => ({
                              label: item?.name,
                              value: item?._id,
                            })) || []
                          }
                          getOptionLabel={(option) => option?.label || ''}
                          isOptionEqualToValue={(option, value) => option?.value === value?.value}
                          onChange={handleHostelChange}
                          disabled={isView}
                          value={selectedHostel}
                        />

                        <RHFAutocomplete
                          name="selectBedType"
                          label="Select Bed Type"
                          options={
                            formattedBedTypes?.map((item) => ({
                              label: item?.label,
                              value: item?.value,
                            })) || []
                          }
                          getOptionLabel={(option) => option?.label || ''}
                          isOptionEqualToValue={(option, value) => option?.value === value?.value}
                          disabled={isView}
                          onChange={handleBedTypeChange}
                          value={selectedBedType}
                        />
                        {selectedBedType && (
                          <RHFAutocomplete
                            name="roomNo"
                            label="Select Room No."
                            options={
                              roomNo?.map((item) => ({
                                label: item?.roomNumber,
                              })) || []
                            }
                            getOptionLabel={(option) => option?.label || ''}
                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                            disabled={isView}
                            onChange={handleRoomNoTypeChange}
                          />
                        )}

                        {selectedRoomNo && (
                          <Stack spacing={2} mt={3}>
                            <Typography fontSize="16px">
                              Vacant:{' '}
                              <Chip
                                label={vacantRoom?.vacant}
                                size="medium"
                                sx={{
                                  // backgroundColor: `${vacantCountValue != 0 ? theme.palette.primary.main + '2A' : theme.palette.error.main + '2A'}`,
                                  // color: `${vacantCountValue != 0 ? theme.palette.primary.main : theme.palette.error.main}`,
                                  borderRadius: '8px',
                                  fontWeight: '500',
                                }}
                              />{' '}
                              (Free/Total)
                            </Typography>
                          </Stack>
                        )}
                        {parseInt(vacantRoom?.vacant, 10) > 0 && (
                          <RHFAutocomplete
                            name="bed"
                            label="Select Bed"
                            options={
                              roomNo?.flatMap((item) => item.bedNumber) || [] // Directly flatten bedNumber arrays
                            }
                            getOptionLabel={(option) => option || ''}
                            isOptionEqualToValue={(option, value) => option === value}
                            disabled={isView}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>

              <HostelForm
                isEdit={isEdit}
                isView={isView}
                bedDetailsArray={hostelDetails}
                setBedDetailsArray={setHostelDetails}
                hostelList={hostelList}
                watch={watch}
                setValue = {setValue}
                hostelDetailsArray={hostelDetailsArray}
                setHostelDetailsArray={setHostelDetailsArray}
              />

              <VehicleForm
                onVehiclesChange={handleVehiclesChange}
                currentData={isView || isEdit ? currentStaff : {}}
                isView={isView}
              />

              <KYCUpload
                onDocumentsChange={handleDocumentsChange}
                currentData={isView || isEdit ? currentStaff : {}}
                isView={isView}
              />
              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}>
                <LoadingButton color="inherit" variant="outlined" onClick={handleBack}>
                  Back
                </LoadingButton>
                {!isView && (
                  <LoadingButton
                    type="submit"
                    disabled={!file}
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {isEdit ? 'Save Changes' : 'Create'}
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
