const sequelize = require('../Models/index.js');

//Récupération des gravite

exports.getAllGravite = (req, res, next) =>{
    sequelize.models.incident_gravite.findAll()
    .then(gravite => {
        res.status(200).json(gravite)
    }).catch(err => {res.status(404).send(err.toString())});
};