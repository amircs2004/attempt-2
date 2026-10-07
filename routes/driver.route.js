const express = require('express')
const router = express.Router() 
const{
getNearestOrderForDriver ,
assigneDriver
} = require('../controllers/driver')
const protect = require('../middleware/protect')
//const verifySupabaseToken = require('../middleware/SuperbaseToken')

router.post('/nearest-order', protect, getNearestOrderForDriver);
router.post('/assign-driver', protect, assigneDriver);


module.exports = router;

