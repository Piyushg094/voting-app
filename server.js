const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const votesRoutes = require('./routes/candidateRoutes')

const {jwtAuthMiddleware } = require('./jwt')

const connectDB = require('./database');
require('dotenv').config()

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON (keeping as backup)
app.use(express.json());
const PORT = process.env.PORT;
// Sample route
app.get('/', (req, res) => {
    res.send('Hello from Express Server!');
});
//import the routes files
app.use('/user', userRoutes)
app.use('/admin' , adminRoutes)
app.use('/candidate' , votesRoutes)


connectDB()
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});