import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  type: PropTypes.string,
  maxlength: PropTypes.number,
};

export default function RHFTextField({ name, helperText,type,maxlength = 150, ...other }) {
  const { control } = useFormContext();
 const isNumberType = type === 'number';
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type ?? 'text'}
          maxlength={maxlength}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
           inputProps={{
            maxLength: maxlength,
            ...(isNumberType && { onWheel: (e) => e.currentTarget.blur() }),
            ...other.inputProps
          }}
          {...other}
        />
      )}
    />
  );
}
