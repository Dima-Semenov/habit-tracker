import { Button, Card, Circle, Flex, Float, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import GroupOptions from '../GroupOptions/GroupOptions';
import Link from 'next/link';
import { HabitGroupType } from '@/types/habitGroupTypes';

interface GroupCardProps {
  group: HabitGroupType;
}

const GroupCard: FC<GroupCardProps> = ({ group }) => (
  <Card.Root w='320px'>
    <Card.Body gap='2'>
      <Flex gap={3} align='center'>
        {group.emoji && <Text textStyle='4xl'>{group.emoji}</Text>}
        <Card.Title>{group.title}</Card.Title>
      </Flex>
  
      <Card.Description>{group.description}</Card.Description>
    </Card.Body>

    <Card.Footer justifyContent='center' gap={4}>
      <Button variant='outline'>
        <Link href={`/group/${group._id}`}>
          <Float>
            <Circle size='5' bg='red' color='white'>
              {group.habits.length}
            </Circle>
          </Float>
          View all habits
        </Link>
      </Button>

      <GroupOptions group={group} />
    </Card.Footer>
  </Card.Root>
);

export default GroupCard;
