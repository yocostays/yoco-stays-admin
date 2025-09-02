import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

RHFCalendar.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  rules: PropTypes.object, // Validation rules
  disabled: PropTypes.bool,
};

export default function RHFCalendar({ name, label, helperText, rules, disabled, ...other }) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={rules} // Pass validation rules here
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            disabled={disabled} // Disable the DatePicker if disabled is true
            value={field.value || null} // Set to null if no initial value
            defaultValue={null} // Explicitly set defaultValue to null for an empty field
            onChange={(date) => field.onChange(date || null)} // Update form state on date change, setting to null if date is empty
            label={label}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!error}
                helperText={error ? error.message : helperText}
                disabled={disabled} // Apply disabled to TextField as well
                {...other}
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  );
}
