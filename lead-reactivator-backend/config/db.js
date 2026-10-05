const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB instance using Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_lead_reactivator';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if service is offline
    });

    isConnected = true;
    console.log(`===============================================`);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`===============================================`);
  } catch (error) {
    isConnected = false;
    console.warn(`===============================================`);
    console.warn(`⚠️  MongoDB Connection Notice: ${error.message}`);
    console.warn(`📌 Active URI: ${uri}`);
    console.warn(`💡 The backend has initialized an in-memory fallback store so all APIs,`);
    console.warn(`   website forms, and admin features work flawlessly out of the box!`);
    console.warn(`   To persist data permanently, start MongoDB locally or configure Atlas in .env.`);
    console.warn(`===============================================`);
  }
};

const getIsConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
