const sequelize = require('../Models/index.js');

// Récupération des références 
exports.getAllReferences = (req, res, next) => {
    sequelize.models.incident_reference.findAll()
        .then(refs => {
            res.status(200).json(refs)
        }).catch(err => {res.status(404).send(err.toString())});
};

exports.createReferences = (req, res, next) => {
    
    req.body.references.forEach(ref => {
        sequelize.models.incident_reference.create({
            "reference": ref,
            "incident_id": next
        }).then((resp) => 
        {
            return res.status(201).json({message: "Référence créé", data : resp});
        }).catch((err) => {
            return  res.status(406).send(err.errors)
        });
    })

};