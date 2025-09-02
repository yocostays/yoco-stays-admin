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
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Iconify from "@components/iconify";
import RHFAutocomplete from "@components/hook-form/OriginalAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import { RHFAutocompleteMulti } from "@components/hook-form";
import { getFloorList } from "@redux/services/floorService";
import { getRoomsAsync } from "@redux/services/roomsService";
import toast from "react-hot-toast";

HostelForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentHostel: PropTypes.object,
  hostelDetailsArray: PropTypes.array,
  setHostelDetailsArray: PropTypes.func,
  hostelList: PropTypes.array,
  watch: PropTypes.string,
  setValue: PropTypes.any,
};

export default function HostelForm({
  isEdit,
  isView,
  currentHostel,
  hostelDetailsArray,
  setHostelDetailsArray,
  hostelList,
  watch,
  setValue,
}) {
  const dispatch = useDispatch();
  const [hostle, setHostle] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null); // Track which row is being edited
  const [anchorEl, setAnchorEl] = useState(null); // For the three-dot menu
  const [currentIndex, setCurrentIndex] = useState(null); // Track the current row for menu
  const { floorList } = useSelector((state) => state.floors);
  const { roomsList } = useSelector((state) => state.rooms);
  const hostel = watch("hostel");
  const floors = watch("floors");
  const rooms = watch("room");

  const validationSchema = Yup.object().shape({
    hostel: Yup.object().required("Hostel is required"),
    floors: Yup.array()
      .required("Floors are required"),
    room: Yup.array()
      .required("Rooms are required")
  });

  const validateForm = async () => {
    const formData = {
      hostel: hostel || null,
      floors: floor || [],
      room: room || [],
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

  const resetForm = () => {
    // setHostle("");
    setFloor([]);
    setRoom([]);
    setErrors({});
    setValue("hostel", null);
    setHostle(null);
    setValue("floors", []);
    setValue("room", []);
  };

  const onSubmit = async () => {
    const validationErrors = await validateForm();

    const existingIndex = hostelDetailsArray?.findIndex(
      (item) => item.hostelId?._id === hostle._id
    );

    if( existingIndex !== -1 && editIndex === null){
      toast.error('Hostel already exists. Please update the existing hostel.', { position: "top-right"})
    }else {
      console.log('existingIndex', existingIndex)
        if (Object.keys(validationErrors).length === 0) {
          const newEntry = {
            floorNumber: Array.isArray(floors) ? floors : [Number(floors)], // Ensure it's an array
            hostelId: hostel,
            roomNumber: Array.isArray(rooms) ? rooms : [Number(rooms)], // Ensure it's an array
          };
          if (editIndex !== null) {
            const updatedArray = [...hostelDetailsArray];
            updatedArray[editIndex] = newEntry;
            setHostelDetailsArray(updatedArray);
            setEditIndex(null);
          } else {
            setHostelDetailsArray((prevState) => [...prevState, newEntry]);
          }
      
          resetForm();
        } else {
          setErrors(validationErrors);
        }
    }
  };

  const handleDelete = (index) => {
    const updatedArray = hostelDetailsArray.filter((_, i) => i !== index);
    setHostelDetailsArray(updatedArray);
  };

  const handleEdit = (index) => {
    const rowData = hostelDetailsArray[index];
    const selectedHostel = hostelList?.find((hostels) => hostels?._id === rowData?.hostelId?._id);

    setHostle(rowData?.hostelId || null);
    // setHostle(null);
    setFloor(rowData?.floorNumber);
    setRoom(rowData?.roomNumber);
    
    setValue("hostel", selectedHostel || null);
    setValue("floors", rowData?.floorNumber);
    setValue("room", rowData?.roomNumber);
    
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

  useEffect(() => {
    if (hostel?._id) {
      dispatch(getFloorList({ hostelId: hostel?._id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostel]);

  const payload = {
    hostelId: hostel?._id,
    floorNumbers: floors,
  };

  useEffect(() => {
    if (hostel?._id && floors?.length > 0) {
      dispatch(getRoomsAsync(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostel, floors]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5">Hostel Details</Typography>
          <Box
            rowGap={3}
            columnGap={2}
            mt={4}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
          >
            <RHFAutocomplete
              name="hostel"
              label="Select Hostel"
              options={
                hostelList || []
              }
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) =>
                option?._id === value?._id
              }
              onChange={(_, newValue) =>{
                setValue("hostel", newValue || "")
                setHostle(newValue)
                setValue("floors", [])
                setValue("room", [])
              }} // Store only the ID
              disabled={isView}
              value={hostle}
            />

            <RHFAutocompleteMulti
              name="floors"
              label="Floor"
              multiple
              options={floorList?.map((item) => ({
                label: String(item?.floorNumber),
                value: item?.floorNumber, // Ensure value is present
              }))}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
              onChange={(_, newValue) => {
                setValue(
                  "floors",
                  newValue.map((item) => item.value)
                ); // Store only numbers
                setValue("room", [])
              }}
              value={
                watch("floors")?.map((num) => ({
                  label: String(num),
                  value: num,
                })) || []
              } // Convert stored numbers back to objects for display
              disabled={isView}
            />

            <RHFAutocompleteMulti
              name="room"
              label="Rooms"
              options={roomsList?.map((item) => ({
                label: item?.roomNumber,
                value: item?.roomNumber,
              }))}
              getOptionLabel={(option) => String(option?.label) || ""}
              isOptionEqualToValue={(option, value) =>
                option?.label === value?.label
              }
              onChange={(_, newValue) => {
                setValue(
                  "room",
                  newValue.map((item) => item.value)
                ); // Store only numbers
              }}
              value={
                watch("room")?.map((num) => ({
                  label: num,
                  value: num,
                })) || []
              } // Convert stored numbers back to objects for display
              disabled={isView}
            />
          </Box>

          {!isView && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={onSubmit}>
                {editIndex !== null ? "Update Hostel Detail" : "Add Hostel Detail"}
              </Button>
            </Box>
          )}

          {/* <Typography variant="h6">Added Bed Details</Typography> */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hostel</TableCell>
                  <TableCell>Floors</TableCell>
                  <TableCell>Rooms</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              {/* {hostelDetailsArray.length > 0 ? ( */}
              <TableBody>
                {hostelDetailsArray?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row?.hostelId?.name}</TableCell>
                    <TableCell>{row?.floorNumber?.join(', ') || '--'}</TableCell>
                    <TableCell>{row?.roomNumber?.join(', ') ||'--'}</TableCell>
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
                        <MUIItem onClick={() => handleEdit(index)} disabled={isView}>
                          Edit
                        </MUIItem>
                        <MUIItem onClick={() => handleDelete(index)} disabled={isView}>
                          Delete
                        </MUIItem>
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
