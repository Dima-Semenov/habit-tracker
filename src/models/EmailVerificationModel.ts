import { Schema, model, models } from 'mongoose';

const EmailVerificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const EmailVerificationModel =
  models.EmailVerification ||
  model('EmailVerification', EmailVerificationSchema);
