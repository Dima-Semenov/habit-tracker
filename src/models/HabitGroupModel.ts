import mongoose, { Schema, model, models } from 'mongoose';

const HabitGroupSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [5, 'Description must be at least 5 characters long'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    emoji: {
      type: String,
      default: '📌',
    },
  },
  {
    timestamps: true,
  }
);

HabitGroupSchema.virtual('habits', {
  ref: 'Habit',
  localField: '_id',
  foreignField: 'groupId',
});

export const HabitGroupModel =
  models.HabitGroup || model('HabitGroup', HabitGroupSchema);
