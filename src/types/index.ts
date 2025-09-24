export type HabitType = {
  id: string;
  title: string;
  description: string;
  groupId: string;
};

export type HabitGroupType = {
  id: string;
  title: string;
  description: string;
  userId: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  habitsCount: number;
};

export interface HabitGroupDocument extends Document {
  _id: import('mongoose').Types.ObjectId;
  title: string;
  description: string;
  // userId: import('mongoose').Types.ObjectId;
  userId: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}
