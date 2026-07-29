require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5000 
const bddconnectionTest = require('./routes/bdd.route')
const authControllers = require('./routes/auth.route')


app.use(
  cors({
    origin: 'https://routefrontend.vercel.app',
    methods : ['GET' , 'DELETE' , 'POST' , 'PUT' , 'OPTIONS'] ,
    credentials: true, 
     allowedHeaders : ['Content-Type' , 'Authorization' , 'Cookie']
  })
);
app.use(cookieParser());
app.use(express.json());
 app.use('/api' , bddconnectionTest)
 app.use('/api' , authControllers)


//npm run dev 
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT , ()=> () => console.log(`Server running on port ${PORT}`))

}


module.exports = app;