const express = require('express')
const router = express.Router() 
const{
    register , 
    login , 
    logout ,
     getProfile
} = require('../controllers/authController')
const protect = require('../middleware/protect')

router.post('/register' , register)
router.post('/login' , login)
router.post('/logout' , logout)
router.get('/user' , protect , getProfile )

module.exports = router
