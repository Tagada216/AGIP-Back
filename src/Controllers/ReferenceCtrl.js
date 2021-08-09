const sequelize = require('../Models/index.js');

// Récupération des références 
exports.getAllReferences = (req, res, next) => {
    sequelize.models.incident_reference.findAll()
        .then(refs => {
            res.status(200).json(refs)
        }).catch(err => {res.status(404).send(err.toString())});
};