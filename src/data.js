import * as queries from "./requetes.js"
import chalk from "chalk"
import {
	response
} from "express"
import {
	INTEGER,
	INET
} from "sequelize"



// Petite ligne permettant d'utiliser log() au lieu de console.log
const log = console.log

//const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("./config")
const tokenList = {}


////////////////////////////////////////
// Initialisation de la base de données.
////////////////////////////////////////
const Sequelize = require("sequelize")
const sequelize = new Sequelize({
	dialect: "sqlite",
	//Local : "C:/Users/A487365/Documents/BDD/TDC_AGIPROS_BDD.sdb"
	// DEV : "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD_Dev.sdb"
	// Master: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD-Master.sdb"
	storage: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD_Dev.sdb",
	define: {
		timestamps: false
	}
})
//"V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_toolboxTestKev - Copie.sdb"
//"C:/Users/A487365/Documents/BDD/TDC_AGIPROS_BDD.sdb"

// Ajout d'un cache de la liste des application
// Sinon la base met 10 à 30 secondes pour répondre
// Dans les faits 

var appCache
log("\n" + chalk.yellow("Mise en cache des applications"))
sequelize.query(queries.AllApplications()).then(([results]) => {
	appCache = results
})
log("\n" + chalk.yellow("Mise en cache des applications"))

// var nombreCiFictif 
// sequelize.query("Select 'F' || max(CI)+1 as 'nbCiFictif' from (Select replace(code_irt,'F','') as 'CI' from application where code_irt like 'F%')").then(([results]) => {
// 	nombreCiFictif = results[0].nbCiFictif
// })
////////////////////////////////////////


export function getIncidents(res) {
	sequelize.query(
		"select incident.id, incident.description, incident.cause, incident.origine, incident.observations, incident.plan_action, incident_statut.nom as statut, " +
		"incident_priorite.priorite, incident_entite_responsable.nom as entite_responsable , incident_couche_si_impactee.nom as couche_si_impactee, " +
		"incident_cause_racine.nom as cause__racine, incident.nombre_occurence, incident.crise_itim, incident.departement_responsable, " +
		"'incident.sous-traitant_responsable' as sous_traitant_responsable, incident.service_metier, incident.famille_service_metier, incident.obsolescence, " +
		"incident.pm_id, incident.probleme_id, incident.import_code_irt, incident.import_probleme_ref, incident.nom_app_impactante, " +
		"changements.reference, changements.urgent, changements.classification " +
		"from incident " +
		"join incident_statut on incident_statut.id = incident.statut_id " +
		"join incident_priorite on incident_priorite.id = incident.priorite_id " +
		"join incident_entite_responsable on incident_entite_responsable.id = incident.entite_responsable_id " +
		"join incident_couche_si_impactee on incident_couche_si_impactee.id = incident.couche_si_impactee_id " +
		"join incident_cause_racine on incident_cause_racine.id = incident.cause_racine_id " +
		"join changements on changements.id = incident.changements_id;"
	).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}

export function getIncident(idIncident, res) {
	sequelize.query(
		"select incident.id, incident.description, incident.cause, incident.origine, incident.observations, incident.plan_action, incident_statut.nom as statut, " +
		"incident_priorite.priorite, incident_entite_responsable.nom as entite_responsable , incident_couche_si_impactee.nom as couche_si_impactee, " +
		"incident_cause_racine.nom as cause__racine, incident.nombre_occurence, incident.crise_itim, incident.departement_responsable, " +
		"'incident.sous-traitant_responsable' as sous_traitant_responsable, incident.service_metier, incident.famille_service_metier, incident.obsolescence, " +
		"incident.pm_id, incident.probleme_id, incident.import_code_irt, incident.import_probleme_ref, incident.nom_app_impactante, " +
		"changements.reference, changements.urgent, changements.classification " +
		"from incident " +
		"join incident_statut on incident_statut.id = incident.statut_id " +
		"join incident_priorite on incident_priorite.id = incident.priorite_id " +
		"join incident_entite_responsable on incident_entite_responsable.id = incident.entite_responsable_id " +
		"join incident_couche_si_impactee on incident_couche_si_impactee.id = incident.couche_si_impactee_id " +
		"join incident_cause_racine on incident_cause_racine.id = incident.cause_racine_id " +
		"join changements on changements.id = incident.changements_id " +
		"where incident.id = :incidentId;", {
			replacements: {
				incidentId: idIncident
			},
			type: sequelize.QueryTypes.SELECT
		}
	).then(([results]) => {
		/*
		 * Je pourrai uniquement utiliser res.json(results[0])
		 * Cepandant, il y a un soucis d'encodage des données venant du fichier rouge.
		 * Cela nous oblige à remplacer le caractère unicode : "u0092" par un apostrophe.
		 */
		res.json(JSON.parse(JSON.stringify(results[0]).replace(/\u0092/g, "'")))
	})
}

