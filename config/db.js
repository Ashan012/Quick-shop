import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const opts = {
    bufferCommands: false,
  };
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
