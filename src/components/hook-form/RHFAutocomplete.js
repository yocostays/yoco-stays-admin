/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  options: PropTypes.array, // Ensure options are passed as an array
  multiple: PropTypes.bool, // To determine whether multiple selection is allowed
};

RHFAutocomplete.defaultProps = {
  label: '',
  helperText: '',
  options: [], // Default to an empty array
  multiple: false, // Default to single selection
};

export default function RHFAutocomplete({ name, label, helperText, options = [], multiple, ...other }) {
  const { control, setValue } = useFormContext();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event, value) => {
    setSelectedOptions(value);
  };

  // Determine if the options use `label`/`value` or `_id`/`name`
  const isLabelValueFormat = options.length > 0 && options[0].label && options[0].value;

  const filteredOptions = multiple
    ? options.filter((option) =>
        !selectedOptions.some((selected) =>
          isLabelValueFormat
            ? selected.value === option.value // Compare using `value` for label-value arrays
            : selected._id === option._id // Compare using `_id` for _id-name arrays
        )
      )
    : options;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
        filterSelectedOptions
          {...field}
          multiple={multiple} // Dynamically handle multiple selections
          options={filteredOptions} // Use filtered options for multiple selections
          onChange={(event, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
            if (multiple) handleChange(event, newValue);
          }}
          getOptionLabel={(option) =>
            isLabelValueFormat ? option.label : option.name || ''
          }
          getIsOptionEqualToValue={(option, value) =>
            isLabelValueFormat
              ? option.value === value.value // Match using `value` for label-value arrays
              : option._id === value._id // Match using `_id` for _id-name arrays
          }
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




// ====================================================== Updated Code ================================

// import PropTypes from 'prop-types';
// // form
// import { useFormContext, Controller } from 'react-hook-form';
// // @mui
// import { Autocomplete, TextField } from '@mui/material';
// import { useState, useEffect } from 'react';

// // ----------------------------------------------------------------------

// RHFAutocomplete.propTypes = {
//   name: PropTypes.string.isRequired,
//   label: PropTypes.string,
//   helperText: PropTypes.node,
//   options: PropTypes.array, // Ensure options are passed as an array
//   multiple: PropTypes.bool, // To determine whether multiple selection is allowed
//   defaultValues: PropTypes.oneOfType([PropTypes.array, PropTypes.object]), // Handles default values for single or multiple selection
// };

// RHFAutocomplete.defaultProps = {
//   label: '',
//   helperText: '',
//   options: [], // Default to an empty array
//   multiple: false, // Default to single selection
//   defaultValues: [], // Default to no selected values
// };

// export default function RHFAutocomplete({
//   name,
//   label,
//   helperText,
//   options = [],
//   multiple,
//   defaultValues,
//   ...other
// }) {
//   const { control, setValue, getValues } = useFormContext();
//   const [filteredOptions, setFilteredOptions] = useState([]);

//   // Function to filter options based on selected values
//   const filterOptions = (optionsList, selectedValues) => {
//     const isLabelValueFormat = options.length > 0 && options[0].label && options[0].value;

//     return optionsList.filter(
//       (option) =>
//         !selectedValues.some((selected) =>
//           isLabelValueFormat
//             ? selected?.value === option.value // Compare using `value` for label-value arrays
//             : selected?._id === option._id // Compare using `_id` for _id-name arrays
//         )
//     );
//   };

//   useEffect(() => {
//     // Handle default values and filter options
//     const initialSelectedValues = getValues(name) || defaultValues || (multiple ? [] : null);

//     if (initialSelectedValues) {
//       setValue(name, initialSelectedValues, { shouldValidate: true });
//       setFilteredOptions(filterOptions(options, Array.isArray(initialSelectedValues) ? initialSelectedValues : [initialSelectedValues]));
//     } else {
//       setFilteredOptions(options);
//     }
//   }, [defaultValues, options, name, multiple, setValue, getValues]);

//   const handleChange = (newValue) => {
//     setValue(name, newValue, { shouldValidate: true });
//     setFilteredOptions(filterOptions(options, multiple ? newValue : [newValue]));
//   };

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <Autocomplete
//           {...field}
//           multiple={multiple}
//           options={filteredOptions}
//           filterSelectedOptions={false}
//           value={field.value || defaultValues} // Set the current value
//           onChange={(event, newValue) => {
//             handleChange(newValue);
//           }}
//           getOptionLabel={(option) =>
//             options.length > 0 && options[0].label && options[0].value
//               ? option.label
//               : option.name || ''
//           }
//           isOptionEqualToValue={(option, value) =>
//             options.length > 0 && options[0].label && options[0].value
//               ? option.value === value.value
//               : option._id === value._id
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label={label}
//               error={!!error}
//               helperText={error ? error.message : helperText}
//             />
//           )}
//           {...other}
//         />
//       )}
//     />
//   );
// }
