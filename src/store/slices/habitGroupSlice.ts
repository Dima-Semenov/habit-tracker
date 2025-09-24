import { HabitGroupType } from '@/types';
import { create } from 'zustand';

interface HabitGroupState {
  habitGroups: HabitGroupType[];
  addHabitGroup: (habit: HabitGroupType) => void;
  updateHabitGroup: (
    id: string,
    updatedHabitGroup: Partial<HabitGroupType>
  ) => void;
  removeHabitGroup: (id: string) => void;
}

export const habitGroupSlice = create<HabitGroupState>((set) => ({
  habitGroups: [],
  addHabitGroup: (newHabitGroup) =>
    set((state) => ({ habitGroups: [...state.habitGroups, newHabitGroup] })),
  updateHabitGroup: (id, updatedHabitGroup) =>
    set((state) => ({
      habitGroups: state.habitGroups.map((group) =>
        group.id === id ? { ...group, ...updatedHabitGroup } : group
      ),
    })),
  removeHabitGroup: (id) =>
    set((state) => ({
      habitGroups: state.habitGroups.filter((group) => group.id !== id),
    })),
}));
