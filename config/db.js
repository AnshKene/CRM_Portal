import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    maxPoolSize: 25,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  return mongoose.connection;
};
