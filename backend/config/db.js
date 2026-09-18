import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt';

  try {
    // Attempt connecting to local or Atlas MongoDB first with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected to external daemon: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Local/External MongoDB not accessible (${err.message}).`);
    console.log('[Database] Starting embedded MongoDB Memory Server for zero-friction local execution...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] MongoDB Memory Server Connected: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] Failed to launch in-memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
