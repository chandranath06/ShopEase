const mongoose = require('mongoose');

// Connects to MongoDB using the URI stored in the environment variables.
const connectDB = async () => {
  try {
 const conn = await mongoose.connect(process.env.MONGO_URI, {
  family: 6,
  serverSelectionTimeoutMS: 15000
});
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;