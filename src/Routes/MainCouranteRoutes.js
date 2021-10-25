const express = require('express');
const router = express.Router();
const MainCouranteCtrl = require('../Controllers/MainCouranteCtrl');

router.get('/', MainCouranteCtrl.getMaincourante);

router.get('/:id', MainCouranteCtrl.getincidentFromMainCourante);

router.post('/', MainCouranteCtrl.addIncidentMainCourante);

router.patch('/:id', MainCouranteCtrl.updateIncidentMainCourante);


module.exports = router;