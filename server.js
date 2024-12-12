//server.js
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Assuming you have authentication routes defined

const app = express();
app.use(express.json()); // To parse JSON bodies

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the University Inspection System!');
});

// Your authentication routes
app.use('/auth', authRoutes);

// Set the port to 5000, or use the environment variable if set
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
