const sequelize = require('../Models/index.js');
const Incident = require('../Models/IncidentModel')(sequelize);

// Récupération des incidents au COSIP
exports.getCosip = (req, res, next) => {

    sequelize.models.cosip.findAll({include:[Incident]})
    .then( cosip => {
        res.status(200).json(cosip)
    }).catch(err => console.log(err));

};