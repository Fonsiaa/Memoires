import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import users from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', users);

const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/memoires";

const connectDB = async() => {
    try {
        await mongoose.connect(dbURI);
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit if DB connection fails
    }
};

connectDB();

const port = process.env.PORT || 2824;

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});