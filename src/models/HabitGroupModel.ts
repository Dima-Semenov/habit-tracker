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
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    icon: {
      type: String,
      default: '📌',
    },
  },
  {
    timestamps: true,
  }
);

export const HabitGroupModel =
  models.HabitGroups || model('HabitGroups', HabitGroupSchema);
