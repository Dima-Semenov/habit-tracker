'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/UserModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Resend } from 'resend';

const TOKEN_EXPIRY = '30m';
const resend = new Resend(process.env.RESEND_API_KEY!);

interface CreateUserArgs {
  username: string;
  email: string;
  password: string;
}

export async function createUser({
  username,
  email,
  password,
}: CreateUserArgs) {
  try {
    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to createUser');
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(
        JSON.stringify({
          field: 'email',
          message: 'No user with this email found',
        })
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(
        JSON.stringify({
          field: 'password',
          message: 'Password is incorrect.',
        })
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: TOKEN_EXPIRY,
      }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      token,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to loginUser');
  }
}

export async function registerAndLoginUser(data: CreateUserArgs) {
  try {
    await connectToDatabase();

    const user = await createUser(data);
    await loginUser({ email: user.email, password: data.password });

    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to registerAndLoginUser');
  }
}

export async function getCurrentUser() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return null;
    }

    const userDoc = await UserModel.findById(payload.userId).select(
      '-password'
    );
    if (!userDoc) return null;

    const user = userDoc.toObject();

    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to getCurrentUser');
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();

    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return { message: 'Logged out successfully' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to logoutUser');
  }
}

export async function requestPasswordReset({ email }: { email: string }) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error(
      JSON.stringify({
        field: 'email',
        message: 'No user with this email found',
      })
    );
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_RESET_PASSWORD_SECRET!,
    {
      expiresIn: '15m',
    }
  );
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: 'Habit Tracker <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password (valid for 15 minutes):</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
  return { success: true };
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) {
  try {
    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET!) as JwtPayload;
    } catch {
      return null;
    }

    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error(
        JSON.stringify({
          field: 'email',
          message: 'No user with this email found',
        })
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to resetPassword');
  }
}
