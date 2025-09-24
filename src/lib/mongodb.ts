import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'habit-tracker-database' });
    console.log('MongoDB connected');

    return true;
  } catch (error) {
    console.log('MongoDB NOT CONNECTED!!!!');
    console.log('error: ', error);
  }
}
