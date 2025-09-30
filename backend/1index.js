const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Database connection error:', err));
// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});
const User = mongoose.model('User', UserSchema);
// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
// Routes
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Error saving user", error: error.message });
    }
});
// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));