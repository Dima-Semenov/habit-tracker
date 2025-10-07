import React, { FC } from 'react';
import { Button, CloseButton, Dialog } from '@chakra-ui/react';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { toaster } from '@/components/ui/toaster';
import Modal from '../Modal';
import { HabitType } from '@/types/habitTypes';
import { deleteHabit } from '@/actions/habit.actions';

interface DeleteGroupModalProps {
  isShow: boolean;
  handleHideModal: () => void;
  habit: HabitType;
}

const DeleteHabitModal: FC<DeleteGroupModalProps> = ({
  isShow,
  handleHideModal,
  habit,
}) => {
  const handleDeleteHabit = async () => {
    try {
      const result = await deleteHabit(habit._id);
      if (result.success) {
        toaster.create({
          title: `Habit was deleted successfully`,
          type: 'success',
        });
      }
    } catch (error: unknown) {
      let errorMessage = GENERAL_ERROR_MESSAGE;

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toaster.create({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      handleHideModal();
    }
  };

  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>Are you sure you want to delete this habit?</Dialog.Title>
      </Dialog.Header>

      <Dialog.Footer justifyContent='center'>
        <Button onClick={handleHideModal} variant='outline'>
          Cancel
        </Button>

        <Button onClick={handleDeleteHabit} colorPalette='red'>
          Delete
        </Button>
      </Dialog.Footer>

      <Dialog.CloseTrigger asChild>
        <CloseButton size='sm' onClick={handleHideModal} />
      </Dialog.CloseTrigger>
    </Modal>
  );
};

export default DeleteHabitModal;
