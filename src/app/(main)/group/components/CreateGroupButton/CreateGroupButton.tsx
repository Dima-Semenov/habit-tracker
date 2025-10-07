'use client';

import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@chakra-ui/react';
import { useModal } from '@/hooks';
import { HabitGroupModal } from '@/components';

const CreateGroupButton = () => {
  const { isShow, handleShowModal, handleHideModal } = useModal();

  return (
    <>
      <Button variant='outline' onClick={handleShowModal} w='fit-content'>
        Create a new group <FiPlus />
      </Button>

      <HabitGroupModal isShow={isShow} handleHideModal={handleHideModal} />
    </>
  );
};

export default CreateGroupButton;
