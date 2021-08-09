const sequelize = require('../Models/index.js');

//Récupération des enseignes 

exports.getAllEnseignes = (req, res , next) => {
    sequelize.models.enseigne.findAll()
    .then(enseigne => {
        res.status(200).json(enseigne)
    }).catch(err => {res.status(404).send(err.toString())});
};