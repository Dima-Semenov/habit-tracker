import { ClientOnly, Flex, IconButton, Skeleton } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { FilterByType } from './components';
import { FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';

interface HabitActionBarProps {
  onFilterHabits: (type: string) => void;
}

export type SortOrder = 'asc' | 'desc';

const HabitActionBar: FC<HabitActionBarProps> = ({ onFilterHabits }) => {
  const [sortType, setSortType] = useState<SortOrder>('asc');

  const toggleSortOrder = () => {
    setSortType((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Flex mb={4} gap={4} justifyContent='space-between'>
      <FilterByType onFilterHabits={onFilterHabits} />

      <ClientOnly fallback={<Skeleton boxSize='9' />}>
        <IconButton
          onClick={toggleSortOrder}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          {sortType === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaDownAlt />}
        </IconButton>
      </ClientOnly>
    </Flex>
  );
};

export default HabitActionBar;
