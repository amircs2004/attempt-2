require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5000 
const bddconnectionTest = require('./routes/bdd.route')
const authControllers = require('./routes/auth.route')
const ClientProductRoutes = require('./routes/product.route')
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//limitting the number of requests to prevent brute force attacks 
app.use(helmet()); 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Apply rate limiting strictly to all API routes
app.use("/api", apiLimiter);


app.use(
  cors({
    origin: 'https://routefrontend.vercel.app',
    methods : ['GET' , 'DELETE' , 'POST' , 'PUT' , 'PATCH' , 'OPTIONS'] ,
    credentials: true, 
     allowedHeaders : ['Content-Type' , 'Authorization' , 'Cookie']
  })
);
app.use(cookieParser());
// 4. Payload Size Limiting (Prevents attackers from sending massive 50MB JSON payloads)
app.use(express.json({ limit: "10kb" }));
 app.use('/api' , bddconnectionTest)
 app.use('/api' , authControllers)
 app.use('/api' , ClientProductRoutes)




//npm run dev 
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT , ()=> () => console.log(`Server running on port ${PORT}`))

}


module.exports = app;