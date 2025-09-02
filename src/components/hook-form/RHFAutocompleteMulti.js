import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, Checkbox, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocompleteMulti.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  options: PropTypes.array.isRequired,
};

export default function RHFAutocompleteMulti({ name, label, helperText, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          multiple
          options={options}
          disableCloseOnSelect
          value={field.value || []}  // Use the field's value for controlled behavior
          onChange={(event, newValue) => field.onChange(newValue)}  // Use field.onChange to update the form state
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error ? error.message : helperText}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
