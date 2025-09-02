import Iconify from '@components/iconify';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';

AmenitiesTableToolbar.propTypes = {
  // isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onSearch: PropTypes.func,
};

export default function AmenitiesTableToolbar({
  // isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onSearch,
}) {


  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        size="small"
        onChange={(e) => onFilterName(e.target.value)}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <Button
        color="primary"
        sx={{ flexShrink: 0 }}
        onClick={onSearch}
        variant="contained"
      >
        Search
      </Button>
      <Button
        color="error"
        sx={{ flexShrink: 0 }}
        variant="contained"
        onClick={onResetFilter}
      >
        Clear
      </Button>
    </Stack>
  );
}
