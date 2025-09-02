import FormProvider, { RHFAutocomplete, RHFCheckbox, RHFRadioGroup } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { getHostelListAsync, getUserByHostelAsync } from '@redux/services';
import { createNoticeAsync } from '@redux/services/notice';
import { getTemplateListAsync } from '@redux/services/templateServices';

import { PATH_DASHBOARD } from '@routes/paths';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

PushNotificationForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentNotification : PropTypes.object
};

export default function PushNotificationForm({
  isEdit = false,
  isView = false,
  currentNotification
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [getCheckedAllCategory, setCheckedAllCategory] = useState(false);
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [checkedCategoryValue, setCheckedCategoryValue] = useState([]);
  const [getStudentCheckedAll, setStudentCheckedAll] = useState(false);
  const [getStudentCheckedValue, setStudentCheckedValue] = useState([]);
//   const { categories } = useSelector((state) => state.category);
//   const { batch } = useSelector((store) => store?.batch);
//   const { courseByMulitpleCatrgory } = useSelector((store) => store?.courses);
const { hostelList } = useSelector((store) => store?.hostel);
const { isSubmitting} = useSelector((store) => store?.notice);
const {userByHostel}=useSelector((store) => store?.users);
  const { getTemplateList } = useSelector((store) => store?.template);
  const [postAsType, setPostAsType] = useState('pushNotification');
  const [sendToType, setSendToType] = useState('student');
  const POSTAS_OPTIONS = [
    { label: 'Push Notification', value: 'pushNotification' },
  ];

const NewNotificationSchema = Yup.object().shape({
  hostelId: Yup.object().required('Hostel is required'),
  userIds: Yup.array().min(1, 'Please select at least one student'),
  templateId: Yup.object().required('Template is required'),
});

  const defaultValues = useMemo(
    () => ({
      noticeType:'push notification',
      hostelId: currentNotification?.hostelId || null,
      templateId: currentNotification?.templateId || null,
      userIds: currentNotification?.studentIds || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNotification]
  );

  const methods = useForm({
    resolver: yupResolver(NewNotificationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;
  const hostelId = watch('hostelId');
console.log(errors, 'hostelId');
  const resetAllFieldState =()=>{
    setCheckedAll(false);
    setCheckedAllCategory(false);
    setCheckedValue([]);
    setCheckedCategoryValue([]);
    setStudentCheckedAll(false);
    setStudentCheckedValue([]);
    setPostAsType('sms')
    reset(defaultValues);
  }

const onSubmit = async (value) => {
  const formattedData = {
    noticeType: value.noticeType,
    hostelId: value.hostelId?._id,
    templateId: value.templateId?._id,
    userIds: value.userIds?.map(user => JSON.parse(user)._id) || [],
  };

  try {
    const response = await dispatch(createNoticeAsync(formattedData));
    if (response?.payload?.statusCode === 200) {
      reset(defaultValues);
      resetAllFieldState();
      enqueueSnackbar(response?.payload?.message, { variant: 'success' });
      navigate(PATH_DASHBOARD.notice.list);
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar('Failed to create notification', { variant: 'error' });
  }
};
  const handleChangePostAs = (event) => {
    setPostAsType(event.target.value);
    reset(defaultValues.messageMasterId)
  };


  const handleStudentChange = (event) => {
    const {
      target: { value },
    } = event;
    setStudentCheckedValue(typeof value === 'string' ? value.split(',') : value);
    setValue('userIds', typeof value === 'string' ? value.split(',') : value);
  };

//   const StudentList = getAllStudentListByType;
const handleStudentCheckedAll = (data) => {
  setStudentCheckedAll(data);
  if (data === true) {
    // Map all users from userByHostel to the required format
    const allStudents = userByHostel?.map((student) => 
      JSON.stringify({
        _id: student._id,
        name: student.name,
      })
    );
    setStudentCheckedValue(allStudents);
    setValue('userIds', allStudents);
  } else {
    // Clear selections when unchecking "Select All"
    setStudentCheckedValue([]);
    setValue('userIds', []);
  }
};


  const handleStudentChangeCheckbox = (data) => {
    setStudentCheckedAll(false);
    const index = getStudentCheckedValue.indexOf(data);
    if (index === -1) {
      setStudentCheckedValue([...getStudentCheckedValue, data]);
      setValue('userIds', [...getStudentCheckedValue, data]);
    } else {
      setStudentCheckedValue(getStudentCheckedValue.filter((item) => item !== data));
      setValue(
        'userIds',
        getStudentCheckedValue.filter((item) => item !== data)
      );
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const course =
      currentNotification?.courseIds?.map((i) => JSON.stringify({ _id: i._id, name: i.name })) ||
      [];
    const student =
      currentNotification?.studentIds?.map((i) => JSON.stringify({ _id: i._id, name: i.name })) ||
      [];
      const category =  currentNotification?.categoryIds?.map((i) => JSON.stringify({ _id: i._id, name: i.name })) ||
      [];
      setSendToType(currentNotification?.sendTo || 'student');
      setPostAsType(currentNotification?.postAs || 'sms');
    
    if(isView){
    setCheckedValue(course);
    setStudentCheckedValue(student);
    setCheckedCategoryValue(category)
    }
    // eslint-disable-next-line
  }, [currentNotification]);

  

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  useEffect(() => {
    dispatch(
      getTemplateListAsync()
      
    );
    dispatch(getHostelListAsync())

    // eslint-disable-next-line
  }, []);


  useEffect(()=>{
    if(hostelId){
        dispatch(getUserByHostelAsync({hostelId:hostelId?._id}))
    }
  },[hostelId,dispatch])

  console.log(getStudentCheckedAll,'getStudentCheckedAll')

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
           <RHFAutocomplete
                name="hostelId"
                label="Hostel Name"
                disabled={isView}
                options={hostelList}
                getOptionLabel={(option) => capitalize(option?.name)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />

                       <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">Student</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      name="userIds"
                      value={getStudentCheckedValue}
                      onChange={handleStudentChange}
                      disabled={isView}
                      input={<OutlinedInput label="Student" />}
                      renderValue={(selected) =>
                        selected
                          .map((item) => {
                            const passedItem = JSON.parse(item);
                            return `${passedItem.name}`;
                          })
                          .join(' , ')
                      }
                    >
                      <MenuItem
                        value={getStudentCheckedAll}
                        onChange={(event) => handleStudentCheckedAll(event.target.checked)}
                        disabled={isView}
                         style={{width:'100%'}}
                      >
                        <Checkbox checked={getStudentCheckedAll} />
                        <ListItemText primary="Select All" />
                      </MenuItem>
                      {userByHostel?.map((ev) => (
                        <MenuItem
                          key={ev._id}
                          value={JSON.stringify({
                            _id: ev._id,
                            name: ev.name,
                          })}
                          disabled={isView}
                        >
                          <Checkbox
                            value={JSON.stringify({
                              _id: ev._id,
                              name: ev.name,
                            })}
                            checked={
                              getStudentCheckedValue.findIndex(
                                (i) => JSON.parse(i)._id === ev._id
                              ) !== -1
                            }
                            onChange={(event) => handleStudentChangeCheckbox(event.target.value)}
                          />
                          <ListItemText primary={ev.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

              <RHFRadioGroup
                name="postAs"
                label="Post As"
                // disabled
                value= 'pushNotification'
                options={POSTAS_OPTIONS}
                row="true"
                onClick={(e) => {
                  handleChangePostAs(e);
                }}
              />
              <RHFAutocomplete
                name="templateId"
                label="Template Name"
                disabled={isView}
                options={getTemplateList}
                getOptionLabel={(option) => capitalize(option?.title)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />

            </Box>
            {isView ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton onClick={handleBack} type="button" variant="contained">
                  Back
                </LoadingButton>
              </Stack>
            ) : (
              <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Messaging' : 'Save Changes'}
                </LoadingButton>

                {isEdit && (
                  <LoadingButton
                    onClick={handleBack}
                    type="button"
                    variant="contained"
                    color="error"
                  >
                    Cancel
                  </LoadingButton>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}