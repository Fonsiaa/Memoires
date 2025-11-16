// app.js
import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/users.js';

const app = express();
const port = 2824;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://27017/memoires", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
