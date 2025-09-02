import React, { useEffect, useState } from 'react';
import { Box, Card, Checkbox, FormControlLabel, Typography, TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const RulesAndEmergancyForm = ({ control, errors, watch, setVisitingHourForGuest, apiData }) => {
  const [fields, setFields] = useState({
    Monday: { visible: false, value: 'monday', startTime: null, endTime: null },
    Tuesday: { visible: false, value: 'tuesday', startTime: null, endTime: null },
    Wednesday: { visible: false, value: 'wednesday', startTime: null, endTime: null },
    Thursday: { visible: false, value: 'thursday', startTime: null, endTime: null },
    Friday: { visible: false, value: 'friday', startTime: null, endTime: null },
    Saturday: { visible: false, value: 'saturday', startTime: null, endTime: null },
    Sunday: { visible: false, value: 'sunday', startTime: null, endTime: null },
  });

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [value]: {
        ...prevFields[value],
        visible: checked,
        startTime: checked ? prevFields[value].startTime : null,
        endTime: checked ? prevFields[value].endTime : null,
      },
    }));
  };

  // const transformData = () => {
  //   const data = Object.keys(fields).map((day) => {
  //     const startTime = watch(`startTime-${day.toLowerCase()}`);
  //     const endTime = watch(`endTime-${day.toLowerCase()}`);

  //     return fields[day].visible
  //       ? {
  //           day: day.toLowerCase(),
  //           isVisitorAllowed: true,
  //           startTime: startTime ? dayjs(startTime).format('HH:mm') : null,
  //           endTime: endTime ? dayjs(endTime).format('HH:mm') : null,
  //         }
  //       : {
  //           day: day.toLowerCase(),
  //           isVisitorAllowed: false,
  //         };
  //   });
  //   setVisitingHourForGuest(data);
  // };

  const transformData = () => {
    const data = Object.keys(fields).map((day) => {
      const { visible, startTime, endTime } = fields[day];
  
      return visible
        ? {
            day: day.toLowerCase(),
            isVisitorAllowed: true,
            startTime: startTime ? dayjs(startTime).format('HH:mm') : null,
            endTime: endTime ? dayjs(endTime).format('HH:mm') : null,
          }
        : {
            day: day.toLowerCase(),
            isVisitorAllowed: false,
          };
    });
    setVisitingHourForGuest(data);
  };
  

  // Populate fields with API data
  useEffect(() => {
    if (apiData) {
      const updatedFields = { ...fields };
      apiData.forEach((item) => {
        const dayKey = item.day.charAt(0).toUpperCase() + item.day.slice(1); // Capitalize the first letter
        if (updatedFields[dayKey]) {
          updatedFields[dayKey] = {
            ...updatedFields[dayKey],
            visible: item.isVisitorAllowed,
            startTime: item.startTime ? dayjs(`1970-01-01T${item.startTime}`) : null,
            endTime: item.endTime ? dayjs(`1970-01-01T${item.endTime}`) : null,
          };
        }
      });
      setFields(updatedFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiData]);

  useEffect(() => {
    transformData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, watch]);

  return (
    <Card sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Visiting Hours for Guests
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
        rowGap={3}
        columnGap={2}
        sx={{ px: 2 }}
      >
        {Object.keys(fields).map((day) => (
          <div key={day}>
            <FormControlLabel
              control={
                <Checkbox
                  value={day}
                  checked={fields[day].visible}
                  onChange={handleCheckboxChange}
                />
              }
              label={day}
            />
            {fields[day].visible && (
              <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                <Controller
                  name={`startTime-${day.toLowerCase()}`}
                  control={control}
                  defaultValue={fields[day].startTime}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label={`Start Time for ${day}`}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setFields((prevFields) => ({
                            ...prevFields,
                            [day]: {
                              ...prevFields[day],
                              startTime: newValue,
                            },
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors[`startTime-${day.toLowerCase()}`]}
                            helperText={errors[`startTime-${day.toLowerCase()}`]?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <Controller
                  name={`endTime-${day.toLowerCase()}`}
                  control={control}
                  defaultValue={fields[day].endTime}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label={`End Time for ${day}`}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setFields((prevFields) => ({
                            ...prevFields,
                            [day]: {
                              ...prevFields[day],
                              endTime: newValue,
                            },
                          }));
                        }}
                        minTime={fields[day].startTime || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors[`endTime-${day.toLowerCase()}`]}
                            helperText={errors[`endTime-${day.toLowerCase()}`]?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>
            )}
          </div>
        ))}
      </Box>
    </Card>
  );
};

export default RulesAndEmergancyForm;

RulesAndEmergancyForm.propTypes = {
  control: PropTypes.shape({}).isRequired,
  watch: PropTypes.func.isRequired,
  setVisitingHourForGuest: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string,
      message: PropTypes.string,
    })
  ).isRequired,
  apiData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      isVisitorAllowed: PropTypes.bool.isRequired,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    })
  ).isRequired,
};
