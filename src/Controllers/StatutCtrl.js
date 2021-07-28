const sequelize = require('../Models/index.js');

// Récupération des statuts 

exports.getAllStatuts = (req, res, next) => {

    sequelize.models.incident_statut.findAll()
    .then (statuts => {
        res.status(200).json(statuts)
    }).catch(err => console.log(err));

};