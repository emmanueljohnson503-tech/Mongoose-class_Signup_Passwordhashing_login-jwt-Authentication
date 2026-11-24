const mongoose = require ('mongoose');
require('dotenv').config()
const URI = process.env.MONGODB_URI
mongoose.connect(URI)
.then(()=> {
    console.log('connnection to database successful')
})
.catch((error)=> {
    console.log('connection to database Failed: ', error.message)
});