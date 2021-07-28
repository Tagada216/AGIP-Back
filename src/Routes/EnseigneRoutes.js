const express = require('express');
const router = express.Router();
const EnseigneCtrl = require('../Controllers/EnseigneCtrl');

router.get('/', EnseigneCtrl.getAllEnseignes);

module.exports = router;