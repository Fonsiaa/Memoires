// app.js
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import users from './routes/users.js';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/users', users);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
