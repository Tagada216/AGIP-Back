const sequelize = require('../Models/index.js');


//Récupérer les incidents de la main courante ( "Include" permet d'inclure les tables a également requéter grace au jointure défini dans le fichier index.js des Models)
exports.getMaincourante = (req, res, next) => {
    sequelize.models.incident.findAll({include:[sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne ], attributes:[['cause','Cause'],['statut_id','Statut'],['priorite_id','Priorité'],['description','Description'],['origine','Origine'],["action_retablissement","Action de rétablissement"]]})
    .then (incidents => {
        res.status(200).json(incidents)
    }).catch(err => {res.status(404).send(err.toString())});

};

// Récupérer un incident dans la main courante
exports.getincidentFromMainCourante = (req, res, next) => {
    const id = req.params.id;
    sequelize.models.incident.findByPk(id ,{include:[sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]})
    .then(incident => {
        res.status(200).json(incident);
    }).catch(err => {res.status(404).send(err.toString())});
};

// Ajouter un incident à la main courante 
exports.addIncidentMainCourante = (req, res, next) => {

};

// Modifier un incident à la main courante 
exports.updateIncidentMainCourante = (req, res, next) => {

};