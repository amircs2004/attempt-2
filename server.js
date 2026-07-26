require("dotenv").config();
const express = require("express");
const app = express();
const testRoute = require('./routes/test.route')
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(
  cors({
    origin: true,
    methods : ['GET' , 'DELETE' , 'POST' , 'PUT' , 'OPTIONS'] ,
    credentials: true, 
     allowedHeaders : ['Content-Type' , 'Authorization' , 'Cookie']
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api' , testRoute )


module.exports = app;