const express = require('express');
const router = express.Router();
const GraviteCtrl = require('../Controllers/GraviteCtrl');

router.get('/', GraviteCtrl.getAllGravite);

module.exports = router;