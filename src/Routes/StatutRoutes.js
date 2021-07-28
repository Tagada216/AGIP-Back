const express = require('express');
const router = express.Router();
const StatutCtrl = require('../Controllers/StatutCtrl');

router.get('/', StatutCtrl.getAllStatuts);

module.exports = router;