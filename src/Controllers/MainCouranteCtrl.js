const sequelize = require('../Models/index.js');

// Import des modéles pour faire les jointures des requêtes 
const Incident_Reference = require('../Models/Incident_referenceModel')(sequelize);
const Incident_application_impactee = require('../Models/Incident_application_impacteeModel')(sequelize);
const IncidentImpactEnseigne = require('../Models/Incident_impact_enseigneModel')(sequelize);
const Incident_Priorite = require('../Models/Incident_prioriteModel')(sequelize);
const Incident_statut = require('../Models/Incident_statutModel')(sequelize);

//Récupérer les incidents de la main courante
exports.getMaincourante = (req, res, next) => {

    sequelize.models.incident.findAll({include:[Incident_Reference, Incident_application_impactee, IncidentImpactEnseigne], })
    .then (incidents => {
        res.status(200).json(incidents)
    }).catch(err => console.log(err));

};

// Récupérer un incident dans la main courante
exports.getincidentFromMainCourante = (req, res, next) => {
    const id = req.params.id;
    sequelize.models.incident.findByPk(id ,{include:[Incident_Reference, Incident_application_impactee, IncidentImpactEnseigne, Incident_Priorite]})
    .then(incident => {
        res.status(200).json(incident);
    }).catch(err => console.log(err))
};

// Ajouter un incident à la main courante 
exports.addIncidentMainCourante = (req, res, next) => {

};

// Modifier un incident à la main courante 
exports.updateIncidentMainCourante = (req, res, next) => {

};