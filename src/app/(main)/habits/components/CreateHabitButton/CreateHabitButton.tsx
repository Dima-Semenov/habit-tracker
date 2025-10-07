import { HabitModal } from '@/components';
import { useModal } from '@/hooks';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { FiPlus } from 'react-icons/fi';

const CreateHabitButton = () => {
  const { isShow, handleHideModal, handleShowModal } = useModal();

  return (
    <>
      <Button variant='outline' w='fit-content' onClick={handleShowModal}>
        Create a new habit <FiPlus />
      </Button>

      <HabitModal isShow={isShow} handleHideModal={handleHideModal} />
    </>
  );
};

export default CreateHabitButton;
