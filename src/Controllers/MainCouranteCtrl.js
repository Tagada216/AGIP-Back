const sequelize = require('../Models/index.js');


//Récupérer les incidents de la main courante ( "Include" permet d'inclure les tables a également requéter grace au jointure défini dans le fichier index.js des Models)
exports.getMaincourante = (req, res, next) => {
    sequelize.models.incident.findAll({
            include: [sequelize.models.incident_reference, sequelize.models.incident_application_impactee, sequelize.models.incident_impact_enseigne]
        })
        .then(incidents => {
            res.status(200).json(JSON.parse(JSON.stringify(incidents).replace(/\u0092/g, "'")))
        }).catch(err => {
            res.status(404).send(err.toString())
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
exports.addIncidentMainCourante = (req, res, next) => {

    // Insertion/ création incident 
    sequelize.models.incident.create({
        ...req.body
    }).then(() => {
        res.status(201).json({
            message: "Incident créé"
        });
    }).catch(err => {
        res.status(406).send(err.toString())
    });


    // Utilisation de hook afterCreate afin de récupérer l'id de l'incident créé à l'instant 
    sequelize.models.incident.afterCreate(inc => {
        const lastId = inc.dataValues.id

        // Mise en place d'un forEach car il est possible d'insérer plusieurs references pour un incident également pour l'impact_enseigne
        //Insertion de la ou des références 
        req.body.references.forEach(ref => {
            sequelize.models.incident_reference.create({
                "reference": ref,
                "incident_id": lastId
            })
        })
        // Insertion de ou des impact(s) enseigne(s)
        req.body.incident_impact_enseignes.forEach(impact => {
            sequelize.models.incident_impact_enseigne.create({
                "incident_id": lastId,
                "description_impact": impact.description_impact,
                "date_debut": impact.date_debut,
                "date_fin": impact.date_fin,
                "date_fin_com": impact.date_fin_com,
                "date_detection": impact.date_detection,
                "date_com_tdc": impact.date_com_tdc,
                "date_qualif_p01": impact.date_qualif_p01,
                "date_premier_com": impact.date_premier_com,
                "date_solution": impact.date_solution,
                "date_retablissement": impact.date_retablissement,
                "jh_perdu": impact.jh_perdu,
                "nombre_utilisateurs": impact.nombre_utilisateurs,
                "taux_indispo_reseau": impact.taux_indispo_reseau,
                "duree_indispo_reseau": impact.duree_indispo_reseau,
                "logiteInet_cust": impact.logiteInet_cust,
                "chiffre_cust": impact.chiffre_cust,
                "dab_cust": impact.dab_cust,
                "progeliance_cust": impact.progeliance_cust,
                "net_EIPRO_cust": impact.net_EIPRO_cust,
                "etece_cust": impact.etece_cust,
                "enseigne_id": impact.enseigne_id
            })
        })

        // Insertion des applications impacté 
        req.body.incident_application_impactees.forEach(app => {
            if (app.Application_code_irt === null) {
                app.Application_trigramme = "FFF"
            }
            sequelize.models.incident_application_impactee.create({
                "incident_id": lastId,
                "Application_code_irt": app.Application_code_irt,
                "Application_trigramme": app.Application_trigramme,
                "nom_appli": app.nom_appli
            })

            //After create des applications inexistante ene "FFF" pour l'ajout dans la base 
            sequelize.models.incident_application_impactee.afterCreate(createApp => {
                if (createApp.dataValues.Application_trigramme === "FFF") {
                    //INsertion de l'application inexistante dans la table Application 
                    sequelize.models.application.create({
                        "nom": createApp.dataValues.nom_appli,
                        "trigramme": createApp.dataValues.Application_trigramme,
                        "code_irt": createApp.dataValues.Application_code_irt
                    })
                }
            })
        })

    })


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

