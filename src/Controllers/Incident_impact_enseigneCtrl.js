const impact_enseigne = require('../Models/Incident_impact_enseigneModel');
const sequelize = require('../Models/index');

// Récupérantion des impacts enseignes 
exports.getAllImpactEnseigne = (req, res, next) => {
    sequelize.models.incident_impact_enseigne.findAll()
    .then(impact_enseigne => {
        res.status(200).json(impact_enseigne)
    }).catch(err => {res.status(404).send(err.toString())});
};