const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors');
const {readdirSync}=require('fs')
const session = require('express-session')
require('dotenv').config()
const morgan = require('morgan')
const connectDB=require('./config/db')
connectDB()
const app = express();
app.use(express.json())
app.use(cors())
// const oneMonth = 1000 * 60 * 60 * 24 * 30;
// app.use(session({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true,
//     cookie: { maxAge: oneMonth }
//   }))
app.use(morgan('dev'))

  
//database connection
connectDB()


//for dynamically rendering the routes
readdirSync('./routes').map((router)=> app.use('/',require('./routes/'+router))); 

const PORT=process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on Port ${PORT}`);
})