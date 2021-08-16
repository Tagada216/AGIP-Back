const express =require('express');
const router = express.Router();
const CosipCtrl = require('../Controllers/CosipCtrl');

router.get('/', CosipCtrl.getCosip);

router.get('/:id',CosipCtrl.getOneIncidentCosip);

router.get('/week/:week', CosipCtrl.getCosipByWeek);

module.exports = router;