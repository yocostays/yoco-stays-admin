import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {  useSelector } from 'react-redux';

// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import Image from '@components/image/Image';
// import TextMaxLine from '@components/text-max-line/TextMaxLine';
import { capitalize } from 'lodash';

// ----------------------------------------------------------------------

NoticeTablerow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number
};

export default function NoticeTablerow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
  query
}) {
  const { userName, userPhone, hostelName,templateName} = row;
  const {page, limit} = query

//   const { modulePermit } = useSelector((state) => state.menuPermission);

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

  const extractTextFromPTag = (text) => {
    const regex = /<p>(.*?)<\/p>/; // regex pattern to match the <p> tag content
    const match = regex.exec(text); // match the <p> tag content
    return match ? match[1] : text; // return content within <p> tags if found
  };

//   const extractedContent = template?.includes('<p>') ? extractTextFromPTag(template) : template;

  return (
    <>
      <TableRow hover selected={selected}>
      <TableCell>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
           <TableCell >
        <Typography variant="subtitle2" noWrap ml={1}>
          {((page -1)*limit) + (index+1)}
          </Typography>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Image
              disabledEffect      //required later
              visibleByDefault
              alt="notification"
              src={image}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            /> */}
            <Typography variant="subtitle2" noWrap>
              {userName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} sx={{maxWidth:'250px'}}>
              <Typography variant="subtitle2" noWrap>
            {userPhone}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
            {hostelName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
            {templateName ?? 
              '-'}
            </Typography>
          </Stack>
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
            // onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          disabled={!modulePermit?.remove}

        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
      </MenuPopover>

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => onDeleteRow(handleCloseConfirm)}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
