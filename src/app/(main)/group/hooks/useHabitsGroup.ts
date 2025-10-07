import { useEffect, useState } from 'react';
import { getHabitGroups } from '@/actions/habitGroups.actions';
import { useUserStore } from '@/store/userStore';
import { HabitGroupType } from '@/types/habitGroupTypes';
import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { useLoading } from '@/hooks';

export const useHabitsGroup = () => {
  const { user } = useUserStore();
  const { isLoading, startLoading, stopLoading } = useLoading(true);

  const [habitGroups, setHabitGroups] = useState<HabitGroupType[]>([]);

  useEffect(() => {
    const userId = user?._id;

    if (!userId) {
      return;
    }

    const loadHabitGroups = async () => {
      startLoading();

      try {
        const habitGroupsResponse = await getHabitGroups({ userId });
        setHabitGroups(habitGroupsResponse);
      } catch (error: unknown) {
        let errorMessage = GENERAL_ERROR_MESSAGE;

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toaster.create({
          title: errorMessage,
          type: 'error',
        });
      } finally {
        stopLoading();
      }
    };

    loadHabitGroups();
  }, [user, startLoading, stopLoading]);

  return { habitGroups, isLoading };
};
