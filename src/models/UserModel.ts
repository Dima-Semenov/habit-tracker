import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      trim: true,
    },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model('User', UserSchema);
