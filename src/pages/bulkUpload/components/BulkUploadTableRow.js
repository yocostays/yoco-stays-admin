import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  TableCell,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
// components
import Label from '@components/label';
import dayjs from 'dayjs';
import { Icon } from '@iconify/react'
import moment from 'moment';

// ----------------------------------------------------------------------

BulkUploadTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  query: PropTypes.func,
  index: PropTypes.string,
};

export default function BulkUploadTableRow({ row, selected, query, index }) {
  const { fileType, originalFile, successFile, errorFile, createdBy, createdAt } = row;
  const { page, limit } = query

  const handleDownload = (url) => {
    window.location.href = url;
  }


  return (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        <Typography variant="subtitle2" noWrap>
          {(page - 1) * limit + (index + 1)}
        </Typography>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" textTransform='capitalize' noWrap>
            {fileType || '--'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Label
            variant="soft"
            color="primary"
            sx={{
              textTransform: "capitalize",
              display: "flex",
              flexDirection: "column",
              padding: "20px 15px",
              lineHeight: 1.2,
            }}
          >
            <span>{dayjs(createdAt).format("DD-MM-YYYY") || "--"}</span>
            <span>{moment(createdAt).format("hh:mm A")}</span>
          </Label>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          {originalFile ? (
            <Button
              variant='outlined'
              startIcon={<Icon icon="material-symbols:download" />}
              onClick={() => handleDownload(originalFile)}
              size='small'>
              Download
            </Button>
          ) : (
            <Typography textAlign='center'>--</Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          {successFile ? (
            <Button
              variant='outlined'
              startIcon={<Icon icon="material-symbols:download" />}
              onClick={() => handleDownload(successFile)}
              size='small'>
              Download
            </Button>
          ) : (
            <Typography textAlign='center'>--</Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          {errorFile ? (
            <Button
              variant='outlined'
              startIcon={<Icon icon="material-symbols:download" />}
              onClick={() => handleDownload(errorFile)}
              size='small'>
              Download
            </Button>
          ) : (
            <Typography textAlign='center'>--</Typography>
          )}
        </Stack>
      </TableCell>


      <TableCell align="left">
        <Label
          variant="soft"
          color='success'
          sx={{ textTransform: 'capitalize' }}
        >
          {createdBy || '--'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
