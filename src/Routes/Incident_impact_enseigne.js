const express =require('express');
const router = express.Router();
const IncidentImpactCtrl = require('../Controllers/Incident_impact_enseigneCtrl');

router.get('/', IncidentImpactCtrl.getAllImpactEnseigne );

module.exports = router; 