const express = require('express')
const router = express.Router()
const bddtestConn = require('../controllers/testBddConnection')
const {checkModelsExport} = require('../controllers/isModelNull')
router.get('/test' ,bddtestConn )
router.get('/debug-models' ,checkModelsExport )

module.exports = router
