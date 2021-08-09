const sequelize = require('../Models/index.js');


// Récupération des incidents au COSIP
exports.getCosip = (req, res, next) => {

    sequelize.models.cosip.findAll({include:[sequelize.models.incident]})
    .then( cosip => {
        res.status(200).json(cosip)
    }).catch(err => {res.status(404).send(err.toString())});

};