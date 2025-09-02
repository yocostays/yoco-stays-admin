import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Stack,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Container,
  Icon,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import Iconify from '@components/iconify';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { capitalize } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { capitalCase } from 'change-case';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from '@routes/paths';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useSettingsContext } from '@components/settings';
import { createRoomMapAsync, getBedTypeAsync, getRoomMapAsync } from '@redux/services';
import {
  bedTypeLabels,
  bedTypeLimits,
  maintenanceStatuses,
  occupancyTypeOption,
  roomTypes,
  washroomType,
} from '@components/all-enums/hostel-room-mapping-enums';
import ConfirmDeleteDialog from '@components/confirm-dialog/ConfirmDeleteDialog';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import { RHFUpload, RHFUploadBox } from '@components/hook-form';
import { downloadFile } from '@utils/methods';
import toast from 'react-hot-toast';
import { HOST_API_KEY } from '../../../config-global';


RoomMapping.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  row: PropTypes.object,
};

export default function RoomMapping({ isEdit, isView }) {
  const [roomDetailsArray, setRoomDetailsArray] = useState([]);
  const [excelFile, setExcelFile] = useState(null);


  const [formData, setFormData] = useState({
    bedType: '',
    roomNumber: '',
    floorNumber: '',
    bedNumber: [''],
    maintenanceStatus: '',
    occupancyType: [],
    roomType: '',
    washroomType: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const [editIndex, setEditIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const { isSubmitting } = useSelector((store) => store?.hostel);
  const [bedTypes, setBedTypes] = useState([]);
  const [selectedBedType, setSelectedBedType] = useState(1);
  const { getRoomMap } = useSelector((state) => state.hostel);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const validationSchema = Yup.object().shape({
    bedType: Yup.string().required('Bed Type is required'),
    roomNumber: Yup.string().required('Room Number is required'),
    floorNumber: Yup.string().required('Floor Number is required'),
    bedNumber: Yup.array()
      .of(Yup.string().required('Each Bed Number is required'))
      .min(1, 'At least one Bed Number is required'),
    occupancyType: Yup.object(),
    maintenanceStatus: Yup.string().required('Maintenance Status is required'),
    roomType: Yup.string().required('Room Type is required'),
    washroomType: Yup.string().required('Washroom Type is required'),
    file: Yup.array().of(
      Yup.object().shape({
        url: Yup.string().required('Image URL is required'),
      })
    ),
  });

  const bulkUploadSchema = Yup.object().shape({
    file: Yup.array().of(
      Yup.object().shape({
        url: Yup.string().required('Image URL is required'),
      })
    ),
  });

  const defaultValues = {
    bedType: '',
    roomNumber: '',
    floorNumber: '',
    bedNumber: [],
    maintenanceStatus: '',
    roomType: '',
    washroomType: '',
    occupancyType: [],
  };
  const bulkDefaultValues = {
    file: [],
  };

  const token = localStorage.getItem('token');

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const handleBedNumberChange = (index, value) => {
    const newBedNumbers = [...formData.bedNumber];
    newBedNumbers[index] = value;
    setFormData((prev) => ({ ...prev, bedNumber: newBedNumbers }));
    setValue('bedNumber', newBedNumbers, { shouldValidate: true });
  };

  const handleAddBedNumber = () => {
    const bedType = Number(selectedBedType);
    const maxBedsAllowed = bedTypeLimits[bedType];

    if (!bedType) {
      enqueueSnackbar('Please select a Bed Type before adding bed numbers', { variant: 'warning' });
      return;
    }

    if (formData.bedNumber.length < maxBedsAllowed) {
      setFormData((prev) => ({ ...prev, bedNumber: [...prev.bedNumber, ''] }));
    } else {
      enqueueSnackbar(`Maximum ${maxBedsAllowed} bed(s) allowed for this Bed Type`, {
        variant: 'error',
      });
    }
  };

  const handleDeleteBedNumber = (index) => {
    const bedType = Number(selectedBedType);

    if (!bedType || formData.bedNumber.length <= 1) {
      enqueueSnackbar('At least one bed number is required or Bed Type not selected', {
        variant: 'error',
      });
      return;
    }

    const newBedNumbers = formData.bedNumber.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, bedNumber: newBedNumbers }));
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentIndex(null);
  };

  const handleDeleteOpenMenu = (index) => {
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteData = () => {
    if (deleteIndex !== null) {
      setRoomDetailsArray((prevState) => prevState.filter((_, i) => i !== deleteIndex));
      setOpenDeleteDialog(false);
      setDeleteIndex(null);
    }
  };

  const handleEditFromMenu = (index) => {
    handleEdit(index);
    handleMenuClose();
  };

  const onSubmit = () => {
    const data = getValues();
    const bedNumbersData = data?.bedNumber.map((items) => ({ bedNumber: items }));

    validationSchema
      .validate(data, { abortEarly: false })
      .then(() => {
        const newEntry = {
          ...formData,
          bedType: Number(data?.bedType),
          roomNumber: Number(data?.roomNumber),
          floorNumber: Number(data?.floorNumber),
          bedNumbers: bedNumbersData,
          maintenanceStatus: data?.maintenanceStatus,
          occupancyType: data?.occupancyType?.value,
          roomType: data?.roomType,
          washroomType: data?.washroomType,
        };
        delete newEntry.bedNumber;
        if (editIndex !== null) {
          setRoomDetailsArray((prevState) => {
            const updatedArray = [...prevState];
            updatedArray[editIndex] = newEntry;
            return updatedArray;
          });
          setEditIndex(null);
        } else {
          setRoomDetailsArray((prevState) => [...prevState, newEntry]);
        }

        reset({ ...defaultValues, bedNumber: [''] });
        setFormData({ ...defaultValues, bedNumber: [''] });
        setSelectedBedType(1);
      })
      .catch((validationErrors) => {
        console.error(validationErrors);
      });
  };

  const onTableSubmit = async () => {
    const payload = {
      hostelId: id,
      roomDetails: roomDetailsArray,
    };

    try {
      const response = await dispatch(isEdit ? ' ' : createRoomMapAsync(payload));
      if (response?.payload?.statusCode === 200) {
        reset(defaultValues);
        enqueueSnackbar(response?.payload?.message);
        navigate(PATH_DASHBOARD.addhostel.list);
      } else {
        enqueueSnackbar(response?.payload?.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
    }
  };
  const values = watch();

  const onSubmitFile = async () => {
    if (!excelFile) {
      toast.error('Please select a file to upload.', {
        position: 'top-right',
      });
      return;
    }

    const fData = new FormData();
    fData.append('file', excelFile);

    try {
      const response = await axios.post(`${HOST_API_KEY}api/hostel/bulk-upload`, fData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `${token}` }),
        },
      });

      toast.success('File uploaded successfully!');
      setExcelFile(null);
      setOpenBulkUploadDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed.');
    }
  };

  const handleBulkUpload = (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (file) {
      setExcelFile(file);
      setValue('file', [file]);
    }
  };

  const handleRemoveExcelFile = (inputFile) => {
    setExcelFile(null);
    setValue('file', []);
  };

  const file = watch('file');

  const handleEdit = (index) => {
    const rowData = roomDetailsArray[index];
    const bedNumbers = rowData.bedNumbers.map((bed) => bed.bedNumber);

    setFormData({
      bedType: rowData.bedType,
      roomNumber: rowData.roomNumber,
      floorNumber: rowData.floorNumber,
      bedNumber: bedNumbers,
      maintenanceStatus: rowData.maintenanceStatus,
      occupancyType: rowData.occupancyType?.value,
      roomType: rowData.roomType,
      washroomType: rowData.washroomType,
    });

    setValue('bedType', rowData.bedType);
    setValue('roomNumber', rowData.roomNumber);
    setValue('floorNumber', rowData.floorNumber);
    setValue('bedNumber', bedNumbers);
    setValue('maintenanceStatus', rowData.maintenanceStatus);
    setValue('roomType', rowData.roomType);
    setValue('occupancyType', {
      value: rowData.occupancyType,
      label: capitalCase(rowData.occupancyType),
    });
    setValue('washroomType', rowData.washroomType);

    setEditIndex(index);
  };

  useEffect(() => {
    const fetchRoomMap = async () => {
      try {
        const response = await dispatch(getRoomMapAsync({ hostelId: id }));
        setRoomDetailsArray(response?.payload?.data || []);
      } catch (error) {
        console.error('Failed to fetch room details:', error);
      }
    };

    const fetchBedType = async () => {
      try {
        const result = await dispatch(getBedTypeAsync({ hostelId: id })).unwrap();
        const formattedBedTypes = result.data.map((item) => ({
          label: bedTypeLabels[item.bedType] || 'Unknown',
          value: item.bedType,
        }));
        setBedTypes(formattedBedTypes);
      } catch (error) {
        console.error('Failed to fetch bed type details:', error);
      }
    };

    fetchRoomMap();
    fetchBedType();
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const methods = useForm({
    resolver: yupResolver(bulkUploadSchema),
    bulkDefaultValues,
  });

  const handleDownloadSampleFile = () => {
    const body = {
      type: 'hostel room map',
    };

    downloadFile(
      `${HOST_API_KEY}api/auth/sample-files/download`,
      'hostel-room-map.xlsx',
      body,
      token
    );
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Hostel List"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Hostel', href: PATH_DASHBOARD.addhostel.list },
          { name: 'Room Mapping' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h5">Room Details</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  onClick={handleDownloadSampleFile}
                  disabled={isView}
                >
                  Download Sample File
                </LoadingButton>

                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  onClick={() => setOpenBulkUploadDialog(true)}
                  disabled={isView}
                >
                  Bulk upload
                </LoadingButton>
              </Box>
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <Typography variant="inherit" noWrap>
                Total Number of Floor: {getRoomMap?.counts?.totalFloor || 0}
              </Typography>
              <Typography variant="inherit" noWrap>
                Total Number of Rooms: {getRoomMap?.counts?.totalRoom || 0}
              </Typography>
              <Typography variant="inherit" noWrap>
                Total Capacity of the Hostel Intake: {getRoomMap?.counts?.totalCapacity || 0}
              </Typography>
              <Typography variant="inherit" noWrap>
                Total Number of Bed: {getRoomMap?.counts?.totalBed || 0}
              </Typography>
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <Controller
                name="bedType"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={bedTypes}
                    getOptionLabel={(option) => option.label}
                    value={bedTypes.find((option) => option.value === field.value) || null}
                    onChange={(_, newValue) => {
                      setValue('bedType', newValue?.value || '', { shouldValidate: true });
                      setSelectedBedType(newValue?.value || 1);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Bed Type"
                        fullWidth
                        error={Boolean(errors.bedType)}
                        helperText={errors.bedType?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="roomNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Room Number"
                    type="number"
                    error={!!errors.roomNumber}
                    helperText={errors.roomNumber?.message}
                  />
                )}
              />

              <Controller
                name="floorNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Floor Number"
                    type="number"
                    error={!!errors.floorNumber}
                    helperText={errors.floorNumber?.message}
                  />
                )}
              />

              <Box>
                {formData?.bedNumber?.map((bedNumber, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <TextField
                      variant="outlined"
                      label="Bed Number"
                      value={bedNumber}
                      onChange={(e) => handleBedNumberChange(index, e.target.value)}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <>
                            {index === formData.bedNumber.length - 1 && (
                              <IconButton onClick={handleAddBedNumber}>
                                <Iconify icon="material-symbols:add" />
                              </IconButton>
                            )}
                            {index > 0 && (
                              <IconButton onClick={() => handleDeleteBedNumber(index)}>
                                <Iconify icon="ic:baseline-delete" />
                              </IconButton>
                            )}
                          </>
                        ),
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Controller
                name="maintenanceStatus"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={maintenanceStatuses}
                    getOptionLabel={(option) => option.label}
                    value={
                      maintenanceStatuses.find((option) => option.value === field.value) || null
                    }
                    onChange={(_, newValue) =>
                      setValue('maintenanceStatus', newValue?.value || '', {
                        shouldValidate: true,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Maintenance Status"
                        fullWidth
                        error={Boolean(errors.maintenanceStatus)}
                        helperText={errors.maintenanceStatus?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="occupancyType"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={occupancyTypeOption}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={field.value || []}
                    onChange={(_, newValue) => {
                      setValue('occupancyType', newValue || '', { shouldValidate: true });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Occupancy Type"
                        fullWidth
                        error={Boolean(errors.occupancyType)}
                        helperText={errors.occupancyType?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="roomType"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={Boolean(errors.roomType)}>
                    <FormLabel component="legend">Room Type</FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      value={field.value || ''}
                      onChange={(event) =>
                        setValue('roomType', event.target.value, { shouldValidate: true })
                      }
                    >
                      {roomTypes.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText>{errors.roomType?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="washroomType"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={Boolean(errors.washroomType)}>
                    <FormLabel component="legend">Washroom Type</FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      value={field.value || ''}
                      onChange={(event) =>
                        setValue('washroomType', event.target.value, { shouldValidate: true })
                      }
                    >
                      {washroomType.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText>{errors.washroomType?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end">
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isView}
              >
                {editIndex !== null ? 'Update Room' : 'Add Room'}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bed Type</TableCell>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Floor Number</TableCell>
                    <TableCell>Bed Numbers</TableCell>
                    <TableCell>Maintenance Status</TableCell>
                    <TableCell>Occupancy Type</TableCell>
                    <TableCell>Room Type</TableCell>
                    <TableCell>Washroom Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomDetailsArray && roomDetailsArray?.length > 0 ? (
                    roomDetailsArray?.map((room, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {(room.bedType === 1 && 'Single') ||
                            (room.bedType === 2 && 'Double') ||
                            (room.bedType === 3 && 'Triplet') ||
                            (room.bedType === 4 && 'Quadrille')}
                        </TableCell>
                        <TableCell>{room.roomNumber}</TableCell>
                        <TableCell>{room.floorNumber}</TableCell>
                        <TableCell>
                          {Array.isArray(room.bedNumbers) && room.bedNumbers.length > 0
                            ? room.bedNumbers.map((bed) => bed.bedNumber).join(', ')
                            : 'No beds available'}
                        </TableCell>
                        <TableCell>{capitalize(room.maintenanceStatus) || '-'}</TableCell>
                        <TableCell>{capitalize(room.occupancyType) || '-'}</TableCell>
                        <TableCell>{capitalCase(room.roomType) || '-'}</TableCell>
                        <TableCell>{capitalize(room.washroomType) || '-'}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                            <Iconify icon="ri:more-2-fill" />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && currentIndex === index}
                            onClose={handleMenuClose}
                          >
                            <MuiMenuItem sx={{ gap: 1 }} onClick={() => handleEditFromMenu(index)}>
                              <Iconify icon="eva:edit-fill" />
                              Edit
                            </MuiMenuItem>
                            <MuiMenuItem
                              sx={{ gap: 1 }}
                              onClick={() => handleDeleteOpenMenu(index)}
                            >
                              <Iconify icon="eva:trash-2-outline" />
                              Delete
                            </MuiMenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

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
                    <LoadingButton
                      onClick={onTableSubmit}
                      variant="contained"
                      loading={isSubmitting}
                    >
                      {isEdit ? 'Save Changes' : 'Save'}
                    </LoadingButton>
                    <LoadingButton variant="outlined" onClick={handleBack}>
                      Back
                    </LoadingButton>
                  </>
                )}
              </Stack>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onClick={handleDeleteData}
      />
      <FormProvider {...methods} onSubmit={handleSubmit(onSubmitFile)}>
        <ConfirmDialog
          open={openBulkUploadDialog}
          onClose={() => setOpenBulkUploadDialog(false)}
          sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90%' } }}
          content={
            <>
              <Typography variant="h5" sx={{ marginBottom: 3 }}>Upload File</Typography>
              {excelFile ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    p: 1,
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Icon
                    icon="vscode-icons:file-type-excel"
                    style={{ fontSize: '40px', color: 'green', marginRight: '8px' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{excelFile?.name || 'Uploaded File'}</Typography>
                  </Box>
                  {!isView && (
                    <IconButton onClick={handleRemoveExcelFile} size="small" color="red">
                      x
                    </IconButton>
                  )}
                </Box>
              ) : (
                <RHFUpload
                  thumbnail
                  name="file"
                  onDrop={handleBulkUpload}
                  onRemove={handleRemoveExcelFile}
                  accept={{
                    'application/vnd.ms-excel': [],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
                  }}
                  disabled={isView}
                />
              )}
            </>
          }
          action={
            <LoadingButton
              sx={{ maxWidth: '150px' }}
              type="submit"
              variant="contained"
              onClick={onSubmitFile}
              loading={isSubmitting}
            >
              Upload
            </LoadingButton>
          }
        />
      </FormProvider>
    </Container>
  );
}
