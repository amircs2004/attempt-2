const express = require('express')
const router = express.Router() 
const { addProductToOrder, removeProductFromOrder , getAllOrders} = require('../controllers/client')  
const protect = require('../middleware/protect')
router.post('/add-product' , protect ,addProductToOrder )
router.delete('/delete-product/:productId' , protect , removeProductFromOrder )
router.get('/get-orders' , protect , getAllOrders)


module.exports = router