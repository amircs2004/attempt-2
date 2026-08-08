const express = require('express')
const router = express.Router() 
const{
    register , 
    login , 
    logout ,
     getProfile ,
  googleAuth
} = require('../controllers/authController')
const protect = require('../middleware/protect')
const verifySupabaseToken = require('../middleware/SuperbaseToken')

router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/user' , protect , getProfile )
router.get('/google-auth' , verifySupabaseToken , googleAuth )

module.exports = router
