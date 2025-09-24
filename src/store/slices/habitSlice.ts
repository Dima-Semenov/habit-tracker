import { HabitType } from '@/types';
import { create } from 'zustand';

interface HabitSliceState {
  habits: HabitType[];
}

export const habitSlice = create<HabitSliceState>((set) => ({
  habits: [],
  addHabit: (newHabit: HabitType) =>
    set((state) => ({ habits: [...state.habits, newHabit] })),
}));
