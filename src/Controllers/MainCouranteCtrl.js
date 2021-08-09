const sequelize = require('../Models/index.js');


//Récupérer les incidents de la main courante
exports.getMaincourante = (req, res, next) => {
    sequelize.models.incident.findAll({include:[sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne ]})
    .then (incidents => {
        res.status(200).json(incidents)
    }).catch(err => {res.status(404).send(err.toString())});

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