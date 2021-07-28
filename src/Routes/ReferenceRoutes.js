const express = require('express');
const router = express.Router();
const ReferenceCtrl = require('../Controllers/ReferenceCtrl');

// Route get pour la récupération de toutes les références 
router.get('/', ReferenceCtrl.getAllReferences);

module.exports = router ;