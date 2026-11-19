const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_car_wash_db';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      autoIndex: true
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.error('👉 Make sure local MongoDB is running (e.g. "mongod" or Windows service) or provide a MongoDB Atlas URI in backend/.env');
    
    // In dev mode, we do not exit process so API documentation and server remain responsive
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
