'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { HabitGroupModel } from '@/models/HabitGroupModel';
import { habitGroupDTO } from '@/utils/habitGroupDTO';
import { revalidatePath } from 'next/cache';

export async function getHabitGroups({ userId }: { userId: string }) {
  try {
    await connectToDatabase();

    const habitGroups = await HabitGroupModel.find({ userId })
      .populate('habits')
      .lean();

    return JSON.parse(JSON.stringify(habitGroups));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getHabitGroups');
  }
}

export async function getHabitGroupById({
  userId,
  groupId,
}: {
  userId: string;
  groupId: string;
}) {
  try {
    await connectToDatabase();

    const habitGroup = await HabitGroupModel.findOne({
      _id: groupId,
      userId,
    })
      .populate('habits')
      .lean();

    return JSON.parse(JSON.stringify(habitGroup));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getHabitGroupById');
  }
}

export async function createHabitGroup(data: {
  title: string;
  description: string;
  emoji: string;
  userId: string;
}) {
  try {
    await connectToDatabase();
    const newHabitGroup = await HabitGroupModel.create(data);

    revalidatePath('/');
    return {
      success: true,
      data: habitGroupDTO(newHabitGroup),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createHabitGroup');
  }
}

export async function deleteHabitGroup(id: string) {
  try {
    await connectToDatabase();
    await HabitGroupModel.deleteOne({ _id: id });

    revalidatePath('/');
    return {
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to deleteHabitGroup');
  }
}

export async function updateHabitGroup(
  id: string,
  data: {
    title?: string;
    description?: string;
    emoji?: string;
  }
) {
  try {
    await connectToDatabase();

    const updatedHabitGroup = await HabitGroupModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!updatedHabitGroup) {
      throw new Error('HabitGroup not found');
    }

    revalidatePath('/');
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedHabitGroup)),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to updateHabitGroup');
  }
}
