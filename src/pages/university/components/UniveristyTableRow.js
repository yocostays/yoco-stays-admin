import PropTypes from 'prop-types';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
// @mui
import { IconButton, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import MenuPopover from '@components/menu-popover';
import Label from '@components/label';
import CustomTooltip from '@components/custom-tooltip/CustomTooltip';

import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

UniversityTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UniversityTableRow({
  index,
  row,
  selected,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {
  const {
    name,
    address,
    googleMapLink,
    location,
    evChargingStation,
    parkingSpaces,
    status,
    createdBy,
  } = row;

  const { isDeleting } = useSelector((store) => store?.university);

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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {index + 1}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name || '--'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <CustomTooltip textData={address} />
        </TableCell>

        <TableCell>
          <CustomTooltip textData={googleMapLink} />
        </TableCell>

        <TableCell>
          <CustomTooltip textData={location} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">
              {evChargingStation === 0 ? '0' : evChargingStation || '--'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">
              {parkingSpaces === 0 ? '0' : parkingSpaces || '--'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={status ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
            {createdBy || '--'}
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
            onViewRow();
            handleClosePopover();
          }}
          disabled={status === false}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
          sx={{ display: name === 'superAdmin' ? 'none' : '' }}
          disabled={status === false}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{
            color: status ? 'error.main' : 'green',
            display: name === 'superAdmin' ? 'none' : '',
          }}
        >
          <Iconify
            icon={status ? 'ic:round-toggle-off' : 'ic:round-toggle-on'}
            width={20}
            height={20}
            style={{ marginRight: 8 }}
          />
          {status ? 'Inactive' : 'Active'}
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={`${status ? 'Inactive' : 'Active'}`}
        content={`Are you sure want to ${status ? 'Inactive' : 'Active'} ?`}
        action={
          <LoadingButton
            onClick={() => onDeleteRow(handleCloseConfirm)}
            type="button"
            variant="contained"
            loading={isDeleting}
          >
            {status ? 'Inactive' : 'Active'}
          </LoadingButton>
        }
      />
    </>
  );
}
