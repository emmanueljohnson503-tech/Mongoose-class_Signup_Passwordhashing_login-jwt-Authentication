const express = require('express');
require('dotenv').config();
require('./database/database')
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter')
const PORT = process.env.PORT || 2007;

const app = express();
app.use(express.json())
app.use(userRouter)
app.use(postRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT :${PORT}`);
})