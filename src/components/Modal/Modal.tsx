import { Dialog, Portal } from '@chakra-ui/react';
import React, { FC } from 'react';

interface ModalProps {
  isShow: boolean;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isShow, children }) => (
  <Dialog.Root placement='center' open={isShow}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner p={4}>
        <Dialog.Content>{children}</Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

export default Modal;
