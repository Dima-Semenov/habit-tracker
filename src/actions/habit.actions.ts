'use server';

import moment from 'moment';
import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/HabitModel';
import { CreateHabitDataType, HabitProgressType } from '@/types/habitTypes';
import { revalidatePath } from 'next/cache';

export async function getHabits({ userId }: { userId: string }) {
  try {
    await connectToDatabase();

    const habits = await HabitModel.find({ userId }).populate('group').lean();

    return JSON.parse(JSON.stringify(habits));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getHabits');
  }
}

export async function createHabit({
  createHabitData,
}: {
  createHabitData: CreateHabitDataType;
}) {
  try {
    await connectToDatabase();

    const habit = await HabitModel.create(createHabitData);

    revalidatePath('/habits');

    return {
      success: true,
      habit: JSON.parse(JSON.stringify(habit)),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createHabit');
  }
}

export async function deleteHabit({ habitId }: { habitId: string }) {
  try {
    await connectToDatabase();
    const deletedHabit = await HabitModel.deleteOne({ _id: habitId });
    revalidatePath('/habits');

    return {
      success: true,
      habit: JSON.parse(JSON.stringify(deletedHabit)),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to deleteHabit');
  }
}

export async function updateHabitProgress({
  habitId,
  completed,
}: {
  habitId: string;
  completed: boolean;
}) {
  try {
    await connectToDatabase();

    const habit = await HabitModel.findById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.isTargetAchieved) {
      throw new Error('Target already achived');
    }
    const today = new Date().toISOString();
    const targetDate = new Date(today);
    targetDate.setHours(0, 0, 0, 0);

    const existing = habit.progress.find((progressItem: { date: Date }) => {
      return (
        progressItem.date.toISOString().slice(0, 10) ===
        targetDate.toISOString().slice(0, 10)
      );
    });

    if (existing) {
      throw new Error('Habit already completed for today');
    } else {
      habit.progress.push({ date: targetDate, completed });
    }

    const completedProgerssCount = habit.progress.filter(
      (p: HabitProgressType) => p.completed
    ).length;

    if (Number(habit.target) === completedProgerssCount) {
      habit.isTargetAchieved = true;
    }

    await habit.save();
    revalidatePath('/habits');

    return { success: true, habit: JSON.parse(JSON.stringify(habit)) };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createHabit');
  }
}

export async function updateHabit(
  id: string,
  data: Partial<CreateHabitDataType> & {
    isArchived?: boolean;
  }
) {
  try {
    await connectToDatabase();

    const updatedHabit = await HabitModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!updatedHabit) {
      throw new Error('Habit not found');
    }

    revalidatePath('/habits');
    return {
      success: true,
      habit: JSON.parse(JSON.stringify(updatedHabit)),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to updateHabit');
  }
}

export async function getTodayProgress(userId: string) {
  try {
    if (!userId) {
      return { percent: 0, completed: 0, total: 0 };
    }

    await connectToDatabase();

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const habits = await HabitModel.find({
      userId,
      isArchived: false,
      isTargetAchieved: false,
    }).lean();

    if (!habits.length) {
      return { percent: 0, completed: 0, total: 0 };
    }

    let completedToday = 0;

    for (const habit of habits) {
      const doneToday = habit.progress.find((p: HabitProgressType) => {
        const progressDate = moment(p.date);

        return (
          p.completed &&
          progressDate.isBetween(startOfDay, endOfDay, undefined, '[]')
        );
      });

      if (doneToday) {
        completedToday++;
      }
    }

    const percent = Math.round((completedToday / habits.length) * 100);

    return {
      percent,
      completed: completedToday,
      total: habits.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getTodayProgress');
  }
}
