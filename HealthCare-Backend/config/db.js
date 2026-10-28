import mongoose from 'mongoose';

const connectDB = async () => {
try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
