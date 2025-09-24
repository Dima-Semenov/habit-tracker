import React, { FC } from 'react';
import Modal from './Modal';
import { Button, CloseButton, Dialog } from '@chakra-ui/react';
import { HabitGroupType } from '@/types';
import { deleteHabitGroup } from '@/app/actions/habitGroups.actions';
import { toaster } from '../ui/toaster';

interface DeleteGroupModalProps {
  isShow: boolean;
  handleHideModal: () => void;
  group: HabitGroupType;
}

const DeleteGroupModal: FC<DeleteGroupModalProps> = ({
  isShow,
  handleHideModal,
  group,
}) => {
  const handleDeleteHabitGroup = async () => {
    try {
      await deleteHabitGroup(group.id);
      toaster.create({
        title: `Habit group was deleted successfully`,
        type: 'success',
      });
    } catch {
      toaster.create({
        title: `Something went wrong.`,
        type: 'error',
      });
    } finally {
      handleHideModal();
    }
  };

  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>Are you sure you want to delete this group?</Dialog.Title>
      </Dialog.Header>

      <Dialog.Footer justifyContent='center'>
        <Button onClick={handleHideModal} variant='outline'>
          Cancel
        </Button>

        <Button onClick={handleDeleteHabitGroup} colorPalette='red'>
          Delete
        </Button>
      </Dialog.Footer>

      <Dialog.CloseTrigger asChild>
        <CloseButton size='sm' onClick={handleHideModal} />
      </Dialog.CloseTrigger>
    </Modal>
  );
};

export default DeleteGroupModal;
