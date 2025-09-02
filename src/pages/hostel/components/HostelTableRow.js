import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ConfirmDialog from '@components/confirm-dialog';
import { LoadingButton } from '@mui/lab';
// @mui
import { IconButton, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// components
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import Tooltip from '@mui/material/Tooltip';

// ----------------------------------------------------------------------
HostelTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDiningAndMessRow: PropTypes.func,
  index: PropTypes.number,
  query: PropTypes.object,
  onRoomMap: PropTypes.func,
  legalDocument: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function HostelTableRow({
  row,
  selected,
  onEditRow,
  onDiningAndMessRow,
  index,
  query,
  onRoomMap,
  legalDocument,
  onDeleteRow,
}) {
  const {
    name,
    address,
    createdBy,
    identifier,
    isAgreementRequired,
    isLegalDocumentsAdded,
    isMessDetailsAdded,
    isRoomMapped,
    status,
  } = row;

  const { isDeleting } = useSelector((store) => store?.hostel);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { page, limit } = query;

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
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="left">{(page - 1) * limit + (index + 1)}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Tooltip title={address} arrow>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: 'capitalize',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 150, // You can adjust this value based on the desired width
                }}
              >
                {address}
              </Typography>
            </Stack>
          </Tooltip>
        </TableCell>

        {/* Add identifier cell */}
        <TableCell align="left">
          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
            {identifier}
          </Typography>
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
          <Label
            variant="soft"
            color={
              (createdBy === 'banned' && 'error') ||
              (createdBy === 'banned' && 'error') ||
              'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {createdBy}
          </Label>
        </TableCell>
      </TableRow>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
          // disabled={!modulePermit.edit}
          disabled={status === false}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDiningAndMessRow();
            handleClosePopover();
          }}
          // disabled={!modulePermit.edit}
          disabled={status === false}
        >
          <Iconify icon="material-symbols:dining-rounded" />
          {isMessDetailsAdded
            ? 'Update Dining And Mess Facilities'
            : 'Add Dining And Mess Facilities'}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onRoomMap(row);
            handleClosePopover();
          }}
          disabled={status === false}
        >
          <Iconify icon="ic:outline-map" />
          {isRoomMapped ? 'Update Mapped Room' : 'Add Mapped Room'}
        </MenuItem>

        {isAgreementRequired === true && (
          <MenuItem
            onClick={() => {
              legalDocument();
              handleClosePopover();
            }}
            disabled={status === false}
          >
            <Iconify icon="fluent:document-pdf-32-regular" />
            {isLegalDocumentsAdded ? 'Upload Legal Document' : 'Add Legal Document'}
          </MenuItem>
        )}

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
