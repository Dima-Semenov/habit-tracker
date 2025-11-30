'use client';

import { requestEmailVerification } from '@/actions/emailVerification.actions';
import { ROUTER_PATH } from '@/constants/routers';
import { useNavigation } from '@/hooks';
import { useEmailVerificationStore } from '@/store/emailVerificationStore';
import { parseError } from '@/utils/error.utility';
import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  InputGroup,
  Link,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';

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

const SignUp = () => {
  const { setEmail } = useEmailVerificationStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<FormValues>({ defaultValues: DEFAULT_FORM_DATA });
  const { navigate } = useNavigation();

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await requestEmailVerification({ email: data.email });

      if (result.success) {
        sessionStorage.removeItem('emailToken');
        setEmail(data.email);
        navigate(ROUTER_PATH.SIGN_UP_CONFIRM);
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

  return (
    <>
      <Text textStyle='sx' color='gray.500' mb={4}>
        Enter your email to create an account.
      </Text>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} w='full' maxW='md'>
        <Fieldset.Root>
          <Fieldset.Content>
            <Field.Root invalid={!!errors.email}>
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
          </Fieldset.Content>

          <Button
            type='submit'
            alignSelf='flex-end'
            variant='solid'
            w='full'
            // disabled={!isDirty || !isValid}
          >
            Confirm email
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

export default SignUp;
