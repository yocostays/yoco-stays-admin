// @mui
import { Stack, Typography } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  // const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to Yoco Stays</Typography>
      </Stack>
      <AuthLoginForm />
    </LoginLayout>
  );
}
