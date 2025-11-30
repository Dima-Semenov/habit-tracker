'use client';

import React from 'react';
import { EmptyState, Loader } from '@/components';
import { Card, Flex, For } from '@chakra-ui/react';
import { HiOutlineRectangleGroup } from 'react-icons/hi2';
import { CreateGroupButton, GroupCard } from './components';
import { useHabitsGroup } from './hooks/useHabitsGroup';

const HabitsGroup = () => {
  const { isLoading, habitGroups } = useHabitsGroup();

  if (isLoading) {
    return <Loader />;
  }

  if (!habitGroups.length) {
    return (
      <EmptyState
        size='lg'
        title="You don't have any habit groups."
        description='Create a new group to combine habits'
        icon={HiOutlineRectangleGroup}
        actions={<CreateGroupButton />}
      />
    );
  }

  return (
    <Flex gap={4} wrap='wrap' justifyContent='space-evenly'>
      <Card.Root w='320px'>
        <Card.Body alignItems='center' justifyContent='center'>
          <CreateGroupButton />
        </Card.Body>
      </Card.Root>

      <For each={habitGroups}>
        {(group) => <GroupCard group={group} key={group._id} />}
      </For>
    </Flex>
  );
};

export default HabitsGroup;