export function getIdcosip(res, id) {
	sequelize.query(queries.getIdcosip(id)).then(([results]) => {
		res.json(results)
	})
}

export function getCosipByWeek(res, week) {
	sequelize.query(queries.getCosipByWeek(), {
		bind: {
			semaine_cosip: week
		},
		type: sequelize.QueryTypes.SELECT
	}).then(([results]) => {
		res.json(results)
	})
}

export function getReference(res) {
	sequelize.query("select reference, incident_id from incident_reference;").then(([results]) => {
		res.json(results)
	})
}

export function getIncPrio(res) {
	sequelize.query("select * from incident_priorite;").then(([results]) => {
		res.json(results)
	})
}

export function getIncStatut(res) {
	sequelize.query("select * from incident_statut;").then(([results]) => {
		res.json(results)
	})
}

export function getIncGravite(res) {
	sequelize.query("select * from incident_gravite;").then(([results]) => {
		res.json(results)
	})
}
export function getIncRespEntity(res) {
	sequelize.query("select * from incident_entite_responsable;").then(([results]) => {
		res.json(results)
	})
}

export function getIncImpactLayer(res) {
	sequelize.query("select * from incident_couche_si_impactee;").then(([results]) => {
		res.json(results)
	})
}

export function getIncRootCause(res) {
	sequelize.query("select * from incident_cause_racine;").then(([results]) => {
		res.json(results)
	})
}

export function getChangements(res) {
	sequelize.query("select * from changements;").then(([results]) => {
		res.json(results)
	})
}

export function getEnseignes(res) {
	sequelize.query("select * from enseigne;").then(([results]) => {
		res.json(results)
	})
}

export function getMainCourante(res, id) {
	sequelize.query(queries.MainCourante(id)).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}


export function getFormatedMainCourante(res, id) {
	sequelize.query(queries.FormatedMainCourante(id)).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}


export function getFormatedAgence(res) {
	sequelize.query(queries.FormatedAgence()).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}

export function getApp(res) {
	res.json(appCache)
}


export function getProbs(res) {
	sequelize.query(queries.getProbs()).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}


export function getCosipFormated(res) {
	sequelize.query(queries.getCosipFormated()).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}


export function getCosipById(res, id) {
	sequelize.query(queries.getCosipById(id)).then(([results]) => {
		res.json(JSON.parse(JSON.stringify(results).replace(/\u0092/g, "'")))
	})
}


// export function getCosipById(res, id) {
// 	sequelize.query(queries.getCosipById(), {
// 		replacements: {
// 			incident_id : id
// 		},
// 		type: sequelize.QueryTypes.SELECT
// 	}).then(([results]) => {
// 		res.json(results)
// 	})
// }


