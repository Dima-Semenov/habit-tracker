import React, { FC } from 'react';
import { Button, CloseButton, Dialog } from '@chakra-ui/react';
import Modal from './Modal';

interface HabitModalProps {
  isShow: boolean;
  handleHideModal: () => void;
}

const HabitModal: FC<HabitModalProps> = ({ isShow, handleHideModal }) => {
  return (
    <Modal isShow={isShow}>
      <Dialog.Header>
        <Dialog.Title>Create habit</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body></Dialog.Body>

      <Dialog.Footer>
        <Button onClick={handleHideModal} variant='outline'>
          Cancel
        </Button>

        <Button onClick={handleHideModal}>Save</Button>
      </Dialog.Footer>

      <Dialog.CloseTrigger asChild>
        <CloseButton size='sm' onClick={handleHideModal} />
      </Dialog.CloseTrigger>
    </Modal>
  );
};

export default HabitModal;
