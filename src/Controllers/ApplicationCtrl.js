const Application = require('../Models/ApplicationModel');
const sequelize = require('../Models/index.js');

// Récupération des applications 
exports.getAllApplications = (req, res, next) =>{
    sequelize.models.application.findAll()
        .then(application => {
            res.status(200).json(application)
        }).catch(err => {res.status(404).send(err.toString())});
};