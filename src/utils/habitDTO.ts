import { HabitDocument, HabitType } from '@/types/habitTypes';

export const habitDTO = (habit: HabitDocument): HabitType => {
  return {
    id: habit._id.toString(),
    title: habit.title,
    description: habit.description,
    type: habit.type,
    target: habit.target,
    groupId: habit.groupId ? habit.groupId.toString() : null,
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
    progress: JSON.parse(JSON.stringify(habit.progress)),
  };
};
