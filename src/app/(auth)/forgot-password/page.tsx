'use client';

import { requestPasswordReset } from '@/actions/userActions';
import { ROUTER_PATH } from '@/constants/routers';
import { useNavigation } from '@/hooks';
import { parseError } from '@/utils/error.utility';
import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  InputGroup,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiArrowLeftLine } from 'react-icons/ri';

type ResetPasswordFormValues = {
  email: string;
};

const DEFAULT_RESET_PASSWORD_FORM_DATA = {
  email: '',
};

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isValid },
    setError,
    setFocus,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: DEFAULT_RESET_PASSWORD_FORM_DATA,
  });
  const { navigate } = useNavigation();

  const [isLinkSended, setIsLinkSended] = useState(false);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await requestPasswordReset({ email: data.email });
      setIsLinkSended(true);
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

  if (isLinkSended) {
    return (
      <>
        <Text textStyle='sx' color='gray.500' mb={4}>
          A link to reset your password has been sent to your email, follow the
          instructions in the email.
        </Text>

        <Button variant='solid' onClick={() => navigate(ROUTER_PATH.LOGIN)}>
          <RiArrowLeftLine />
          Back to login page
        </Button>
      </>
    );
  }

  return (
    <>
      <Text textStyle='sx' color='gray.500' mb={4}>
        Enter your email to reset your password.
      </Text>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} w='full' maxW='md'>
        <Field.Root invalid={!!errors.email} mb={6}>
          <Field.Label>Email</Field.Label>
          <InputGroup startElement={<MdOutlineMailOutline size='20' />}>
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
          </InputGroup>
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type='submit'
          alignSelf='flex-end'
          variant='solid'
          w='full'
          disabled={!isDirty || !isValid}
          mb={4}
        >
          {isSubmitting ? 'Reseting...' : 'Reset password'}
        </Button>

        <HStack justifyContent='center'>
          <Text color='gray.500' textStyle='sm'>
            Already have an account?
          </Text>
          <Link href={ROUTER_PATH.LOGIN}>Log in</Link>
        </HStack>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
