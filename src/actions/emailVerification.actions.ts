'use server';

import crypto from 'crypto';
import { EmailVerificationModel } from '@/models/EmailVerificationModel';
import { Resend } from 'resend';
import { UserModel } from '@/models/UserModel';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function requestEmailVerification({ email }: { email: string }) {
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error(
      JSON.stringify({
        field: 'email',
        message: 'This email is already registered',
      })
    );
  }
  const code = crypto.randomInt(100000, 999999).toString();

  await EmailVerificationModel.findOneAndUpdate(
    { email },
    {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  await resend.emails.send({
    from: 'Habit Tracker <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email address',
    html: `<p>Your verification code is <b>${code}</b>. It will expire in 10 minutes.</p>`,
  });

  return { success: true };
}

export async function confirmEmail({
  email,
  code,
}: {
  email: string;
  code: number;
}) {
  const record = await EmailVerificationModel.findOne({ email });

  if (!record) {
    throw new Error(
      JSON.stringify({
        field: 'email',
        message: 'No verification request found',
      })
    );
  }

  if (Number(record.code) !== Number(code)) {
    throw new Error(
      JSON.stringify({ field: 'code', message: 'Invalid verification code' })
    );
  }

  await EmailVerificationModel.deleteOne({ email });

  const emailToken = jwt.sign(
    { email },
    process.env.JWT_EMAIL_VERIFICATION_SECRET!,
    {
      expiresIn: '15m',
    }
  );

  return { success: true, emailToken };
}
