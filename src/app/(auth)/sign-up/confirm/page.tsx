'use client';

import { confirmEmail } from '@/actions/emailVerification.actions';
import { ROUTER_PATH } from '@/constants/routers';
import { useNavigation } from '@/hooks';
import { useEmailVerificationStore } from '@/store/emailVerificationStore';
import { parseError } from '@/utils/error.utility';
import {
  Box,
  Button,
  Field,
  Highlight,
  PinInput,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormValues {
  code: string[];
}

const ConfirmEmailPage = () => {
  const { email, clearEmail, isEmailLoaded } = useEmailVerificationStore();
  const { navigate } = useNavigation();
  const { handleSubmit, control, formState, setError, setFocus } =
    useForm<FormValues>({
      defaultValues: {
        code: [],
      },
    });

  const onSubmit = async (data: FormValues) => {
    try {
      const code = parseInt(data.code.join(''));

      const result = await confirmEmail({ email, code });

      if (result.success) {
        sessionStorage.setItem('emailToken', result.emailToken);
        // clearEmail();
        navigate(ROUTER_PATH.SIGN_UP_COMPLETE_REGISTRATION);
      }
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
    if (!isEmailLoaded) {
      return;
    }

    const token = sessionStorage.getItem('emailToken');

    if (token) {
      navigate(ROUTER_PATH.SIGN_UP_COMPLETE_REGISTRATION);
    } else if (!email) {
      navigate(ROUTER_PATH.SIGN_UP);
    }
  }, [navigate, email, isEmailLoaded]);

  if (!email) {
    return null;
  }

  return (
    <>
      <Text textStyle='sx' color='gray.500' mb={2} textAlign='center'>
        <Highlight
          query={email}
          styles={{ fontWeight: 'bold', fontStyle: 'italic' }}
        >
          {`We have sent a letter to ${email}`}
        </Highlight>
        <br />
        Enter the code here.
      </Text>
      <Text textStyle='xs' color='gray.500' mb={4}>
        If you don’t see the email, check your spam or junk folder.
      </Text>

      <Box
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        w='full'
        maxW='md'
        alignItems='center'
        display='flex'
        flexDirection='column'
        gap={4}
      >
        <Field.Root invalid={!!formState.errors.code} alignItems='center'>
          <Controller
            control={control}
            name='code'
            rules={{
              validate: (value) => {
                return value.length === 6 && value.every((v) => v !== '')
                  ? true
                  : 'Please enter all 6 digits';
              },
            }}
            render={({ field }) => (
              <PinInput.Root
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                attached
              >
                <PinInput.HiddenInput />
                <PinInput.Control>
                  <PinInput.Input index={0} />
                  <PinInput.Input index={1} />
                  <PinInput.Input index={2} />
                  <PinInput.Input index={3} />
                  <PinInput.Input index={4} />
                  <PinInput.Input index={5} />
                </PinInput.Control>
              </PinInput.Root>
            )}
          />
          <Field.ErrorText>{formState.errors.code?.message}</Field.ErrorText>
        </Field.Root>

        <Button type='submit'>Submit</Button>
      </Box>
    </>
  );
};

export default ConfirmEmailPage;
