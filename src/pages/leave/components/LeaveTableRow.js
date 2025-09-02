import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
// components
import Iconify from '@components/iconify';
import MenuPopover from '@components/menu-popover';
import Label from '@components/label';

// ----------------------------------------------------------------------

LeaveTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function LeaveTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { yocoid, name, roomNo, phone, checkin, checkout, status, email } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [showApproveReject, setShowApproveReject] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setShowApproveReject(false);
  };

  const handleYesClick = () => {
    setShowApproveReject(true);
  };

  const handleNoClick = () => {
    handleCloseConfirm();
  };

  const handleApprove = () => {
    // Add your approve logic here
    console.log('Approve clicked');
    handleCloseConfirm(); // Close the dialog
  };

  const handleReject = () => {
    // Add your reject logic here
    console.log('Reject clicked');
    handleCloseConfirm(); // Close the dialog
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
        <TableCell >
        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {yocoid}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="left">
          {email}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {checkin}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {checkout}
        </TableCell>

        <TableCell align="left">{roomNo}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {phone}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'banned' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status ?? 'Verified'}
          </Label>
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
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          Change Status
        </MenuItem>
      </MenuPopover>

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to change the status?</Typography>
        </DialogContent>
        <DialogActions>
          {!showApproveReject ? (
            <>
              <Button onClick={handleYesClick} variant="contained" color="primary">
                Yes
              </Button>
              <Button onClick={handleNoClick} variant="contained" color="secondary">
                No
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="success" onClick={handleApprove}>
                Approve
              </Button>
              <Button variant="contained" color="error" onClick={handleReject}>
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
