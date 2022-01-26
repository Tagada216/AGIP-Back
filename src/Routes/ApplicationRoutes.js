const express = require('express');
const router = express.Router();
const ApplicationCtrl = require('../Controllers/ApplicationCtrl');

router.get('/', ApplicationCtrl.getAllApplications);
router.post('/', ApplicationCtrl.createOneIncident);

module.exports = router;