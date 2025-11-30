import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  updateHabitProgress,
} from '@/actions/habit.actions';
import { CreateHabitDataType, HabitType } from '@/types/habitTypes';
import { create } from 'zustand';

interface HabitsState {
  loading: boolean;
  habits: HabitType[];
  setHabits: (habits: HabitType[]) => void;

  fetchAllHabits: ({
    userId,
    force,
  }: {
    userId: string;
    force?: boolean;
  }) => Promise<void | HabitType[]>;
  createHabit: ({
    createHabitData,
  }: {
    createHabitData: CreateHabitDataType;
  }) => Promise<void>;
  deleteHabit: ({ habitId }: { habitId: string }) => Promise<void>;
  updateHabit: ({
    habitId,
    data,
  }: {
    habitId: string;
    data: Partial<HabitType>;
  }) => Promise<void>;
  updateHabitProgress: ({
    habitId,
    completed,
  }: {
    habitId: string;
    completed: boolean;
  }) => Promise<void>;

  getActiveHabits: () => HabitType[];
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  loading: false,
  habits: [],
  setHabits: (habits) => set({ habits }),

  fetchAllHabits: async ({ userId, force = false }) => {
    const { habits: habitsFromStore } = get();

    if (habitsFromStore.length && !force) {
      return habitsFromStore;
    }

    try {
      set({ loading: true });
      const fetchedHabits = await getHabits({ userId });

      set({ habits: fetchedHabits });
      return fetchedHabits;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  createHabit: async ({ createHabitData }) => {
    try {
      const result = await createHabit({ createHabitData });

      if (result.success) {
        const { habits: habitsFromStore } = get();

        set({ habits: [...habitsFromStore, result.habit] });
      }
    } catch (error) {
      throw error;
    }
  },
  deleteHabit: async ({ habitId }) => {
    try {
      const result = await deleteHabit({ habitId });

      if (result.success) {
        const { habits: habitsFromStore } = get();

        set({
          habits: habitsFromStore.filter((habit) => habit._id !== habitId),
        });
      }
    } catch (error) {
      throw error;
    }
  },
  updateHabit: async ({ habitId, data }) => {
    try {
      const result = await updateHabit(habitId, data);

      if (result.success) {
        const { habits: habitsFromStore } = get();
        const updatedHabit = result.habit;

        set({
          habits: habitsFromStore.map((habit) =>
            habit._id === habitId ? updatedHabit : habit
          ),
        });
      }
    } catch (error) {
      throw error;
    }
  },
  updateHabitProgress: async ({ habitId, completed }) => {
    try {
      const result = await updateHabitProgress({ habitId, completed });

      if (result.success) {
        const { habits: habitsFromStore } = get();
        const updatedHabit = result.habit;

        set({
          habits: habitsFromStore.map((habit) =>
            habit._id === habitId ? updatedHabit : habit
          ),
        });
      }
    } catch (error) {
      throw error;
    }
  },

  getActiveHabits: () => get().habits.filter((habit) => !habit.isArchived),
}));
