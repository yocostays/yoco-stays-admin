import PropTypes from 'prop-types';
import { useEffect } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import JoditEditor from 'jodit-react';
import '../../index.css'

// ----------------------------------------------------------------------

RHFEditor.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFEditor({ name, helperText, ...other }) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful || '',
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setValue(name, ''); 
    }
  }, [isSubmitSuccessful, name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <JoditEditor
          id={name}
          value={field?.value}
          onChange={field?.onChange}
          ref={field?.ref}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  );
}
