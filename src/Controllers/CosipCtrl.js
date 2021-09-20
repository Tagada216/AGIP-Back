const sequelize = require('../Models/index.js');
const {
    Sequelize
} = require('sequelize');
const Op = Sequelize.Op;

// OP est l'opérateur de sequelize permettant le and, or, plus petit, plus grand, not etc : https://sequelize.org/v4/manual/tutorial/querying.html

// Récupération des incidents au COSIP
exports.getCosip = (req, res, next) => {

    sequelize.models.incident.findAll({
            include: [sequelize.models.cosip, sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne],
            where: {
                cosip_id: {
                    [Op.not]: null
                }
            }
        })
        .then(cosip => {
            res.status(200).json(cosip);
        }).catch(err => {
            res.status(404).send(err.toString())
        });

};

//Récupération d'un incidents au COSIP
exports.getOneIncidentCosip = (req, res, next) => {

    const id = req.params.id;
    sequelize.models.incident.findByPk(id, {
            include: [sequelize.models.cosip, sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]
        })
        .then(cosip => {
            res.status(200).json(cosip);
        }).catch(err => {
            res.status(404).send(err.toString())
        });

};

// Récupération des incidents au cosip en fonction de la semaine souhaité 
exports.getCosipByWeek = (req, res, next) => {
    const week = req.params.week
    sequelize.models.incident.findAll({
            include: [sequelize.models.cosip, sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne],
            where: {
                cosip_id: {
                    [Op.not]: null
                }
            }
        })
        .then(cosip => {
            const allCosip = cosip
            let cosipWeek = []
            allCosip.forEach(el => {
                if (el.cosip.semaine_cosip === week) {
                    cosipWeek.push(el)
                }
            });
            res.status('200').json(cosipWeek)
        }).catch(err => {
            res.status(404).send(err.toString())
        });

};

// Ajouter un incident au cosip
exports.addIncidentCosip = (req, res, next) => {


    sequelize.models.cosip.create({
        ...req.body
    }).then(() => {
        res.status(201).json({
            message: "Insertion de l'incident au cosip"
        });
    }).catch(err => {
        res.status(406).send(err.toString())
    });

    let idIncident = req.body.incident_id;


    // Insertion des modifications dans la table incident
    sequelize.models.incident.findOne({
            where: {
                id: idIncident
            }
        })
        .then(record => {
            if (!record) {
                throw new Error("Enregistrement non trouvé")
            }

            // console.log(`record: ${JSON.stringify(record)}`)

            record.update({
                ...req.body
            }).then(() => {

            }).catch(err => {
                res.status(406).send(err.toString())
            });


            req.body.incident_impact_enseignes.forEach(() => {
                sequelize.models.incident_impact_enseigne.update({
                    "incident_id": idIncident,
                    "description_impact": req.body.description_impact,
                    "date_debut": req.body.date_debut,
                    "date_fin": req.body.date_fin,
                    "date_fin_com": req.body.date_fin_com,
                    "date_detection": req.body.date_detection,
                    "date_com_tdc": req.body.date_com_tdc,
                    "date_qualif_p01": req.body.date_qualif_p01,
                    "date_premier_com": req.body.date_premier_com,
                    "date_solution": req.body.date_solution,
                    "date_retablissement": req.body.date_retablissement,
                    "jh_perdu": req.body.jh_perdu,
                    "nombre_utilisateurs": req.body.nombre_utilisateurs,
                    "taux_indispo_reseau": req.body.taux_indispo_reseau,
                    "duree_indispo_reseau": req.body.duree_indispo_reseau,
                    "logiteInet_cust": req.body.logiteInet_cust,
                    "chiffre_cust": req.body.chiffre_cust,
                    "dab_cust": req.body.dab_cust,
                    "progeliance_cust": req.body.progeliance_cust,
                    "net_EIPRO_cust": req.body.net_EIPRO_cust,
                    "etece_cust": req.body.etece_cust,
                    "enseigne_id": req.body.enseigne_id
                }, {
                    where: {
                        incident_id: idIncident
                    }
                })
            })
        });
};