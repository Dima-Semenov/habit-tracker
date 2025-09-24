import { useStore } from 'zustand';
import { habitGroupSlice } from '../slices/habitGroupSlice';
import { HabitGroupType, HabitType } from '@/types';
import { habitSlice } from '../slices/habitSlice';

export type HabitGroupWithCount = HabitGroupType & { groupHabits: HabitType[] };

export const useHabitGroup = () => {
  return [];
  // return useStore(habitGroupSlice, (state) => {
  //   const habits = habitSlice.getState().habits;

  //   return state.habitGroups.map((habitGroup) => ({
  //     ...habitGroup,
  //     groupHabits: habits.filter((habit) => habit.groupId === habitGroup.id),
  //   }));
  // });
};
