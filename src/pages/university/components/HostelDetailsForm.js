import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFAutocomplete } from '@components/hook-form';
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
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Iconify from '@components/iconify/Iconify';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import MenuPopover from '@components/menu-popover/MenuPopover';
import { HostelTypes } from '@components/all-enums/UniversityEnums';

HostelDetailsForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUniversity: PropTypes.object,
  arrayData: PropTypes.array,
  setArrayData: PropTypes.func,
};

export default function HostelDetailsForm({
  isEdit,
  isView,
  currentUniversity,
  arrayData,
  setArrayData,
}) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [ExpectedItemEdit, setExpectedItemEdit] = useState(false);
  const [updateExpectedItem, setUpdateExpectedItem] = useState(false);

  const NewUserSchema = Yup.object().shape({
    hostelType: Yup.object().required('Hostel type is required.'),
    numberOfHostel: Yup.string().required('Number of hostel are required.'),
    numberOfBeds: Yup.string().required('Number of beds are required.'),
  });

  const defaultValues = useMemo(
    () => ({
      hostelType: null,
      numberOfHostel: '',
      numberOfBeds: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUniversity]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, setValue, watch, handleSubmit } = methods;

  const handleOpenPopover = (event, index) => {
    setSelectedRow(index);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleEditButtonClick = () => {
    const editData = { ...arrayData };
    setValue('hostelType', editData[selectedRow].hostelType);
    setValue('numberOfHostel', editData[selectedRow].numberOfHostel);
    setValue('numberOfBeds', editData[selectedRow].numberOfBeds);
  };

  const handleCancelClick = () => {
    setUpdateExpectedItem(false);
    setValue('hostelType', null);
    setValue('numberOfHostel', '');
    setValue('numberOfBeds', '');
  };

  const handleUpdateWarehouseDetail = () => {
    const updatedArray = arrayData.map((item, index) => {
      if (index === selectedRow) {
        return {
          ...item,
          hostelType: watch('hostelType'),
          numberOfHostel: Number(watch('numberOfHostel')),
          numberOfBeds: Number(watch('numberOfBeds')),
        };
      }
      return item;
    });
    setArrayData(updatedArray);
    handleCancelClick();
    handleClosePopover();
    setUpdateExpectedItem(false);
  };

  useEffect(() => {
    if ((currentUniversity && isEdit) || isView) {
      setArrayData(currentUniversity?.warehouses || []);
    }
  }, [currentUniversity, isEdit, isView, setArrayData]);

  const onSubmit = async (data) => {
    const hostelType = data?.hostelType;
    const numberOfHostel = Number(data.numberOfHostel);
    const numberOfBeds = Number(data.numberOfBeds);

    const newEntry = {
      id: currentUniversity?._id,
      hostelType,
      numberOfHostel,
      numberOfBeds,
    };
    reset();
    setArrayData([...arrayData, newEntry]);
    setValue('numberOfHostel', '');
    setValue('numberOfBeds', '');
  };

  const handleDeleteClick = (id) => {
    setArrayData((prevState) => {
      const newData = [...prevState];
      newData.splice(selectedRow, 1);
      return newData;
    });
    handleCloseConfirm();
  };

  useEffect(() => {
    if (ExpectedItemEdit) {
      handleEditButtonClick();
    }
    setExpectedItemEdit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ExpectedItemEdit]);

  return (
    <>
      {/* <Container maxWidth='xl' > */}
      <Card sx={{ p: 3, my: 3, width: '100%' }}>
        <FormProvider methods={methods}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel sx={{ my: 2, color: '#000' }}>Section 3: Hostel Details</InputLabel>
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
                <RHFAutocomplete
                  name="hostelType"
                  label="Hostel Type"
                  options={HostelTypes || []}
                />

                <RHFTextField name="numberOfHostel" type="number" label="Number Of Hostel" />
                <RHFTextField type="number" name="numberOfBeds" label="Number Of Beds" />
              </Box>

              <Box sx={{ my: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {!updateExpectedItem ? (
                  <Button disabled={isView} type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
                    <Iconify icon="eva:plus-fill" /> Add
                  </Button>
                ) : (
                  <>
                    <LoadingButton
                      onClick={() => {
                        handleUpdateWarehouseDetail();
                      }}
                      variant="contained"
                    >
                      Update
                    </LoadingButton>

                    <LoadingButton type="button" onClick={handleCancelClick} variant="contained">
                      Cancel
                    </LoadingButton>
                  </>
                )}
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, mt: 3 }} aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Action</TableCell>
                      <TableCell align="left">S. No.</TableCell>
                      <TableCell align="left">Hostel Type</TableCell>
                      <TableCell align="left">Number Of Hostel</TableCell>
                      <TableCell align="left">Number Of Beds</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {arrayData?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <IconButton
                            color={openPopover ? 'inherit' : 'default'}
                            onClick={(e) => {
                              handleOpenPopover(e, index);
                            }}
                            disabled={isView}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                        <TableCell align="left">{index + 1 || '-'}</TableCell>
                        <TableCell align="left">{row?.hostelType?.label || '-'}</TableCell>
                        <TableCell align="left">{row?.numberOfHostel || '-'}</TableCell>
                        <TableCell align="left">{row?.numberOfBeds || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </FormProvider>

        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={(row) => {
              setUpdateExpectedItem(true);
              setExpectedItemEdit(true);
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </MenuPopover>
      </Card>
      {/* </Container> */}

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteClick()}>
            Delete
          </Button>
        }
      />
    </>
  );
}
