/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
// @mui
import { Box, CircularProgress, TableCell, TableRow } from '@mui/material';
//
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default function TableNoData({ isLoading, isNotFound }) {
  return (
    <TableRow>
      {isLoading ? (
        <TableCell colSpan={12}>
        <Box
          sx={{
            height: '20vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
        </TableCell>
      ) : isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title="No Data"
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
