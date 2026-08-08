const express = require('express')
const router = express.Router()  
const assignDriverToOrder = require('../controllers/adminController')
const protect = require('../middleware/protect')
const createAdminByAdmin = require('../controllers/authForAdmin')
const restrictTo = require('../middleware/restrictedTo')

router.post('/create-admin', protect, restrictTo('Admin'), createAdminByAdmin);
router.post('/assign-driver' , protect , assignDriverToOrder )
module.exports = router