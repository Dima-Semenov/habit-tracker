import React from 'react';
import { IconButton, Menu, Portal } from '@chakra-ui/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useModal, useNavigation } from '@/hooks';
import { HabitType } from '@/types/habitTypes';
import { DeleteHabitModal, HabitModal } from '@/components/Modal';

const HabitOptions = ({ habit }: { habit: HabitType }) => {
  const { isShow, handleShowModal, handleHideModal } = useModal();
  const {
    isShow: isShowEdit,
    handleShowModal: handleShowEditModal,
    handleHideModal: handleHideEditModal,
  } = useModal();
  const { navigate, openInNewTab } = useNavigation();

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton variant='outline'>
            <HiOutlineDotsVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value='open'
                onClick={() => navigate(`/habits/${habit._id}`)}
              >
                Open
              </Menu.Item>
              <Menu.Item
                value='open in a new tab'
                onClick={() => openInNewTab(`/habits/${habit._id}`)}
              >
                Open in a new tab
              </Menu.Item>

              <Menu.Item value='edit' onClick={handleShowEditModal}>
                Edit
              </Menu.Item>
              <Menu.Item
                value='delete'
                color='fg.error'
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                onClick={handleShowModal}
              >
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {isShowEdit && (
        <HabitModal
          isShow={isShowEdit}
          handleHideModal={handleHideEditModal}
          editHabit={habit}
        />
      )}

      <DeleteHabitModal
        isShow={isShow}
        handleHideModal={handleHideModal}
        habit={habit}
      />
    </>
  );
};

export default HabitOptions;
