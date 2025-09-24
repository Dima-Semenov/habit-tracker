'use client';

import { DeleteGroupModal, HabitGroupModal } from '@/components/Modal';
import { useModal } from '@/hooks';
import { HabitGroupType } from '@/types';
import { IconButton, Menu, Portal } from '@chakra-ui/react';
import React, { FC } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface GroupOptionsProps {
  group: HabitGroupType;
}

const GroupOptions: FC<GroupOptionsProps> = ({ group }) => {
  const { isShow, handleShowModal, handleHideModal } = useModal();
  const {
    isShow: isShowEdit,
    handleShowModal: handleShowEditModal,
    handleHideModal: handleHideEditModal,
  } = useModal();

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

      <DeleteGroupModal
        isShow={isShow}
        handleHideModal={handleHideModal}
        group={group}
      />
      <HabitGroupModal
        isShow={isShowEdit}
        handleHideModal={handleHideEditModal}
        editHabitGroup={group}
      />
    </>
  );
};

export default GroupOptions;
