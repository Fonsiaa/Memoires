import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import users from './routes/users.js';
dotenv.config();


const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use('/api/user', users)

const dbURI = process.env.DB_URI;
// const dbURI = "mongodb://localhost:27017"

const connectDB = async() => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) 