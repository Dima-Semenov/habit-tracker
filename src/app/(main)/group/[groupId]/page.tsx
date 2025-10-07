'use client';

import React, { FC, use, useEffect, useState } from 'react';
import { getHabitGroupById } from '@/actions/habitGroups.actions';
import { Loader } from '@/components';
import { useLoading } from '@/hooks';
import { useUserStore } from '@/store/userStore';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { Box, Flex, For } from '@chakra-ui/react';

interface CurrentHabitsGroupProps {
  params: Promise<{ groupId: string }>;
}

const CurrentHabitsGroup: FC<CurrentHabitsGroupProps> = ({ params }) => {
  const { groupId } = use(params);

  const { user } = useUserStore();
  const [habitGroup, setHabitGroup] = useState<HabitGroupType | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    const loadHabitGroup = async () => {
      startLoading();

      try {
        const habitGroup = await getHabitGroupById({ groupId, userId });
        setHabitGroup(habitGroup);
      } catch (error) {
        console.log('error: ', error);
      } finally {
        stopLoading();
      }
    };

    loadHabitGroup();
  }, [user, groupId, startLoading, stopLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!habitGroup) {
    return;
  }

  return (
    <Box>
      CurrentHabitsGroup {habitGroup.title}
      <Flex gap={5}>
        <For each={habitGroup.habits}>
          {(habit) => (
            <Flex direction='column' key={habit.title}>
              <Box>{habit.title}</Box>
              <Box>{habit.description}</Box>
            </Flex>
          )}
        </For>
      </Flex>
    </Box>
  );
};

export default CurrentHabitsGroup;
