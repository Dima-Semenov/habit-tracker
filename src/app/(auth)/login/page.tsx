'use client';

import { loginUser, registerAndLoginUser } from '@/actions/userActions';
import { PasswordInput } from '@/components/ui/password-input';
import { toaster } from '@/components/ui/toaster';
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Input,
  SegmentGroup,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const DEFAULT_FORM_DATA = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULT_FORM_DATA });
  const router = useRouter();
  const [formType, setFormType] = useState<'Sign up' | 'Log in'>('Sign up');

  const isLogIn = formType === 'Log in';
  const cardTitle = isLogIn ? 'Log in' : 'Sign up';
  const cardDescription = isLogIn
    ? 'Enter your credentials to access your account.'
    : 'Fill in the form below to create an account';
  const cardButonText = isLogIn ? 'Log in' : 'Sign in';

  const onSubmit = async (data: FormValues) => {
    try {
      if (isLogIn) {
        await loginUser({ email: data.email, password: data.password });
      } else {
        await registerAndLoginUser({
          email: data.email,
          username: data.username,
          password: data.password,
        });
      }
      router.push('/');
    } catch (error) {
      toaster.create({
        title: error.message,
        type: 'error',
      });
      console.log('Login error: ', error);
      console.log('Login error message: ', error.message);
    }
  };

  return (
    <Card.Root maxW='sm'>
      <Card.Header>
        <Flex justifyContent='center' mb={8}>
          <SegmentGroup.Root
            value={formType}
            onValueChange={(e) => setFormType(e.value)}
            size='md'
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items
              items={['Sign up', 'Log in']}
              cursor='pointer'
            />
          </SegmentGroup.Root>
        </Flex>

        <Card.Title textAlign='center'>{cardTitle}</Card.Title>
        <Card.Description>{cardDescription}</Card.Description>
      </Card.Header>
      <Card.Body>
        <Box as='form' onSubmit={handleSubmit(onSubmit)} id='login-form'>
          <Stack gap='4' w='full'>
            {!isLogIn && (
              <Field.Root required invalid={!!errors.username}>
                <Field.Label>
                  Username <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder='Create your username'
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters long',
                    },
                  })}
                />
                <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
              </Field.Root>
            )}

            <Field.Root required invalid={!!errors.email}>
              <Field.Label>
                Email
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder='me@example.com'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password} required>
              <Field.Label>
                Password <Field.RequiredIndicator />
              </Field.Label>
              <PasswordInput
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 5,
                    message: 'Password must be at least 5 characters long',
                  },
                })}
              />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            {!isLogIn && (
              <Field.Root invalid={!!errors.confirmPassword} required>
                <Field.Label>
                  Confirm password <Field.RequiredIndicator />
                </Field.Label>
                <PasswordInput
                  {...register('confirmPassword', {
                    validate: (value, formValues) =>
                      value === formValues.password || 'Passwords do not match',
                  })}
                />
                <Field.ErrorText>
                  {errors.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>
            )}
          </Stack>
        </Box>
      </Card.Body>
      <Card.Footer justifyContent='center'>
        <Button variant='solid' form='login-form' type='submit'>
          {cardButonText}
        </Button>
        {isLogIn && (
          <Button variant='ghost' size='xs'>
            Forgot password
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
};

export default Login;
