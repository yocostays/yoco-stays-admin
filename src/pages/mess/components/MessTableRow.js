import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Button,
    IconButton,
    MenuItem,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import MenuPopover from '@components/menu-popover';
import dayjs from 'dayjs';
import Label from '@components/label';

// ----------------------------------------------------------------------

MessTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    query: PropTypes.func,
    index: PropTypes.number,
};

export default function MessTableRow({
    row,
    selected,
    onEditRow,
    onViewRow,
    onSelectRow,
    onDeleteRow,
    query,
    index
}) {
    const { breakfast, lunch, hostelName, dinner, date, day, createdBy, createdAt } = row;

    const { page, limit } = query
    const [openConfirm, setOpenConfirm] = useState(false);

    const [openPopover, setOpenPopover] = useState(null);

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
                        {hostelName || "--"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {breakfast || "--"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {lunch || "--"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {dinner || "--"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {day || "--"}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {dayjs(date).format("DD-MMM-YYYY")}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
                        {createdBy || "--"}
                    </Label>
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2" noWrap>
                        {dayjs(createdAt).format('DD-MMM-YYYY HH:MM A')}
                    </Typography>
                </TableCell>
            </TableRow>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 140 }}
            >
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

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => onDeleteRow(handleCloseConfirm)}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
