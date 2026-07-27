require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5000 
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
 
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT , ()=> () => console.log(`Server running on port ${PORT}`))

}


module.exports = app;