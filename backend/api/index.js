// Vercel Serverless handler for the backend service.
// Called for every /api/* request routed to this service.
// Connection is cached across warm invocations (mongoose keeps the socket open).
require('dotenv').config();
const connectDB = require('../src/config/database');
const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
  return app(req, res);
};
