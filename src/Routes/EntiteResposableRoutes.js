const express = require('express');
const router = express.Router();
const EntiteResponsableCtrl = require('../Controllers/EntiteResponsableCtrl');

router.get('/', EntiteResponsableCtrl.getAllEntiteResp);

module.exports = router;