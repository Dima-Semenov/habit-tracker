import { useCallback, useMemo } from 'react';
import { toaster } from '@/components/ui/toaster';
import { GENERAL_ERROR_MESSAGE } from '@/constants';
import { useHabitsStore } from '@/store/habitsStore';
import { useUserStore } from '@/store/userStore';
import { HabitProgressType, HabitType } from '@/types/habitTypes';
import moment from 'moment';

function calculateStreak(progress: HabitProgressType[]) {
  if (!progress?.length) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  const sortedProgress = progress
    .filter((p) => p.completed)
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate: moment.Moment | null = null;

  for (const p of sortedProgress) {
    const currDate = moment(p.date).startOf('day');

    if (lastDate) {
      const diffDays = currDate.diff(lastDate, 'days');

      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastDate = currDate;
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return { currentStreak, maxStreak };
}

const TODAY_MOMENT = moment();

export const useHabitCardController = ({ habit }: { habit: HabitType }) => {
  const { user } = useUserStore();
  const { updateHabitProgress, updateHabit } = useHabitsStore();

  const completedProgerssCount = useMemo(
    () => habit.progress.filter((p) => p.completed).length,
    [habit]
  );

  const percentOfCompleted = useMemo(
    () => Math.floor((100 / parseInt(habit.target)) * completedProgerssCount),
    [habit, completedProgerssCount]
  );

  const isCompletedToday = useMemo(() => {
    const existing = habit.progress.find((p) =>
      moment(p.date).isSame(TODAY_MOMENT, 'day')
    );

    return Boolean(existing);
  }, [habit]);

  const { currentStreak, maxStreak } = useMemo(
    () => calculateStreak(habit.progress),
    [habit]
  );

  const updateProgress = useCallback(
    async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const userId = user?._id;

      if (!userId) return;

      try {
        await updateHabitProgress({
          habitId,
          completed,
        });

        toaster.create({
          title: 'Progress has been successfully enrolled.',
          type: 'success',
        });
      } catch (error) {
        toaster.create({
          title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
          type: 'error',
        });
      }
    },
    [user, updateHabitProgress]
  );

  const makeHabitAsArchived = useCallback(
    async (habitId: string) => {
      const userId = user?._id;

      if (!userId) return;

      try {
        await updateHabit({ habitId, data: { isArchived: true } });

        toaster.create({
          title: 'The habit was successfully move to archive',
          type: 'success',
        });
      } catch (error) {
        toaster.create({
          title: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
          type: 'error',
        });
      }
    },
    [user, updateHabit]
  );

  return {
    completedProgerssCount,
    percentOfCompleted,
    isCompletedToday,
    currentStreak,
    maxStreak,
    updateProgress,
    makeHabitAsArchived,
  };
};
