import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { useHabitsStore } from '@/store/habitsStore';
import { useUserStore } from '@/store/userStore';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useHabitsController = () => {
  const { user } = useUserStore();
  const { loading, getActiveHabits, fetchAllHabits } = useHabitsStore();
  const activeHabits = getActiveHabits();

  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    const loadHabits = async () => {
      try {
        await fetchAllHabits({ userId });
      } catch (error: unknown) {
        toaster.create({
          title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
          type: 'error',
        });
      }
    };

    loadHabits();
  }, [user, fetchAllHabits]);

  const onFilterHabits = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  const filteredHabits = useMemo(() => {
    if (filterType === 'all') {
      return activeHabits;
    }

    return activeHabits.filter((habit) => habit.type === filterType);
  }, [activeHabits, filterType]);

  return { onFilterHabits, habits: filteredHabits, isLoading: loading };
};
