'use client';

import React, { FC, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  InputGroup,
  RadioCard,
  Span,
  Textarea,
} from '@chakra-ui/react';
import Modal from './Modal';
import { Controller, useForm } from 'react-hook-form';
import {
  createHabitGroup,
  updateHabitGroup,
} from '@/app/actions/habitGroups.actions';
import { toaster } from '../ui/toaster';
import { HabitGroupType } from '@/types';

interface HabitGroupModalProps {
  isShow: boolean;
  handleHideModal: () => void;
  editHabitGroup?: HabitGroupType;
}

interface FormData {
  title: string;
  description: string;
  icon: string;
}

const emojis = [
  '🏃',
  '🏊',
  '🚶',
  '📚',
  '🥗',
  '🎨',
  '🧘',
  '🚵',
  '🏋️‍♂️',
  '😴',
  '🥛',
  '🤝',
  '💰',
  '📵',
  '💞',
  '🛁',
  '⏰',
  '🌞',
];

const MAX_CHARACTERS = 20;

const DEFAULT_FORM_DATA: FormData = {
  title: '',
  description: '',
  icon: emojis[0],
};

const HabitGroupModal: FC<HabitGroupModalProps> = ({
  isShow,
  handleHideModal,
  editHabitGroup = null,
}) => {
  const isEditMode = Boolean(editHabitGroup);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
    reset,
    setFocus,
    watch,
  } = useForm({ defaultValues: DEFAULT_FORM_DATA });

  const titleValue = watch('title');

  const onSubmit = async (data: FormData) => {
    try {
      let result = null;
      let toasterTitle = `Habit group created successfully`;

      if (isEditMode && editHabitGroup?.id) {
        result = await updateHabitGroup(editHabitGroup?.id, data);
        toasterTitle = 'Habit group was updated successfully';
      } else {
        result = await createHabitGroup(data);
      }

      if (result && result.success) {
        toaster.create({
          title: toasterTitle,
          type: 'success',
        });
      }
    } catch {
      toaster.create({
        title: `Something went wrong.`,
        type: 'error',
      });
    } finally {
      handleHideModal();
    }
  };

  useEffect(() => {
    if (isShow) {
      setFocus('title');
      reset(
        isEditMode
          ? {
              title: editHabitGroup?.title,
              description: editHabitGroup?.description,
              icon: editHabitGroup?.icon,
            }
          : DEFAULT_FORM_DATA
      );
    }
  }, [setFocus, reset, isShow, isEditMode, editHabitGroup]);

  const buttonTitle = useMemo(() => {
    if (isSubmitting) {
      return isEditMode ? 'Editing...' : 'Creating...';
    }

    return isEditMode ? 'Edit' : 'Create';
  }, [isSubmitting, isEditMode]);

  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>Create habit group</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Box as='form' id='habit-group-form' onSubmit={handleSubmit(onSubmit)}>
          <Field.Root mb={4} required invalid={!!errors.title}>
            <Field.Label>
              Title <Field.RequiredIndicator />
            </Field.Label>

            <InputGroup
              endElement={
                <Span color='fg.muted' textStyle='xs'>
                  {(titleValue || '').length} / {MAX_CHARACTERS}
                </Span>
              }
            >
              <Input
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters long',
                  },
                  maxLength: {
                    value: MAX_CHARACTERS,
                    message: `Title must not exceed ${MAX_CHARACTERS} characters`,
                  },
                })}
                placeholder='Enter group title'
                maxLength={MAX_CHARACTERS}
              />
            </InputGroup>
            {errors.title && (
              <Field.ErrorText>{errors.title.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root mb={4} required invalid={!!errors.description}>
            <Field.Label>
              Description <Field.RequiredIndicator />
            </Field.Label>
            <Textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 5,
                  message: 'Description must be at least 5 characters long',
                },
              })}
              placeholder='Enter group description'
            />

            {errors.description && (
              <Field.ErrorText>{errors.description.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>Select group Icon</Field.Label>
            <Controller
              name='icon'
              control={control}
              rules={{ required: 'Icon is required' }}
              render={({ field }) => (
                <RadioCard.Root value={field.value} onChange={field.onChange}>
                  <Flex wrap='wrap' gap={2}>
                    {emojis.map((item) => (
                      <RadioCard.Item key={item} value={item}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl
                          alignItems='center'
                          px={2}
                          py={1}
                        >
                          <RadioCard.ItemText textStyle='2xl'>
                            {item}
                          </RadioCard.ItemText>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </Flex>
                </RadioCard.Root>
              )}
            />
          </Field.Root>
        </Box>
      </Dialog.Body>
      <Dialog.Footer>
        <Button onClick={handleHideModal} variant='outline'>
          Cancel
        </Button>

        <Button
          type='submit'
          form='habit-group-form'
          disabled={!isValid || !isDirty}
        >
          {buttonTitle}
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size='sm' onClick={handleHideModal} />
      </Dialog.CloseTrigger>
    </Modal>
  );
};

export default HabitGroupModal;
