const express =require('express');
const router = express.Router();
const CosipCtrl = require('../Controllers/CosipCtrl');

router.get('/', CosipCtrl.getCosip);

module.exports = router;