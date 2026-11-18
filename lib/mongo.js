import mongoose from 'mongoose';

const cached = global._sharuMongoose || (global._sharuMongoose = { conn: null, promise: null });

export default async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing in .env');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 12000 })
      .catch((e) => { cached.promise = null; throw e; });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
