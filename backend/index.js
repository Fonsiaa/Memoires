import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import users from './routes/users.js';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Session + Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', users)
app.use('/auth', authRoutes)

const dbURI = "MONGO_URI" in process.env ? process.env.MONGO_URI : "mongodb://localhost:27017/memoires";
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

const port = process.env.PORT || 2824;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) 