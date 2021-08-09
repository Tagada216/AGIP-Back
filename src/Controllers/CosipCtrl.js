const sequelize = require('../Models/index.js');
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

// OP est l'opérateur de sequelize permettant le and, or, plus petit, plus grand, not etc : https://sequelize.org/v4/manual/tutorial/querying.html

// Récupération des incidents au COSIP
exports.getCosip = (req, res, next) => {

    sequelize.models.incident.findAll({include:[sequelize.models.cosip, sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne], where:{
        cosip_id :{[Op.not]:null}
    }})
    .then( cosip => {
        res.status(200).json(cosip)
    }).catch(err => {res.status(404).send(err.toString())});

};

//Récupération d'un incidents au COSIP
exports.getOneIncidentCosip = (req, res, next) =>{

    const id = req.params.id;
    sequelize.models.incident.findByPk(id, {include:[sequelize.models.cosip, sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]})
    .then( cosip => {
        res.status(200).json(cosip);
    }).catch(err => {res.status(404).send(err.toString())});
    
};