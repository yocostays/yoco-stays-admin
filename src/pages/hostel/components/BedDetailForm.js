import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem as MUIItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import Iconify from '@components/iconify';

BedDetailForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentHostel: PropTypes.object,
  bedDetailsArray: PropTypes.array,
  setBedDetailsArray: PropTypes.func,
};

export default function BedDetailForm({
  isEdit,
  isView,
  currentHostel,
  bedDetailsArray,
  setBedDetailsArray,
}) {
  const [bedType, setBedType] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [accommodationFee, setAccommodationFee] = useState('');
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null); // Track which row is being edited
  const [anchorEl, setAnchorEl] = useState(null); // For the three-dot menu
  const [currentIndex, setCurrentIndex] = useState(null); // Track the current row for menu

  const bedTypes = useMemo(
    () => [
      { label: 'SINGLE', value: 1 },
      { label: 'DOUBLE', value: 2 },
      { label: 'TRIPLET', value: 3 },
      { label: 'QUADRILLE', value: 4 },
    ],
    []
  );

  const totalBeds = bedType ? bedType * numberOfRooms : 0;

  const validationSchema = Yup.object().shape({
    bedType: Yup.number().required('Bed type is required').min(1, 'Invalid bed type selected'),
    numberOfRooms: Yup.number()
      .required('Number of rooms is required')
      .min(1, 'At least one room is required'),
    accommodationFee: Yup.number()
      .required('Accommodation fee is required')
      .min(1, 'Fee cannot be negative'),
  });

  const validateForm = async () => {
    const formData = {
      bedType: bedType ? Number(bedType) : undefined,
      numberOfRooms: numberOfRooms ? Number(numberOfRooms) : undefined,
      accommodationFee: accommodationFee ? Number(accommodationFee) : undefined,
    };

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return {};
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((validationError) => {
        validationErrors[validationError.path] = validationError.message;
      });
      return validationErrors;
    }
  };

  const onSubmit = async () => {
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const newEntry = {
        bedType: bedTypes.find((type) => type.value === bedType)?.value,
        numberOfRooms: Number(numberOfRooms),
        totalBeds,
        accommodationFee: Number(accommodationFee),
      };

      if (editIndex !== null) {
        // Editing mode: update the existing entry
        const updatedArray = [...bedDetailsArray];
        updatedArray[editIndex] = newEntry;
        setBedDetailsArray(updatedArray);
        setEditIndex(null); // Exit edit mode
      } else {
        // Adding mode: add a new entry
        setBedDetailsArray((prevState) => [...prevState, newEntry]);
      }
      resetForm();
    } else {
      setErrors(validationErrors);
    }
  };

  const resetForm = () => {
    setBedType('');
    setNumberOfRooms('');
    setAccommodationFee('');
    setErrors({});
  };

  const handleDelete = (index) => {
    const updatedArray = bedDetailsArray.filter((_, i) => i !== index);
    setBedDetailsArray(updatedArray);
  };

  const handleEdit = (index) => {
    const rowData = bedDetailsArray[index];
    setBedType(rowData.bedType);
    setNumberOfRooms(rowData.numberOfRooms);
    setAccommodationFee(rowData.accommodationFee);
    setEditIndex(index); // Set the index for editing
    handleMenuClose(); // Close the menu
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index); // Track which row the menu is for
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentIndex(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5">Bed Details</Typography>
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
            <TextField
              select
              label="Bed Type"
              value={bedType || ''}
              onChange={(e) => setBedType(e.target.value)}
              error={Boolean(errors.bedType)}
              helperText={errors.bedType}
              disabled={isView}
              fullWidth
            >
              {bedTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Number Of Rooms"
              type="number"
              value={numberOfRooms}
              onChange={(e) => setNumberOfRooms(e.target.value)}
              error={Boolean(errors.numberOfRooms)}
              helperText={errors.numberOfRooms}
              disabled={isView}
              fullWidth
            />

            <TextField label="Total Beds" value={totalBeds || 0} disabled fullWidth />

            <TextField
              label="Accommodation Fee"
              type="number"
              value={accommodationFee}
              onChange={(e) => setAccommodationFee(e.target.value)}
              error={Boolean(errors.accommodationFee)}
              helperText={errors.accommodationFee}
              disabled={isView}
              fullWidth
            />
          </Box>

          {!isView && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={onSubmit}>
                {editIndex !== null ? 'Update Bed Detail' : 'Add Bed Detail'}
              </Button>
            </Box>
          )}

          {/* <Typography variant="h6">Added Bed Details</Typography> */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bed Type</TableCell>
                  <TableCell>Number of Rooms</TableCell>
                  <TableCell>Total Beds</TableCell>
                  <TableCell>Accommodation Fee</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              {/* {bedDetailsArray.length > 0 ? ( */}
              <TableBody>
                 { bedDetailsArray.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {bedTypes.find((type) => type.value === row.bedType)?.label}
                      </TableCell>
                      <TableCell>{row.numberOfRooms}</TableCell>
                      <TableCell>{row.totalBeds}</TableCell>
                      <TableCell>{row.accommodationFee}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="more"
                          onClick={(event) => handleMenuOpen(event, index)}
                        >
                          <Iconify icon="eva:more-vertical-outline" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={currentIndex === index}
                          onClose={handleMenuClose}
                        >
                          <MUIItem onClick={() => handleEdit(index)}>Edit</MUIItem>
                          <MUIItem onClick={() => handleDelete(index)}>Delete</MUIItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              {/* //  ) : (
              //   <TableRow sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              //     <Typography variant="h6"> No Data </Typography>
              //   </TableRow>
              // )} */}
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
}
