import { getHabits } from '@/actions/habit.actions';
import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { useLoading } from '@/hooks';
import { useUserStore } from '@/store/userStore';
import { HabitType } from '@/types/habitTypes';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useHabitsController = () => {
  const { user } = useUserStore();
  const { isLoading, startLoading, stopLoading } = useLoading(true);

  const [habits, setHabits] = useState<HabitType[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const userId = user?._id;
    if (!userId) return;

    const fetchHabits = async () => {
      startLoading();
      try {
        const habitsResponse = await getHabits({ userId });
        setHabits(habitsResponse);
      } catch (error: unknown) {
        toaster.create({
          title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
          type: 'error',
        });
      } finally {
        stopLoading();
      }
    };

    fetchHabits();
  }, [user, startLoading, stopLoading]);

  const onFilterHabits = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  const filteredHabits = useMemo(() => {
    if (filterType === 'all') return habits;

    return habits.filter((habit) => habit.type === filterType);
  }, [habits, filterType]);

  return { onFilterHabits, habits: filteredHabits, isLoading };
};
