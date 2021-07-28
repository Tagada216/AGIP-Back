const sequelize = require('../Models/index.js');

// Récupération des priorités
exports.getAllPriorite = ( req, res, next) =>  {

    sequelize.models.incident_priorite.findAll()
    .then(priorites => {
        res.status(200).json(priorites)
    }).catch(err => console.log(err));

};

