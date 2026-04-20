const mongoose = require('mongoose');

const uri = 'mongodb+srv://theprimezebii:Allah786allah@fundedworld-admin.9zxfvms.mongodb.net/fundedworld?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.log('Connection error:', err.message);
    process.exit(1);
  });
