import { EmptyState } from '@/components';
import { Card, Flex, For } from '@chakra-ui/react';
import React from 'react';
import { HiOutlineRectangleGroup } from 'react-icons/hi2';
import { CreateGroupButton, GroupCard } from './components';
import { getHabitGroups } from '../actions/habitGroups.actions';

const Group = async () => {
  const habitGroups = await getHabitGroups();

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
    <Flex gap={4} wrap='wrap'>
      <For each={habitGroups}>
        {(group) => <GroupCard group={group} key={group.id} />}
      </For>

      <Card.Root width='320px'>
        <Card.Body alignItems='center' justifyContent='center'>
          <CreateGroupButton />
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};

export default Group;
