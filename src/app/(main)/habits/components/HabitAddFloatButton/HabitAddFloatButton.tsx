import { HabitModal } from '@/components';
import { Tooltip } from '@/components/ui/tooltip';
import { useModal } from '@/hooks';
import { Float, IconButton } from '@chakra-ui/react';
import React from 'react';
import { IoMdAdd } from 'react-icons/io';

const HabitAddFloatButton = () => {
  const { isShow, handleHideModal, handleShowModal } = useModal();

  return (
    <>
      <Float position='fixed' placement='bottom-end' offset={{ base: 10, md: 12 }}>
        <Tooltip content='Add new habit' showArrow>
          <IconButton
            rounded='full'
            variant='outline'
            size={{ base: 'md', md: '2xl' }}
            transition='transform 0.3s ease-in-out'
            _hover={{ transform: 'scale(1.2) rotate(90deg)' }}
            onClick={handleShowModal}
          >
            <IoMdAdd />
          </IconButton>
        </Tooltip>
      </Float>

      <HabitModal isShow={isShow} handleHideModal={handleHideModal} />
    </>
  );
};

export default HabitAddFloatButton;
