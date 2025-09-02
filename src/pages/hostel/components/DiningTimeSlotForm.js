import * as Yup from 'yup';
import FormProvider, { RHFAutocomplete } from '@components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableContainer,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  InputLabel,
  TextField,
  Container,
} from '@mui/material';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import Iconify from '@components/iconify/Iconify';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSettingsContext } from '@components/settings';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import MenuPopover from '@components/menu-popover/MenuPopover';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { capitalCase } from 'change-case';

DiningTimeSlotForm.propTypes = {
  // isEdit: PropTypes.bool,
  // isView: PropTypes.bool,
  currentHostel: PropTypes.array,
  arrayData: PropTypes.array,
  setArrayData: PropTypes.func,
};

export default function DiningTimeSlotForm({
  // isEdit,
  // isView,
  currentHostel,
  arrayData = [],
  setArrayData,
}) {
  const themeStretch = useSettingsContext()
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updateExpectedItem, setUpdateExpectedItem] = useState(false);

  const validationSchema = Yup.object().shape({
    diningType: Yup.object().required('Dining type is required.'),
    startTime: Yup.string().required('Start time is required.'),
    endTime: Yup.string().required('End time is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      diningType: null,
      startTime: null,
      endTime: null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setValue, control } = methods;

  useEffect(() => {
    if (currentHostel) {
      const mappedData = currentHostel.map((slot) => ({
        diningType: { label: capitalCase(slot.name), value: slot.name }, // Map `name` to diningType
        startTime: dayjs(slot.startTime, "HH:mm"), // Parse startTime
        endTime: dayjs(slot.endTime, "HH:mm"), // Parse endTime
      }));
      setArrayData(mappedData); // Update arrayData with mapped data
    }
  }, [currentHostel, setArrayData]);

  const handleOpenPopover = (event, index) => {
    setSelectedRow(index);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDelete = () => {
    setArrayData(arrayData.filter((_, index) => index !== selectedRow));
    setOpenConfirm(false);
    setOpenPopover(null);
    handleClosePopover();
  };

  const handleEditButtonClick = () => {
    const editData = arrayData[selectedRow];
    if (editData) {
      setValue('diningType', editData?.diningType || null);
      setValue('startTime', editData?.startTime ? dayjs(editData.startTime) : null);
      setValue('endTime', editData?.endTime ? dayjs(editData.endTime) : null);
    }
    setUpdateExpectedItem(true); // Enable edit mode
    handleClosePopover();
  };  

  const handleCancel = () => {
    reset(defaultValues); 
    setUpdateExpectedItem(false); // Exit edit mode
    setSelectedRow(null); // Clear selected row
  };

  const onSubmit = (data) => {
    console.log('data', data);
  
    if (updateExpectedItem) {
      // Update the specific row in the array
      const updatedArray = arrayData.map((item, index) =>
        index === selectedRow
          ? {
              ...item,
              diningType: data.diningType,
              startTime: data.startTime,
              endTime: data.endTime,
            }
          : item
      );
  
      setArrayData(updatedArray); // Update the array with the edited row
    } else {
      // Add a new row
      const newData = {
        id: data._id || Math.random(), // Assign a unique ID if necessary
        diningType: data.diningType,
        startTime: data.startTime,
        endTime: data.endTime,
      };
  
      setArrayData([...arrayData, newData]);
    }
  
    // Reset the form
    handleCancel();
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel sx={{ mb: 2 }}>Dining Time Slot</InputLabel>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={2}>

                <RHFAutocomplete
                  name="diningType"
                  label="Dining Type"
                  options={DiningTypes}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                />

                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Start Time"
                        value={field.value ? dayjs(field.value) : null} // Ensure valid Day.js
                        onChange={(newValue) => field.onChange(newValue ? dayjs(newValue) : null)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  )}
                />

                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="End Time"
                        value={field.value ? dayjs(field.value) : null} // Ensure valid Day.js
                        onChange={(newValue) => field.onChange(newValue ? dayjs(newValue) : null)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{ mr: 2 }}>
                  {updateExpectedItem ? 'Update' : 'Add'}
                </Button>
                {updateExpectedItem && (
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </FormProvider>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>No.</TableCell>
                <TableCell>Dining Type</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {arrayData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <IconButton onClick={(e) => handleOpenPopover(e, index)}>
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{(row.diningType?.label ) || '-'}</TableCell>
                  <TableCell>{ dayjs(row.startTime).format('hh:mm A')}</TableCell>
                  <TableCell>{dayjs(row.endTime).format('hh:mm A')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <MenuPopover open={openPopover} onClose={handleClosePopover} anchorEl={openPopover}>
        <MenuItem onClick={handleEditButtonClick}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => setOpenConfirm(true)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete Entry"
        content="Are you sure you want to delete this entry?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />

</Container>
  );
}

const DiningTypes = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Hi-Tea', value: 'hi-tea' },
  { label: 'Dinner', value: 'dinner' },
];