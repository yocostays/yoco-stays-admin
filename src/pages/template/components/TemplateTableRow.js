import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import MenuPopover from '@components/menu-popover';
import Label from '@components/label';

// ----------------------------------------------------------------------

TemplateTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function TemplateTableRow({
  index,
  row,
  selected,
  onEditRow,
  onViewRow,
  onDeleteRow,
}) {

  const { hostelName, hostelCode, status, templateCount, title, templateType, createdBy } = row;

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
              {hostelCode || '--'}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {hostelName || '--'}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {templateCount === 0 ? "0" : templateCount || '--'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>

            <Typography variant="subtitle2" noWrap>
              {status ? "Active" : "Inactive"}
            </Typography>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: status ? "green" : "red",
                opacity: status ? 1 : 0.4,
              }}
            />
          </Stack>
        </TableCell>

        {/* <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {templateType || '--'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
            {createdBy || '--'}
          </Label>
        </TableCell> */}
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
          sx={{ display: hostelName === 'superAdmin' ? 'none' : '' }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main', display: hostelName === 'superAdmin' ? 'none' : '' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
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
