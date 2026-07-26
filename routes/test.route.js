const express = require('express')
const router = express.Router()
const bddtestConn = require('../controllers/test')

router.get('/test' ,bddtestConn )

module.exports = router