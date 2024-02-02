const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/wce-omegle';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(DB_URI);
        console.log(`MongoDB connected successfully`);
        // console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`DB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;