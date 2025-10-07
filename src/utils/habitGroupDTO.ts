import { HabitGroupDocument, HabitGroupType } from '@/types/habitGroupTypes';
import { habitDTO } from './habitDTO';
import { HabitDocument } from '@/types/habitTypes';

export const habitGroupDTO = (
  habitGroup: HabitGroupDocument,
  habits: HabitDocument[] = []
): HabitGroupType => {
  return {
    id: habitGroup._id.toString(),
    title: habitGroup.title,
    description: habitGroup.description,
    userId: '1',
    // userId: habitGroup.userId.toString(),
    icon: habitGroup.icon,
    createdAt: habitGroup.createdAt.toISOString(),
    updatedAt: habitGroup.updatedAt.toISOString(),
    habitsCount: habits.length,
    habits: habits.map(habitDTO),
  };
};
