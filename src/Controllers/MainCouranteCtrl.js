const sequelize = require('../Models/index.js');
const {createReferences} = require('./ReferenceCtrl.js');

//Récupérer les incidents de la main courante ( "Include" permet d'inclure les tables a également requéter grace au jointure défini dans le fichier index.js des Models)
exports.getMaincourante = (req, res, next) => {
    sequelize.models.incident.findAll({
            include: [sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]
        })
        .then(incidents => {
            res.status(200).json(JSON.parse(JSON.stringify(incidents).replace(/\u0092/g, "'")))
        }).catch(err => {

        });

};

// Récupérer un incident dans la main courante
exports.getincidentFromMainCourante = (req, res, next) => {
    const id = req.params.id;
    sequelize.models.incident.findByPk(id, {
            include: [sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]
        })
        .then(incident => {
            res.status(200).json(incident);
        }).catch(err => {
            res.status(404).send(err.toString())
        });
};

// Ajouter un incident à la main courante 
exports.addIncidentMainCourante = async (req, res, next) => {
    sequelize.models.incident.create(
        {...req.body}).then((resp) =>{
            next()
        }).catch((e) =>{
            res.status(406).send(e)
            console.log("Erreur", e)
        });

        sequelize.models.incident.afterCreate(inc => {
            const lastId = inc.dataValues.id
    
            // Mise en place d'un forEach car il est possible d'insérer plusieurs references pour un incident
            //Insertion de la ou des références 
            req.body.references.forEach(ref => {
                sequelize.models.incident_reference.create({
                    "reference": ref,
                    "incident_id": lastId
                })
            })
        });
};


// Modifier un incident à la main courante 
exports.updateIncidentMainCourante = (req, res, next) => {
    const idIncident = req.params.id;

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

                res.status(201).json({
                    message: "Incident mis à jour"
                });

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
        })
};