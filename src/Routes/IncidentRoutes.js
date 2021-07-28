const express = require('express');
const router = express.Router();
const IncidentCtrl = require('../Controllers/IncidentCtrl');

router.post('/', IncidentCtrl.createIncident);

router.get('/', IncidentCtrl.getAllIncident);

module.exports = router; 
