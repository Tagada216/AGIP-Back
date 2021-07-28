const Incident = require('../Models/IncidentModel');
const sequelize = require('../Models/index.js');

// Récupération des incidents 
exports.getAllIncident = (req, res, next) => {
    sequelize.models.incident.findAll()
        .then(incident => {
            res.status(200).json(incident)
        }).catch(err => console.log(err));
};

// Création d'un incident  
exports.createIncident = (req, res, next) => {
    const incident = new Incident({
        ...req.body
    })
    sequelize.models.incident.create({
        incident
    })
};