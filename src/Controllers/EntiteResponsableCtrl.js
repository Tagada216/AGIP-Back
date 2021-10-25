const sequelize = require('../Models/index.js');

//Récupération des Entite Responsable

exports.getAllEntiteResp = (req, res, next) =>{
    sequelize.models.incident_entite_responsable.findAll()
    .then(entite_resp => {
        res.status(200).json(entite_resp )
    }).catch(err => {res.status(404).send(err.toString())});
};