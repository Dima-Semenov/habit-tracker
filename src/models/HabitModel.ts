import mongoose, { Schema, model, models } from 'mongoose';

const HabitSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title must not exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['goodHabit', 'badHabit'],
      required: true,
      default: 'goodHabit',
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HabitGroup',
      default: null,
      index: true,
    },
    target: {
      type: String,
      min: [1, 'Target must be at least 1 day'],
      max: [60, 'Target cannot exceed 60 days'],
      default: '1',
    },
    progress: [
      {
        date: { type: Date, required: true },
        completed: { type: Boolean, required: true },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTargetAchieved: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

HabitSchema.virtual('group', {
  ref: 'HabitGroup',
  localField: 'groupId',
  foreignField: '_id',
  justOne: true,
});

export const HabitModel = models.Habit || model('Habit', HabitSchema);
