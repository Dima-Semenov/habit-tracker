import { HabitGroupType } from '@/types';
import { Button, Card, Circle, Flex, Float, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import GroupOptions from '../GroupOptions/GroupOptions';

interface GroupCardProps {
  group: HabitGroupType;
}

const GroupCard: FC<GroupCardProps> = ({ group }) => (
  <Card.Root width='320px'>
    <Card.Body gap='2'>
      <Flex gap={3} align='center'>
        {group.icon && <Text textStyle='4xl'>{group.icon}</Text>}
        <Card.Title>{group.title}</Card.Title>
      </Flex>
      <Card.Description>{group.description}</Card.Description>
    </Card.Body>
    <Card.Footer justifyContent='center' gap={4}>
      <Button variant='outline'>
        <Float>
          <Circle size='5' bg='red' color='white'>
            {group.habitsCount}
          </Circle>
        </Float>
        View all habits
      </Button>

      <GroupOptions group={group} />
    </Card.Footer>
  </Card.Root>
);

export default GroupCard;
