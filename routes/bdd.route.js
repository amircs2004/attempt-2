const express = require('express')
const router = express.Router()
const bddtestConn = require('../controllers/testBddConnection')

router.get('/test' ,bddtestConn )
module.exports = router
