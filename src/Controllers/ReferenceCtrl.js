const Incident_reference = require('../Models/Incident_referenceModel');
const sequelize = require('../Models/index.js');

// Récupération des références 
exports.getAllReferences = (req, res, next) => {
    sequelize.models.incident_reference.findAll({include:[sequelize.models.incident]})
        .then(refs => {
            res.status(200).json(refs)
        }).catch(err => console.log(err));
};