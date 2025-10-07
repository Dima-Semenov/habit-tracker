'use client';

import React, { FC } from 'react';
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  InputGroup,
  NumberInput,
  Portal,
  SegmentGroup,
  Select,
  Span,
  Text,
  Textarea,
} from '@chakra-ui/react';
import Modal from '../Modal';
import { Controller } from 'react-hook-form';
import { HabitType } from '@/types/habitTypes';
import { useHabitModalController } from './useHabitModalController';

interface HabitModalProps {
  isShow: boolean;
  handleHideModal: () => void;
  editHabit?: HabitType;
}
const MAX_CHARACTERS = 100;

const HabitModal: FC<HabitModalProps> = ({
  isShow,
  handleHideModal,
  editHabit = null,
}) => {
  const {
    register,
    onSubmit,
    formState,
    control,
    titleValue,
    buttonTitle,
    habitGroupOptions,
    modalTitle,
  } = useHabitModalController({
    isShow,
    handleHideModal,
    editHabit,
  });

  const { errors, isValid, isDirty } = formState;

  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>{modalTitle}</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body>
        <Box as='form' id='habit-form' onSubmit={onSubmit}>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Field.Root invalid={!!errors.type} mb={4}>
                <Field.Label>
                  What type of habit do you want to create?
                </Field.Label>
                <SegmentGroup.Root
                  size='sm'
                  onBlur={field.onBlur}
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => field.onChange(value)}
                >
                  <SegmentGroup.Items
                    items={[
                      {
                        value: 'goodHabit',
                        label: 'Good habit',
                      },
                      { value: 'badHabit', label: 'Bad habit' },
                    ]}
                  />
                  <SegmentGroup.Indicator />
                </SegmentGroup.Root>
                <Field.ErrorText>{errors.type?.message}</Field.ErrorText>
              </Field.Root>
            )}
          />

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
                pr='70px!important'
                placeholder='Example: Read books for 30 mins'
                maxLength={MAX_CHARACTERS}
              />
            </InputGroup>
            {errors.title && (
              <Field.ErrorText>{errors.title.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>
              Description{' '}
              <Field.RequiredIndicator
                fallback={
                  <Badge size='xs' variant='surface'>
                    Optional
                  </Badge>
                }
              />
            </Field.Label>
            <Textarea
              {...register('description')}
              placeholder='Add a description to your habit'
            />
          </Field.Root>

          <Field.Root mb={4}>
            <Field.Label>
              Select group
              <Field.RequiredIndicator
                fallback={
                  <Badge size='xs' variant='surface'>
                    Optional
                  </Badge>
                }
              />
            </Field.Label>
            <Controller
              control={control}
              name='groupId'
              render={({ field }) => (
                <Select.Root
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={habitGroupOptions}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder='Select group' />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.ClearTrigger cursor='pointer' p={1} />
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner zIndex='1500!important'>
                      <Select.Content>
                        {habitGroupOptions.items.map((option) => (
                          <Select.Item item={option} key={option.value}>
                            {option.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              )}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Set a goal
              <Text textStyle='xs' color='GrayText'>
                (days you will try to acquire or break your habit)
              </Text>
            </Field.Label>
            <Flex gap={4} alignItems='center'>
              <Controller
                name='target'
                control={control}
                render={({ field }) => (
                  <NumberInput.Root
                    disabled={field.disabled}
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => {
                      field.onChange(value);
                    }}
                    min={1}
                    max={60}
                    width='100px'
                  >
                    <NumberInput.Control />
                    <NumberInput.Input onBlur={field.onBlur} />
                  </NumberInput.Root>
                )}
              />
              <Text>Days</Text>
            </Flex>
          </Field.Root>
        </Box>
      </Dialog.Body>

      <Dialog.Footer>
        <Button onClick={handleHideModal} variant='outline'>
          Cancel
        </Button>

        <Button form='habit-form' type='submit' disabled={!isValid || !isDirty}>
          {buttonTitle}
        </Button>
      </Dialog.Footer>

      <Dialog.CloseTrigger asChild>
        <CloseButton size='sm' onClick={handleHideModal} />
      </Dialog.CloseTrigger>
    </Modal>
  );
};

export default HabitModal;
