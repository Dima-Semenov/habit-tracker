import { updateHabit, updateHabitProgress } from '@/actions/habit.actions';
import { toaster } from '@/components/ui/toaster';
import { useUserStore } from '@/store/userStore';
import { HabitProgressType, HabitType } from '@/types/habitTypes';
import moment from 'moment';
import { useCallback, useMemo } from 'react';

function calculateStreak(progress: HabitProgressType[]) {
  if (!progress?.length) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // залишаємо тільки виконані дні та сортуємо по даті
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
        currentStreak = 1; // починаємо новий стрік
      }
    } else {
      currentStreak = 1; // перший день
    }

    lastDate = currDate;
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return { currentStreak, maxStreak };
}

const TODAY_MOMENT = moment();

export const useHabitCardController = ({ habit }: { habit: HabitType }) => {
  const { user } = useUserStore();

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
        const today = new Date().toISOString();

        const result = await updateHabitProgress({
          habitId,
          date: today,
          completed,
        });

        if (result.success) {
          toaster.create({
            title: 'Progress has been successfully enrolled.',
            type: 'success',
          });
        }
      } catch (error) {
        let toasterTitle = 'Something went wrong!';

        if (error instanceof Error) {
          toasterTitle = error.message;
        }

        toaster.create({
          title: toasterTitle,
          type: 'error',
        });
      }
    },
    [user]
  );

  const makeHabitAsArchived = useCallback(
    async (habitId: string) => {
      const userId = user?._id;

      if (!userId) return;

      try {
        const result = await updateHabit(habitId, { isArchived: true });

        if (result.success) {
          toaster.create({
            title: 'The habit was successfully move to archive',
            type: 'success',
          });
        }
      } catch (error) {
        let toasterTitle = 'Something went wrong!';

        if (error instanceof Error) {
          toasterTitle = error.message;
        }

        toaster.create({
          title: toasterTitle,
          type: 'error',
        });
      }
    },
    [user]
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
