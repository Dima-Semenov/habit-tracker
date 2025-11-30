'use client';

import { PasswordInput } from '@/components/ui/password-input';
import { ROUTER_PATH } from '@/constants/routers';
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
import { FiLock } from 'react-icons/fi';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useLoginController } from './useLoginController';
import { useNavigation } from '@/hooks';

const Login = () => {
  const { onSubmit, formState, register } = useLoginController();
  const { navigate } = useNavigation();
  const { errors, isDirty, isSubmitting, isValid } = formState;

  return (
    <>
      <Text textStyle='sx' color='gray.500' mb={4}>
        Login in your account
      </Text>

      <Box as='form' onSubmit={onSubmit} w='full' maxW='md'>
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
                  })}
                />
              </InputGroup>
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>

          <Button
            alignSelf='flex-end'
            variant='ghost'
            onClick={() => navigate(ROUTER_PATH.FORGOT_PASSWORD)}
          >
            Forgot password
          </Button>
          <Button
            type='submit'
            alignSelf='flex-end'
            variant='solid'
            w='full'
            disabled={!isDirty || !isValid}
          >
            {isSubmitting ? 'Entering...' : 'Sign in'}
          </Button>

          <HStack justifyContent='center'>
            <Text color='gray.500' textStyle='sm'>
              Don&apos;t have an account?
            </Text>
            <Link href={ROUTER_PATH.SIGN_UP}>Sign up</Link>
          </HStack>
        </Fieldset.Root>
      </Box>
    </>
  );
};

export default Login;
