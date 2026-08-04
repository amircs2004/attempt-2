const express = require('express')
const router = express.Router() 
const { addProductToOrder, removeProductFromOrder , getAllOrders , updateProductQuantityInOrder , confirmOrder} = require('../controllers/client')  
const protect = require('../middleware/protect')
router.post('/add-product' , protect ,addProductToOrder )
router.delete('/delete-product/:productId' , protect , removeProductFromOrder )
router.get('/get-orders' , protect , getAllOrders)
router.patch('/update-product-quantity/:productId' , protect , updateProductQuantityInOrder)
router.post('/confirm-order' , protect , confirmOrder)


module.exports = router