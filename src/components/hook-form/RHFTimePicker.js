import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

RHFTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  ampm: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default function RHFTimePicker({ name, label, helperText, ampm = true, disabled = false, ...other }) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TimePicker
            ampm={ampm}
            label={label}
            disabled={disabled}
            value={field.value || null} // Ensures no default time is set
            onChange={(newValue) => {
              field.onChange(newValue); // Update form state on user selection
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!error}
                helperText={error ? error.message : helperText}
                disabled={disabled}
                sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                {...other}
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  );
}
