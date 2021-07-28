const express = require('express');
const router = express.Router();
const PrioriteCtrl = require('../Controllers/PrioriteCtrl');

router.get('/', PrioriteCtrl.getAllPriorite);

module.exports = router ;