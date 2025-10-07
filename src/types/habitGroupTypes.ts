import { HabitType } from './habitTypes';

export interface HabitGroupType {
  _id: string;
  title: string;
  description: string;
  userId: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
  habits: HabitType[];
}

export interface HabitGroupDocument extends Document {
  _id: string;
  title: string;
  description: string;
  userId: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}
