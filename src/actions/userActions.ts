'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/UserModel';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const TOKEN_EXPIRY = '30m';

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
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
      }
    );

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 днів
      path: '/',
    });

    return {
      token,
      user: JSON.parse(JSON.stringify(user)),
    };
  } catch (error: unknown) {
    console.log('error: ', error);
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
      payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
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
      maxAge: 0, // одразу видаляємо
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
