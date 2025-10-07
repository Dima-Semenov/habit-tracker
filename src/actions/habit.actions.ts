'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { HabitModel } from '@/models/HabitModel';
import { HabitProgressType, HabitTypes } from '@/types/habitTypes';
import { revalidatePath } from 'next/cache';

interface CreateHabitInput {
  title: string;
  description: string;
  type: HabitTypes;
  target: string;
  groupId: string | null;
  userId: string;
}

export async function getHabits({ userId }: { userId: string }) {
  try {
    await connectToDatabase();

    const habits = await HabitModel.find({ userId, isArchived: false })
      .populate('group')
      .lean();

    return JSON.parse(JSON.stringify(habits));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getHabits');
  }
}

export async function createHabit(createHabitData: CreateHabitInput) {
  try {
    await connectToDatabase();

    const habit = await HabitModel.create(createHabitData);

    revalidatePath('/habits');

    return {
      success: true,
      habit: JSON.parse(JSON.stringify(habit)),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createHabit');
  }
}

export async function deleteHabit(id: string) {
  try {
    await connectToDatabase();
    await HabitModel.deleteOne({ _id: id });

    revalidatePath('/habits');

    return {
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to deleteHabit');
  }
}

export async function updateHabitProgress({
  habitId,
  date,
  completed,
}: {
  habitId: string;
  date: string;
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

    const targetDate = new Date(date);
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createHabit');
  }
}

export async function updateHabit(
  id: string,
  // data: {
  //   isArchived?: boolean;
  //   title?: string;
  //   description?: string;
  //   type?: HabitTypes;
  //   groupId?: string | null;
  //   target?: string;
  // }
  data: Partial<CreateHabitInput> & {
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
      data: JSON.parse(JSON.stringify(updatedHabit)),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to updateHabit');
  }
}
