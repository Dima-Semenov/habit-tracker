'use client';

import { useNavigation } from '@/hooks';
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toaster } from '@/components/ui/toaster';
import moment from 'moment';
import { ROUTER_PATH } from '@/constants/routers';
import { useEmailVerificationStore } from '@/store/emailVerificationStore';
import {
  Box,
  Button,
  Field,
  Fieldset,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import { FiLock } from 'react-icons/fi';
import { registerAndLoginUser } from '@/actions/userActions';
import { parseError } from '@/utils/error.utility';

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

const DEFAULT_FORM_DATA = {
  username: '',
  password: '',
  confirmPassword: '',
};

const CompleteRegistrationPage = () => {
  const { email, isEmailLoaded } = useEmailVerificationStore();
  const { navigate } = useNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    clearErrors,
    setError,
    setFocus,
  } = useForm<FormValues>({ defaultValues: DEFAULT_FORM_DATA });
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data: FormValues) => {
    try {
      await registerAndLoginUser({
        email: email,
        username: data.username,
        password: data.password,
      });
      navigate(ROUTER_PATH.HOME);
    } catch (error) {
      const { field, message } = parseError(error);

      if (field) {
        const formField = field as keyof FormValues;

        setError(formField, {
          type: 'server',
          message,
        });

        setFocus(formField);
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('emailToken');

    if (token) {
      const decoded = jwtDecode<{ exp: number }>(token);
      const now = moment();
      const exp = moment.unix(decoded.exp);

      if (exp.isBefore(now)) {
        sessionStorage.removeItem('emailToken');
        navigate(ROUTER_PATH.SIGN_UP);

        setTimeout(() => {
          toaster.create({
            title:
              'The registration completion time has expired. Please try again.',
            type: 'error',
          });
        }, 0);
      }
    } else {
      if (isEmailLoaded && email) {
        navigate(ROUTER_PATH.SIGN_UP_CONFIRM);
      } else {
        navigate(ROUTER_PATH.SIGN_UP);
      }
    }
  }, [navigate, isEmailLoaded, email]);

  return (
    <>
      <Text textStyle='xs' color='gray.500' mb={4}>
        Create and confirm your password
      </Text>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} w='full' maxW='md'>
        <Stack gap={4}>
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

          <Fieldset.Root>
            <Fieldset.Content>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Password</Field.Label>
                <InputGroup startElement={<FiLock size='20' />}>
                  <PasswordInput
                    placeholder='••••••••'
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 5,
                        message: 'Password must be at least 5 characters long',
                      },
                      validate: (value) => {
                        if (confirmPasswordValue.length >= 5) {
                          const isPasswordsEqual =
                            value === confirmPasswordValue;

                          if (isPasswordsEqual) {
                            clearErrors(['confirmPassword', 'password']);
                            return isPasswordsEqual;
                          }

                          return 'Passwords do not match';
                        }
                      },
                    })}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirm password</Field.Label>
                <InputGroup startElement={<FiLock size='20' />}>
                  <PasswordInput
                    placeholder='••••••••'
                    {...register('confirmPassword', {
                      required: 'Confirm password is required',
                      minLength: {
                        value: 5,
                        message: 'Password must be at least 5 characters long',
                      },
                      validate: (value) => {
                        if (passwordValue.length >= 5) {
                          const isPasswordsEqual = value === passwordValue;

                          if (isPasswordsEqual) {
                            clearErrors(['confirmPassword', 'password']);
                            return isPasswordsEqual;
                          }

                          return 'Passwords do not match';
                        }
                      },
                    })}
                  />
                </InputGroup>
                <Field.ErrorText>
                  {errors.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>
            </Fieldset.Content>

            <Button
              type='submit'
              alignSelf='flex-end'
              variant='solid'
              w='full'
              disabled={!isDirty}
            >
              {isSubmitting ? 'Creating...' : 'Create account'}
            </Button>
          </Fieldset.Root>
        </Stack>
      </Box>
    </>
  );
};

export default CompleteRegistrationPage;
