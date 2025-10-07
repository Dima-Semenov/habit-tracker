import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { FilterByType } from './components';

interface HabitActionBarProps {
  onFilterHabits: (type: string) => void;
}

const HabitActionBar: FC<HabitActionBarProps> = ({ onFilterHabits }) => {
  return (
    <Flex mb={4} gap={4}>
      <FilterByType onFilterHabits={onFilterHabits} />
    </Flex>
  );
};

export default HabitActionBar;
