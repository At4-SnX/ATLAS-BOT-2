import mongoose from 'mongoose';
import { env } from '../config/env.js';
export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  console.log('MongoDB connecté');
}
