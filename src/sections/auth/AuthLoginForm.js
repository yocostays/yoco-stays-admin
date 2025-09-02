import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {  Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
// auth
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { postLoginApiAsync } from '@redux/services/auth';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  // const { login } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isSubmitting } = useSelector((state) => state.auth);


  const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('userName is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    userName: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(postLoginApiAsync({
        userName: data.userName,
        password: data.password,
      })).then((response) => {

        localStorage.setItem('token', response?.payload?.auth);
        if (response?.payload?.data?._id) {
          navigate('/dashboard/main');
          enqueueSnackbar(response?.payload?.message);
          localStorage.setItem('login', JSON.stringify(response?.payload?.data));
        }
        else {
          enqueueSnackbar((response?.payload?.message), { variant: 'error' });
        }
      }).catch((error) => {
        console.log('error', error)
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      })

    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="userName" label="User ID" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        {/* <Link variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
