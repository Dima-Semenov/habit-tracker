import { HabitTypes } from '@/types/habitTypes';
import { Flex, For, Tag } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

const HABITS_TYPE_OPTIONS = [
  { value: 'all', label: 'All', color: 'blue' },
  { value: 'goodHabit', label: 'Good habits', color: 'green' },
  { value: 'badHabit', label: 'Bad habits', color: 'red' },
];

interface FilterByTypeProps {
  onFilterHabits: (type: string) => void;
}

type HabitTypesFilter = HabitTypes | 'all';

const FilterByType: FC<FilterByTypeProps> = ({ onFilterHabits }) => {
  const [type, setType] = useState<HabitTypesFilter>('all');

  const onTagClick = (value: HabitTypesFilter) => {
    setType(value);
    onFilterHabits(value);
  };

  return (
    <Flex gap={2}>
      <For each={HABITS_TYPE_OPTIONS}>
        {(option) => (
          <Tag.Root
            key={option.value}
            size='xl'
            cursor='pointer'
            onClick={() => onTagClick(option.value as HabitTypesFilter)}
            border={
              type === option.value
                ? `2px solid var(--chakra-colors-${option.color}-500)`
                : 'none'
            }
          >
            <Tag.Label>{option.label}</Tag.Label>
          </Tag.Root>
        )}
      </For>
    </Flex>
  );
};

export default FilterByType;
