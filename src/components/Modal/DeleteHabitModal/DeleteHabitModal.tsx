import React, { FC } from 'react';
import { Button, CloseButton, Dialog } from '@chakra-ui/react';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { toaster } from '@/components/ui/toaster';
import Modal from '../Modal';
import { HabitType } from '@/types/habitTypes';
import { useHabitsStore } from '@/store/habitsStore';

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
  const { deleteHabit } = useHabitsStore();

  const handleDeleteHabit = async () => {
    try {
      await deleteHabit({ habitId: habit._id });

      toaster.create({
        title: `Habit was deleted successfully`,
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
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