export async function createMainCourante(res, input) {
	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"));
	console.log(input);
	//On insert dans la table incident en premier (clés étrangères obligent)

	const insertResult = await sequelize.query(queries.CreationIncident(input), {
		bind: {
			is_imported: input.is_imported,
			description: input.description,
			statutId: input.statut_id,
			priopriteId: input.priorite_id,
			description_contournement: input.description_contournement
		},
		type: Sequelize.QueryTypes.SELECT,
		type: Sequelize.DataTypes.STRING
	})
	log("\n" + chalk.yellow(insertResult[0]))
	// On récupère l'id de l'incident nouvellement crée
	const idIncident = insertResult[0]

	log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferences(input, idIncident))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignes(input, idIncident))

	// Insertion des applications impactées
	// log("\n" + chalk.yellow("Insertion des applications impactées"))
	// for (const appImpactee of input.application_impactee) {
	// 	await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident), {
	// 		bind: {
	// 			codeIrt: appImpactee.code_irt,
	// 			trigrammeApp: appImpactee.trigramme,
	// 			displayNameApp: appImpactee.display_name
	// 		},
	// 		type: Sequelize.QueryTypes.SELECT,
	// 		type: Sequelize.DataTypes.STRING
	// 	})
	// }

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function createMainCouranteAgence(res, input) {
	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	const insertResult = await sequelize.query(queries.CreationIncidentAgence(), {
		bind: {
			description: input.description,
			cause: input.cause,
			statut_id: input.statut_id,
			prioprite_id: input.priorite_id,
			is_agence: input.is_agence
		},
		type: Sequelize.QueryTypes.SELECT,
		type: Sequelize.DataTypes.STRING
	})
	// On récupère l'id d el'incident nouvellement crée
	const idIncident = insertResult[0].lastID

	log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferencesAgence(input, idIncident))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignesAgence(), {
		bind: {
			reference: input.reference,
			incident_id: idIncident
		},
		type: Sequelize.QueryTypes.SELECT,
		type: Sequelize.DataTypes.STRING
	})

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee), {
			bind: {
				idIncident: idIncident,
				codeIrt: application.code_irt,
				trigrammeApp: application.trigramme,
				displayNameApp: application.display_name
			},
			type: Sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function insertMainCourante(res, input) {
	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	const insertResult = await sequelize.query(queries.CreationIncidentMainCourante(input), {
		bind: {
			description: input.description,
			statut_id: input.statut_id,
			priorite_id: input.priorite_id,
			description_contournement: input.description_contournement,
			cause: input.cause,
			origine: input.origine,
			plan_action: input.plan_action,
			action_retablissement: input.action_retablissement,
			cosip_id: input.cosip_id
		}
	})
	// On récupère l'id d el'incident nouvellement crée
	const idIncident = insertResult[0].lastID

	log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferences(input, idIncident))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignesMainCourante(input, idIncident))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee), {
			bind: {
				idIncident: idIncident,
				codeIrt: application.code_irt,
				trigrammeApp: application.trigramme,
				displayNameApp: application.display_name
			},
			type: Sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function insertImpactEnseigne(res, input) {
	const insertResult = await sequelize.query(queries.CreationIncidentMainCourante(input))
	const idIncident = insertResult[1].lastID
	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignesMainCourante(input, idIncident))
}

//------------------------------- End of  Emeline Part --------------------------------------


