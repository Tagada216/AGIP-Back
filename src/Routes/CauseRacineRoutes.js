const express = require('express');
const router = express.Router();
const CauseRacineCtrl = require('../Controllers/CauseRacineCtrl');

router.get('/', CauseRacineCtrl.getAllCauseRacine);

module.exports = router;