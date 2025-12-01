import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import MenuPopover from '@components/menu-popover';
import dayjs from 'dayjs';
import Label from '@components/label';
import FormProvider from '@components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { assignHostelAsync, getAssignedHostelAsync, getHostelListAsync } from '@redux/services';
import { LoadingButton } from '@mui/lab';
import RHFAutocompleteMulti from '@components/hook-form/RHFAutocompleteMulti';
import { useSnackbar } from '@components/snackbar';
import CopyButton from '@components/customCopyButton/CopyButton';

// ----------------------------------------------------------------------

StaffTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    query: PropTypes.func,
    index: PropTypes.number,
    onReload: PropTypes.func,
};

export default function StaffTableRow({
    row,
    selected,
    onEditRow,
    onViewRow,
    onDeleteRow,
    onSelectRow,
    index,
    query,
    onReload,
}) {
    const { name, phone, email, userName, role, category, createdBy, createdAt, isHostelAssigned, canAssignHostel } = row;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { page, limit } = query
    const [allotedHostel, setAllotedHostel] = useState();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPopover, setOpenPopover] = useState(null);
    const [open, setOpen] = useState(false);
    const { hostelList } = useSelector((store) => store?.hostel);
    const { isSubmitting } = useSelector((store) => store?.staff);
    const [selectedHostel, setSelectedHostel] = useState(allotedHostel?.value || null)

    // Transform Hostel List to be compatible with Autocomplete options
    // eslint-disable-next-line arrow-body-style
    const hostelOptions = useMemo(() => {
        return hostelList?.map((item) => ({
            label: item?.name,
            value: item?._id
        })) || [];
    }, [hostelList]);

    const Schema = Yup.object().shape({
        hostel: Yup.array()
            .of(
                Yup.object().shape({
                    label: Yup.string(),
                    value: Yup.string().required('Hostel is required'),
                })
            )
            .required('Hostel is required'),
    });


    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues: {
            hostel: selectedHostel || [],  // Default value must match the Yup schema structure
        },
    });

    const { reset, setError, clearErrors, handleSubmit } = methods;

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    // Function to open the Assign Hostel dialog and set the pre-selected hostels
    const handleAssignHostelOpen = async () => {
        setOpen(true);
        handleClosePopover();

        // Fetch hostel list and assigned hostels
        await dispatch(getHostelListAsync({}));
        const data = { userId: row?._id };
        const res = await dispatch(getAssignedHostelAsync(data));
        const assignedHostels = res?.payload?.data || [];

        // Convert the allocated hostel to the format required by RHFAutocompleteMulti
        const preSelectedHostels = assignedHostels.map((item) => ({
            label: item?.name,
            value: item?._id,
        }));

        // Set allocated hostel and pre-select in form
        setAllotedHostel(preSelectedHostels);
        setSelectedHostel(preSelectedHostels);

        // Reset form with the pre-selected hostels
        reset({ hostel: preSelectedHostels });
    };

    const handleAssignHostelClose = () => {
        setOpen(false);
    };

    // Handle changes to the hostel selection and reset manual errors
    const handleHostelChange = (event, newValue) => {
        setSelectedHostel(newValue);

        // Clear any manual error on selecting any hostel
        if (newValue?.length > 0) {
            clearErrors('hostel');
        }
    };

    const onSubmit = async () => {

        if (!selectedHostel || selectedHostel.length === 0) {
            setError('hostel', {
                type: 'manual',
                message: 'At least one hostel must be selected',  // Set error message
            });
            return;
        }

        const payload = {
            hostelIds: selectedHostel?.map((item) => item?.value),
            staffId: row?._id,
        };

        // Dispatch your action here with the payload
        const res = await dispatch(assignHostelAsync(payload));

        if (res?.payload?.statusCode === 200) {
            enqueueSnackbar(res?.payload?.message);
            onReload()
        } else {
            enqueueSnackbar(res?.payload?.message, { variant: 'error' });
        }
        handleAssignHostelClose();
    };

    // Effect hook to reset the form when `allotedHostel` is updated
    useEffect(() => {
        if (allotedHostel?.length) {
            setSelectedHostel(allotedHostel);  // Update selectedHostel as well
        }
    }, [allotedHostel, reset]);

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {(page - 1) * limit + (index + 1)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {name || '--'}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        <Tooltip
                            title={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    {email}
                                    <CopyButton textToCopy={email} />
                                </Box>
                            }
                        >{email || '--'}</Tooltip>
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        <Tooltip
                            title={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    {phone}
                                    <CopyButton textToCopy={phone} />
                                </Box>
                            }
                        >{phone || '--'}</Tooltip>
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {userName || '--'}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {category?.name || '--'}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {role || '--'}
                    </Typography>
                </TableCell>



                <TableCell align="left">
                    <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
                        {createdBy}
                    </Label>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        {dayjs(createdAt).format('DD-MM-YYYY HH:mm A')}
                    </Typography>
                </TableCell>
            </TableRow>

            <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
                <MenuItem
                    onClick={() => {
                        onViewRow();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="carbon:view-filled" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        handleClosePopover();
                    }}
                    sx={{ display: role === 'superAdmin' ? 'none' : '' }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>

                <MenuItem onClick={handleAssignHostelOpen} sx={{ display: canAssignHostel === true ? '' : 'none' }}>
                    <Iconify icon="fluent-mdl2:assign" />
                    {isHostelAssigned === true ? 'Update Hostel' : 'Assign Hostel'}
                </MenuItem>

                {/* <MenuItem
                    onClick={() => {
                        handleOpenConfirm();
                        handleClosePopover();
                    }}
                    sx={{ color: 'error.main', display: role === 'superAdmin' ? 'none' : '' }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Delete
                </MenuItem> */}
            </MenuPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure you want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => onDeleteRow(handleCloseConfirm)}>
                        Delete
                    </Button>
                }
            />

            {/* Assign Hostel Dialog */}
            <Dialog
                open={open}
                onClose={handleAssignHostelClose}
                fullWidth
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle id="scroll-dialog-title">Assign Hostel</DialogTitle>
                    <DialogContent dividers sx={{ py: 2 }}>
                        <RHFAutocompleteMulti
                            name="hostel"
                            label="Select Hostel"
                            options={hostelOptions || []}
                            value={selectedHostel || []}
                            onChange={handleHostelChange}
                            getOptionLabel={(option) => option.label || ''}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAssignHostelClose}>Cancel</Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Assign Hostel
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </>
    );
}
