const express = require('express')
const router = express.Router() 
const{
getNearestOrderForDriver ,
assigneDriver , 
getDriverOrders
} = require('../controllers/driver')
const protect = require('../middleware/protect')
//const verifySupabaseToken = require('../middleware/SuperbaseToken')

router.post('/nearest-order', protect, getNearestOrderForDriver);
router.post('/assign-driver', protect, assigneDriver);
router.get('/get_orders', protect, getDriverOrders);



module.exports = router;

