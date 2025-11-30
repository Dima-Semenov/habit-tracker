import { HabitGroupType } from './habitGroupTypes';

export type HabitTypes = 'goodHabit' | 'badHabit';

export interface HabitProgressType {
  date: Date;
  completed: boolean;
}

export interface HabitType {
  _id: string;
  title: string;
  description: string;
  type: HabitTypes;
  target: string;
  groupId: string | null;
  createdAt: string;
  updatedAt: string;
  progress: HabitProgressType[];
  isArchived: boolean;
  isTargetAchieved: boolean;
  group: HabitGroupType | null;
}

export type CreateHabitDataType = {
  title: string;
  description: string;
  type: HabitTypes;
  target: string;
  groupId: string | null;
  userId: string;
};
