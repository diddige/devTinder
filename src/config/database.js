const mongoose = require('mongoose');

const connectionURL = 'mongodb+srv://namastedev:NKfQck3IkBjxdPyb@namastenode.4osjd.mongodb.net/devTinder';

const connectDB = async function(){
    await mongoose.connect(connectionURL);
}

module.exports = {
    connectDB
}