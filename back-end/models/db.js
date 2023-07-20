const mongoose = require('mongoose');

// MongoDB connection string
const connectionString = 'mongodb://127.0.0.1:27017/testDB2';

// Establish the connection
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

module.exports = mongoose.connection;
