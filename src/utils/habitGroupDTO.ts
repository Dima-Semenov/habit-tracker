import { HabitGroupDocument, HabitGroupType } from '@/types';

export const habitGroupDTO = (habit: HabitGroupDocument): HabitGroupType => {
  return {
    id: habit._id.toString(),
    title: habit.title,
    description: habit.description,
    userId: '1',
    // userId: habit.userId.toString(),
    icon: habit.icon,
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
    habitsCount: 0,
  };
};

export const habitGroupListDTO = (habits: HabitGroupDocument[]): HabitGroupType[] => {
  return habits.map(habitGroupDTO);
};
