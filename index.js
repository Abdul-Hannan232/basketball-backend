const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const port = process.env.PORT || 2023;
const dbConnection = require("./config/database");
const UserRoutes = require('./routes/UserRoutes')
const AuthRoutes = require('./routes/AuthRoutes')
const CourtRoutes = require('./routes/CourtRoutes')
const RatingRoutes = require('./routes/RatingRoutes')
const setupDatabaseRelations=require('./models/Relations')
const path = require('path');
const cors = require('cors')
app.use(cors())
// Test the MySQL connection
dbConnection.sync({ alter: true }) 
  .then(() => {
    console.log('Connected to the MySQL database and synchronized models.');
  })
  .catch((error) => {
    console.error('Error  connecting to the database :', error.message);
  });

setupDatabaseRelations()
app.get("/", (req, res) => { 
  res.send("Hello, Node.js working fine! new workflow");
});

app.use(express.json())
app.use('/api/auth', AuthRoutes)
app.use('/api/user', UserRoutes)
app.use('/api/court',CourtRoutes) 
app.use('/api/rating',RatingRoutes)
app.use('/upload', express.static(path.join(__dirname, 'upload')));


// // Global error-handling middleware
// app.use((err, req, res, next) => {
//   return res.status(err.status).json({ message: err.message });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
