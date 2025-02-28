import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import {Box, Button, Container, Divider, TextField, Typography} from '@mui/material';
import { schema, IFormData} from '../interfaces/signInForm';
import { useNavigate } from 'react-router-dom';


const SignIn: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormData>({
    resolver: zodResolver(schema),
  });
  const [errorMessage, setErrorMessage] = useState<string>(''); 

  const navigate = useNavigate();

  const onSubmit = (data: IFormData) => {
    setErrorMessage('');
    loginUser(data).then(response => {
      console.log('login successful:', response);
      navigate('/');

    }).catch(error => {
      console.error('login failed:', error);
      setErrorMessage('Incorrect login credentials');
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 3, md: 4 },
          mt: 4,
          mb: 4,
          backgroundColor: '#f4f6f9',
          borderRadius: '10px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            background: '#E8B08E',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Sign In
        </Typography>
        
        <TextField
          margin="normal"
          label="Username"
          fullWidth
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ''}
          {...register('username')}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
        
        <TextField
          margin="normal"
          label="Password"
          fullWidth
          type="password"
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          {...register('password')}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Button
          variant="contained"
          fullWidth
          type="submit"
          size="large"
          sx={{ 
            py: '0.8rem', 
            mt: 2,
            mb: 1,
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            background: '#E8B08E',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)'
            }
          }}
        
        >
          Sign in
        </Button>
        
        <Divider sx={{ width: '100%', my: 3 }}>
          <Typography sx={{ px: 2, color: 'text.secondary' }}>or</Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">
            Don't have an account?{' '}
            <Button
              variant="text"
              component="a"
              href="/signup"
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
                ml: 1,
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
                >
                Sign Up
              </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