export async function AddToCosip(res, input, idIncident) {
	try {
		//Suppression incident impact enseinge 
		await sequelize.query(queries.DeleteIncidentImpactEnseigne(), {
			bind: {
				id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})

		log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION AU COSIP ---"))
		// On insert dans la table cosip en premier (clés étrangèrent obligent)

		const idCosip = await sequelize.query(queries.CreationCosip(), {
			bind: {
				plan_action: input.plan_action,
				cause_racine_id: input.cause_racine_id,
				comment: input.commentaire,
				cosip_resume: input.cosip_resume,
				semaine_cosip: input.semaine_cosip
			},
			type: sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		}).then(([results]) => {

			// 	On récupére l'id de l'incident nouvellement crée dans le result
			return results
		}, (error) => {
			return error
		})

		log(chalk.blue("\n" + "L'id Cosip de l'incident est ") + chalk.underline.red(idCosip))
		log(chalk.blue("\n" + "L'id de l'incident est ") + chalk.underline.red(input.incident_id))

		log("\n" + chalk.yellow("--- Insertion des modifications de l'incident ----"))

		// //////////////// Insertion des modifications ou non dans la table incident //////////////////////////
		await sequelize.query(queries.CosiptoIncident(idCosip), {
			bind: {
				incident_id: input.incident_id,
				statut_id: input.statut_id,
				priorite_id: input.priorite_id,
				is_contournement: input.is_contournement,
				is_faux_incident: input.is_faux_incident,
				description: input.cosip_resume,
				description_contournement: input.description_contournement,
				cause: input.cause,
				origine: input.origine,
				plan_action: input.plan_action,
				action_retablissement: input.action_retablissement,
				entite_responsable: input.entite_responsable
			},
			type: sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})

		// 	Insertion des modification ou non dans la table incident_impact_enseigne
		log("\n" + chalk.yellow("---- Insertion des impacts enseignes ----"))

		await sequelize.query(queries.AddImpactEnseignesCosip(input, idIncident))

		// Insertion des applications impactées

		log("\n" + chalk.yellow("---- Insertion des applications impactées --- "))
		for (const appImpactee of input.application_impactee) {
			await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
		}

		log("\n" + chalk.green("--- FIN DE L'INSERTION AU COSIP (SUCCES) ---"))

		res.status(200).json({
			message: 'Une erreur est survenue .'
		})

	} catch (err) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}

// ---------------  Modification du COSIP ------------------
export async function UpdateCosip(res, input) {
	try {

		//Suppression incident impact enseinge  et  Applcations 
		await sequelize.query(queries.DeleteIncidentImpactEnseigne(), {
			bind: {
				id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentApplicationImpactee(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})

		log("\n" + chalk.yellow("--- DEBUT DE L'UPDATE AU COSIP ---"))

		//On insert dans la table cosip en premier (clés étrangére obligent)
		await sequelize.query(queries.UpdateCosip(), {
			bind: {
				cosip_id: input.cosip_id,
				plan_action: input.plan_action,
				cause_racine_id: input.cause_racine_id,
				comment: input.commentaire,
				cosip_resume: input.cosip_resume,
				semaine_cosip: input.semaine_cosip
			},
			type: sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})

		//Insertion des modifications ou non dans la table incident
		log("\n" + chalk.yellow("--- Insertion des modifications de l'incident ----"))
		await sequelize.query(queries.UpdateCosiptoIncident(), {
			bind: {
				cosip_id: input.cosip_id,
				incident_id: input.incident_id,
				statut_id: input.statut_id,
				priorite_id: input.priorite_id,
				is_contournement: input.is_contournement,
				is_faux_incident: input.is_faux_incident,
				description: input.cosip_resume,
				description_contournement: input.description_contournement,
				cause: input.cause,
				origine: input.origine,
				plan_action: input.plan_action,
				action_retablissement: input.action_retablissement,
				entite_responsable: input.entite_responsable
			},
			type: sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})


		// Insertion des impacts enseignes
		log("\n" + chalk.yellow("Insertion des impacts enseignes"))
		await sequelize.query(queries.CreationImpactEnseignesCosip(input, input.incident_id))

		// Insertion des applications impactées
		log("\n" + chalk.yellow("---- Insertion des applications impactées --- "))
		for (const appImpactee of input.application_impactee) {
			await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, input.incident_id))
		}

		log("\n" + chalk.green("--- FIN DE L'UPDATE AU COSIP (SUCCES) ---"))
		res.status(200).json({
			message: 'Modification réalisée avec succès'
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}

export async function deleteIncident(res, input) {
	try {

		await sequelize.query(queries.DeleteIncidentImpactEnseigne(), {
			bind: {
				id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentApplicationImpactee(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentReference(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncident(input), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})

		log("\n" + chalk.green("--- Suppression effectué (SUCCES) ---"))
		res.status(200).json({
			message: 'Suppression réalisée avec succès'
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}


export async function updateMainCourante(res, input) {
	try {

		await sequelize.query(queries.DeleteIncidentImpactEnseigne(), {
			bind: {
				id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentApplicationImpactee(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})


		// Insert des modifications effectuées (il faudrait insert à l'id qui a servi pour le delete (si possible))	 
		log("\n" + chalk.yellow("--- DEBUT DE L'UPDATE ---"))
		// On insert dans la table incident en premier (clés étrangères obligent)
		await sequelize.query(queries.UpdateIncident(), {
			bind: {
				incident_id: input.incident_id,
				statut_id: input.statut_id,
				priorite_id: input.priorite_id,
				is_contournement: input.is_contournement,
				is_faux_incident: input.is_faux_incident,
				description: input.description,
				description_contournement: input.description_contournement,
				cause: input.cause,
				origine: input.origine,
				plan_action: input.plan_action,
				action_retablissement: input.action_retablissement
			},
			type: sequelize.QueryTypes.SELECT
		})

		//Suppression préalable car table avec tableau dificile à update
		log("\n" + chalk.yellow("Suppression des références"))
		await sequelize.query(queries.UpdateDeleteReferences(input))

		// Insertion des références
		log("\n" + chalk.yellow("Insertion ou Update des références"))
		await sequelize.query(queries.UpdateReferences(input))

		// Insertion des impacts enseignes
		log("\n" + chalk.yellow("Insertion des impacts enseignes"))
		await sequelize.query(queries.CreationImpactEnseignesMainCourante(input, input.incident_id))


		// Insertion des applications impactées
		log("\n" + chalk.yellow("Insertion des applications impactées"))
		for (const appImpactee of input.application_impactee) {
			await sequelize.query(queries.UpdateCreationApplicationsImpactees(appImpactee, input.incident_id))
		}

		log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))


		// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
		log("\n" + chalk.green("---Mise à jour de l'incident effectué (SUCCES) ---"))
		res.status(200).json({
			message: " Mise à jour de l'incident réalisée avec succès"
		})

	} catch (error) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}

export async function createAgence(input, res) {
	log("\n" + chalk.green(input.reference));
	try {
		log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))

		log("\n" + chalk.yellow("Insertion des incidents agence"))
		const createNewIncidentAgence = await sequelize.query(queries.CreationIncidentAgence(), {
			bind: {
				description: input.description,
				cause: input.cause,
				statut_id: input.statut_id,
				priorite_id: input.priorite_id,
				is_agence: input.is_agence
			},
			type: Sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})

		log("\n" + chalk.yellow("création de l'id"))
		const idIncident = createNewIncidentAgence[0]
		log("\n" + chalk.green(idIncident));
		const createRef = await sequelize.query(queries.CreationReferencesAgence(), {
			bind: {
				reference: input.reference,
				incident_id: idIncident
			}
		})
		const createImpactEnseigne = await sequelize.query(queries.CreationImpactEnseignesAgence(input), {
			bind: {
				idIncident: idIncident,
				enseigne_impactee: input.enseigne_impactee,
				description_impact: input.description_impact,
    			nbUtilisateur: input.nbUtilisateur
			},
			type: Sequelize.QueryTypes.SELECT,
			type: Sequelize.DataTypes.STRING
		})


		// Insertion des références
		log("\n" + chalk.yellow("Insertion des références incidents "))
		await sequelize.query(createRef)

		// Insertion des impacts enseignes
		log("\n" + chalk.yellow("Insertion des ensegnes impactés "))
		await sequelize.query(createImpactEnseigne)

		// Insertion des applications impactées
		log("\n" + chalk.yellow("Insertion des applications impactées"))
		await sequelize.query(queries.CreationApplicationsImpacteesAgence(input.application_impactee, idIncident))

		// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
		log("\n" + chalk.green("---Ajout des agences effectué (SUCCES)  ---"))
		res.status(200).json({
			message: " Ajout des agences réalisée avec succès"
		})

	} catch (error) {
		return res.status(500).json({
			message: "Une erreur est survenue ."
		});
	}

}

export async function updateAgence(input, res) {
	try {
		log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))

		const updateIncident = queries.UpdateIncidentAgence(input)
		const updateIncidentImpactEnseigne = queries.UpdateIncidentImpactEnseigneAgence(input)


		// Mise à jour des incidents
		log("\n" + chalk.yellow("Mise à jour des incidents"))
		await sequelize.query(updateIncident)

		// Mise à jour des enseignes impactées
		log("\n" + chalk.yellow("Mise à jour des enseignes impactées"))
		await sequelize.query(updateIncidentImpactEnseigne)


		// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
		log("\n" + chalk.green("---Fin de la modification (SUCCES)  ---"))
		res.status(200).json({
			message: " Ajout des agences réalisée avec succès"
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}

export async function updateMainCouranteAgence(res, input) {
	try {

		// Delete des informations à l'id de l'incident sélectionné
		await sequelize.query(queries.DeleteIncidentImpactEnseigne(), {
			bind: {
				id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentApplicationImpactee(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncidentReference(), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})
		await sequelize.query(queries.DeleteIncident(input), {
			bind: {
				incident_id: input.incident_id
			},
			type: Sequelize.QueryTypes.SELECT
		})

		log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
		// On insert dans la table incident en premier (clés étrangères obligent)
		const insertResult = await sequelize.query(queries.CreationIncidentMainCourante(input))
		// On récupère l'id d el'incident nouvellement crée
		const idIncident = insertResult[1].lastID

		log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

		// Insertion des références
		log("\n" + chalk.yellow("Insertion des références"))
		await sequelize.query(queries.CreationReferences(input, idIncident))

		// Insertion des impacts enseignes
		log("\n" + chalk.yellow("Insertion des impacts enseignes"))
		await sequelize.query(queries.CreationImpactEnseignesMainCouranteAgence(input, idIncident))

		// Insertion des applications impactées
		log("\n" + chalk.yellow("Insertion des applications impactées"))
		for (const appImpactee of input.application_impactee) {
			await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
		}

		// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
		log("\n" + chalk.green("---Fin de la modification (SUCCES)  ---"))
		res.status(200).json({
			message: " Ajout des agences réalisée avec succès"
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}

}


// Functions pour les Statistiques

//Récupération des priorités dans la table incident pour stats

export function statGetPriorite(res) {
	sequelize.query("SELECT priorite_id FROM incident;").then(([results]) => {
		res.json(results)
	})
}

export function statGetApplications(res) {
	sequelize.query("select application_code_irt, count(application_code_irt) as 'nb_occurence', nom_appli from incident_application_impactee group BY application_code_irt;").then(([results]) => {
		res.json(results)
	})
}
export function statGetMajInc(res) {
	sequelize.query("SELECT count(gravite_id) as 'nb_majeur' FROM incident_impact_enseigne WHERE gravite_id=3;").then(([results]) => {
		res.json(results)
	})
}




// export const Changement = sequelize.define("changements", {
// 	// attributes
// 	reference: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},
// 	urgent: {
// 		type: Sequelize.BOOLEAN,
// 		allowNull: false
// 	},
// 	classification: {
// 		type: Sequelize.STRING
// 		// allowNull defaults to true
// 	}


export async function selectMatricule(matricule, res) {
	try {
		log("\n" + chalk.yellow(matricule.matricule))
		let userId

		sequelize.query(queries.selectByMatricule(), {
			replacements: {
				matricule: matricule.matricule
			},
			type: sequelize.QueryTypes.SELECT
		}).then(([results]) => {
			userId = results
			console.log(userId)
			console.log(userId.id)
			if (!userId) return res.status(404).send("L'utilisateur n'as pas été trouvée .")
			//let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass)
			//if(!passwordIsValid) return res.status(401).send({auth: false, token: null})
			log("\n" + chalk.blueBright(userId.id))
			const token = jwt.sign({
				id: userId.id
			}, config.secret, {
				expiresIn: config.tokenLife
			})
			const refreshToken = jwt.sign({
				id: userId.id
			}, config.refreshTokenSecret, {
				expiresIn: config.refreshTokenLife
			})
			const response = {
				"status": "Logged in",
				"token": token,
				"refreshToken": refreshToken,
				"user": userId.id,
				"role": userId.roleId,
				"auth": true
			}
			console.log(response.role)
			tokenList[refreshToken] = response
			res.status(200).json(response);
			// res.status(200).send({auth:true,token:token, user: userId.id})
		})
	} catch (err) {
		return res.status(500).json({
			message: 'Une erreur est survenue .'
		});
	}
}