const sequelize = require('../Models/index.js');

//Récupération des CauseRacine

exports.getAllCauseRacine = (req, res, next) =>{
    sequelize.models.incident_cause_racine.findAll()
    .then(cause_racine => {
        res.status(200).json(cause_racine )
    }).catch(err => {res.status(404).send(err.toString())});
};