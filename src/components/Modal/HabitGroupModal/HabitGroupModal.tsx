'use client';

import React, { FC } from 'react';
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
import Modal from '../Modal';
import { Controller } from 'react-hook-form';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { useHabitGroupModalController } from './useHabitGroupModalController';
import { HABIT_GROUP_EMOJIS } from '@/constants';

interface HabitGroupModalProps {
  isShow: boolean;
  handleHideModal: () => void;
  editHabitGroup?: HabitGroupType;
}

const MAX_CHARACTERS = 70;

const HabitGroupModal: FC<HabitGroupModalProps> = ({
  isShow,
  handleHideModal,
  editHabitGroup = null,
}) => {
  const {
    formState,
    titleValue,
    register,
    control,
    buttonTitle,
    onSubmit,
    modalTitle,
  } = useHabitGroupModalController({ isShow, editHabitGroup, handleHideModal });

  const { errors, isValid, isDirty } = formState;

  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>{modalTitle}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Box as='form' id='habit-group-form' onSubmit={onSubmit}>
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
                pr='60px!important'
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
              name='emoji'
              control={control}
              rules={{ required: 'Icon is required' }}
              render={({ field }) => (
                <RadioCard.Root value={field.value} onChange={field.onChange}>
                  <Flex wrap='wrap' gap={2}>
                    {HABIT_GROUP_EMOJIS.map((emoji) => (
                      <RadioCard.Item key={emoji} value={emoji}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl
                          alignItems='center'
                          px={2}
                          py={1}
                        >
                          <RadioCard.ItemText textStyle='2xl'>
                            {emoji}
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
