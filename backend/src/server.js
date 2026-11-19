require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const User = require('./models/User');
const seedData = require('./utils/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt database connection
    const conn = await connectDB();

    // Auto-seed if database is connected and empty
    if (conn) {
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('🌱 First-time startup detected with empty database: Auto-seeding initial data...');
          await seedData(false);
        }
      } catch (checkErr) {
        console.log('Notice on user check:', checkErr.message);
      }
    }

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚗 Smart Car Wash REST API is LIVE on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
      console.log(`👥 Mode:     ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });

    const shutdown = () => {
      console.log('\nGracefully shutting down Smart Car Wash API...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
