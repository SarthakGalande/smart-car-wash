const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If connection is already open, reuse it immediately (essential for serverless)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection && mongoose.connection.readyState !== 0) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_car_wash_db';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      autoIndex: true
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.error('👉 Make sure local MongoDB is running (e.g. "mongod" or Windows service) or provide a MongoDB Atlas URI in backend/.env');
    
    // In dev mode or Vercel serverless, do not exit process so API remains responsive
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
