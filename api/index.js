const path = require('path');

// Ensure modules can be resolved from both root and backend/node_modules
module.paths.push(path.join(__dirname, '../backend/node_modules'));
module.paths.push(path.join(__dirname, '../node_modules'));

const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Serverless MongoDB connection error:', error.message);
  }
  return app(req, res);
};
