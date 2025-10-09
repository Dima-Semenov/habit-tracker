'use client';

import { EmptyState, Loader } from '@/components';
import React, { useCallback } from 'react';
import { ImFileEmpty } from 'react-icons/im';
import { Box, Flex, For } from '@chakra-ui/react';
import {
  CreateHabitButton,
  HabitActionBar,
  HabitAddFloatButton,
  HabitCard,
} from './components';
import { useHabitsController } from './hooks';

const HabitPage = () => {
  const { onFilterHabits, habits, isLoading } = useHabitsController();

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <Loader />;
    }

    if (!habits.length) {
      return (
        <EmptyState
          size='lg'
          title="You don't have any habit"
          description="It's time to take control of your daily routines. Create your first habit now!"
          icon={ImFileEmpty}
          actions={<CreateHabitButton />}
        />
      );
    }

    return (
      <>
        <Flex gap={5} wrap='wrap' justifyContent='space-evenly'>
          <For each={habits}>
            {(habit) => <HabitCard key={habit._id} habit={habit} />}
          </For>
        </Flex>

        <HabitAddFloatButton />
      </>
    );
  }, [isLoading, habits]);

  return (
    <Box>
      <HabitActionBar onFilterHabits={onFilterHabits} />

      {renderContent()}
    </Box>
  );
};

export default HabitPage;
