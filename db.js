const mongoose = require('mongoose');
require('dotenv').config();

// Set up MongoDB connection
mongoose.connect(process.env.DB_URL)

// Get the default connecyion
// Mongoose maintains a default connection representing the MOngoDB connection
const db = mongoose.connection

db.on('connected', () => {
    console.log('connected to MongoDB server');

})

db.on('error', () => {
    console.log('MongoDB connection error');

})

db.on('disconnected', () => {
    console.log('MOngoDB disconnected');

})

// Export the database connection
module.exports = db