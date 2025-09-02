import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';

BulkUploadTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onSearch: PropTypes.func,
};

export default function BulkUploadTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onSearch,
}) {

  const options = [
    { label: "User", value: "user" },
    { label: "Meal", value: "meal" },
    { label: 'Food Wastage', value: "food wastage" },
    { label: 'Hostel', value: 'hostel' },
    { label: 'Hostel Room Map', value: 'hostel room map' }
  ]


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
      <Autocomplete
        size="small"
        options={options}
        value={filterName}
        onChange={(ev, value) => onFilterName(value)}
        getOptionLabel={(option) => option?.label || ''}
        isOptionEqualToValue={(option, value) => option?.value === value?._id}
        renderInput={(params) => (
          <TextField {...params} label="Type" placeholder="Select Type" fullWidth />
        )}
        sx={{ width: 480 }}
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
