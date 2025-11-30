'use client';

import { loginUser } from '@/actions/userActions';
import { parseError } from '@/utils/error.utility';
import { useForm } from 'react-hook-form';

type LoginFormValues = {
  email: string;
  password: string;
};

const DEFAULT_LOGIN_FORM_DATA = {
  email: '',
  password: '',
};

export const useLoginController = () => {
  const { register, handleSubmit, formState, setError, resetField, setFocus } =
    useForm<LoginFormValues>({ defaultValues: DEFAULT_LOGIN_FORM_DATA });

  const onSubmit = handleSubmit(async (data: LoginFormValues) => {
    try {
      await loginUser({ email: data.email, password: data.password });
    } catch (error) {
      const { field, message } = parseError(error);

      if (field) {
        const formField = field as keyof LoginFormValues;

        setError(formField, {
          type: 'server',
          message,
        });

        if (formField === 'email') {
          resetField('password');
        }

        setFocus(formField);
      }
    }
  });

  return { onSubmit, formState, register };
};
