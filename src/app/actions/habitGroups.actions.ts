'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { HabitGroupModel } from '@/models/HabitGroupModel';
import { HabitGroupDocument } from '@/types';
import { habitGroupDTO, habitGroupListDTO } from '@/utils/habitGroupDTO';
import { revalidatePath } from 'next/cache';

export async function getHabitGroups() {
  try {
    await connectToDatabase();
    const habitGroups: HabitGroupDocument[] = await HabitGroupModel.find();

    return habitGroupListDTO(habitGroups);
  } catch (error) {
    console.error('Error in getHabitGroups', error);
    throw new Error('Failed to fetch habitGroups');
  }
}

export async function createHabitGroup(data: {
  title: string;
  description: string;
  icon: string;
}) {
  try {
    await connectToDatabase();
    const newHabitGroup = await HabitGroupModel.create(data);

    revalidatePath('/');
    return {
      success: true,
      data: habitGroupDTO(newHabitGroup),
    };
  } catch (error) {
    console.error('Error in createHabitGroup', error);
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
  } catch (error) {
    console.error('Error in deleteHabitGroup', error);
    throw new Error('Failed to deleteHabitGroup');
  }
}

export async function updateHabitGroup(
  id: string,
  data: {
    title?: string;
    description?: string;
    icon?: string;
  }
) {
  try {
    await connectToDatabase();

    const updatedHabitGroup = await HabitGroupModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    console.log('updatedHabitGroup: ', updatedHabitGroup);
    if (!updatedHabitGroup) {
      throw new Error('HabitGroup not found');
    }

    revalidatePath('/');
    return {
      success: true,
      data: habitGroupDTO(updatedHabitGroup),
    };
  } catch (error) {
    console.error('Error in updateHabitGroup', error);
    throw new Error('Failed to updateHabitGroup');
  }
}
