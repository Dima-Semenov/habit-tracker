'use client';
import { resetPassword } from '@/actions/userActions';
import { PasswordInput } from '@/components/ui/password-input';
import { toaster } from '@/components/ui/toaster';
import { ROUTER_PATH } from '@/constants/routers';
import { useNavigation } from '@/hooks';
import { parseError } from '@/utils/error.utility';
import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  InputGroup,
  Link,
  Text,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FiLock } from 'react-icons/fi';

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

const DEFAULT_RESET_PASSWORD_FORM_DATA = {
  password: '',
  confirmPassword: '',
};

const ResetPasswordPage = () => {
  const { navigate } = useNavigation();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    clearErrors,
    setError,
    setFocus,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: DEFAULT_RESET_PASSWORD_FORM_DATA,
  });
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      return null;
    }

    try {
      await resetPassword({ token, newPassword: data.password });

      toaster.create({
        title: 'Password has been successfully updated.',
        type: 'success',
      });

      setTimeout(() => {
        navigate(ROUTER_PATH.LOGIN);
      }, 2000);
    } catch (error) {
      const { field, message } = parseError(error);

      if (field) {
        const formField = field as keyof ResetPasswordFormValues;

        setError(formField, {
          type: 'server',
          message,
        });

        setFocus(formField);
      }
    }
  };

  return (
    <>
      <Text textStyle='sx' color='gray.500' mb={4}>
        Create your new password
      </Text>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} w='full' maxW='md'>
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
                        const isPasswordsEqual = value === confirmPasswordValue;

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
            {isSubmitting ? 'Changing...' : 'Change password'}
          </Button>

          <HStack justifyContent='center'>
            <Text color='gray.500' textStyle='sm'>
              Already have an account?
            </Text>
            <Link href={ROUTER_PATH.LOGIN}>Log in</Link>
          </HStack>
        </Fieldset.Root>
      </Box>
    </>
  );
};

export default ResetPasswordPage;
