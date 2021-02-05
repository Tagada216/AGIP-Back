import * as queries from "./requetes.js"
import chalk from "chalk"
import {
	response
} from "express"

// Petite ligne permettant d'utiliser log() au lieu de console.log
const log = console.log

////////////////////////////////////////
// Initialisation de la base de données.
////////////////////////////////////////
const Sequelize = require("sequelize")
const sequelize = new Sequelize({
	dialect: "sqlite",
	// DEV : "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD-Dev.sdb"
	// Master: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD-Master.sdb"
	storage: "C:/Users/A487365/Documents/BDD/TDC_AGIPROS_BDD.sdb",
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
		"where incident.id = " + idIncident + ";"
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

export function getCosipByWeek(res, week){
	sequelize.query(queries.getCosipByWeek(week)).then(([results])=>{
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


export async function createMainCourante(res, input) {
	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	const insertResult = await sequelize.query(queries.CreationIncident(input))
	// On récupère l'id d el'incident nouvellement crée
	const idIncident = insertResult[1].lastID

	log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferences(input, idIncident))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignes(input, idIncident))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function createMainCouranteAgence(res, input) {
	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	const insertResult = await sequelize.query(queries.CreationIncidentAgence(input))
	// On récupère l'id d el'incident nouvellement crée
	const idIncident = insertResult[1].lastID

	log(chalk.blue("\n" + "L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferencesAgence(input, idIncident))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignesAgence(input, idIncident))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function insertMainCourante(res, input) {
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
	await sequelize.query(queries.CreationImpactEnseignesMainCourante(input, idIncident))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(input, appImpactee, idIncident))
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



// ---------------  Insertion d'un incident au COSIP ------------------
export async function AddToCosip(res, input, idIncident) {

	const deleteIncidentImpEns = queries.DeleteIncidentImpactEnseigne(input)

	await sequelize.query(deleteIncidentImpEns)

	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION AU COSIP ---"))
	//On insert dans la table cosip en premier (clés étrangére obligent)
	const insertResult = await sequelize.query(queries.CreationCosip(input))
	//On récupére l'id de l'incident nouvellement crée 
	const idCosip = insertResult[1].lastID

	log(chalk.blue("\n" + "L'id Cosip de l'incident est ") + chalk.underline.green(idCosip))

	//Insertion des modifications ou non dans la table incident
	log("\n" + chalk.yellow("--- Insertion des modifications de l'incident ----"))
	await sequelize.query(queries.CosiptoIncident(input, idCosip, idIncident))

	//Insertion des modification ou non dans la table incident_impact_enseigne
	log("\n" + chalk.yellow("---- Insertion des impacts enseignes ----"))
	await sequelize.query(queries.AddImpactEnseignesCosip(input, idIncident))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("---- Insertion des applications impactées --- "))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION AU COSIP (SUCCES) ---"))
	res.sendStatus(200)
}


// ---------------  Modification du COSIP ------------------
export async function UpdateCosip(res, input) {
	const deleteIncidentAppImpactee = queries.DeleteIncidentApplicationImpactee(input)
	const deleteIncidentImpEns = queries.DeleteIncidentImpactEnseigne(input)

	await sequelize.query(deleteIncidentImpEns)
	await sequelize.query(deleteIncidentAppImpactee)


	log("\n" + chalk.yellow("--- DEBUT DE L'UPDATE AU COSIP ---"))
	//On insert dans la table cosip en premier (clés étrangére obligent)
	await sequelize.query(queries.UpdateCosip(input))

	//Insertion des modifications ou non dans la table incident
	log("\n" + chalk.yellow("--- Insertion des modifications de l'incident ----"))
	await sequelize.query(queries.UpdateCosiptoIncident(input))

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignesCosip(input, input.incident_id))

	// Insertion des applications impactées
	log("\n" + chalk.yellow("---- Insertion des applications impactées --- "))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, input.incident_id))
	}

	log("\n" + chalk.green("--- FIN DE L'INSERTION AU COSIP (SUCCES) ---"))
	res.sendStatus(200)
}

export async function deleteIncident(res, input) {
	const deleteIncidentAppImpactee = queries.DeleteIncidentApplicationImpactee(input)
	const deleteIncidentImpEns = queries.DeleteIncidentImpactEnseigne(input)
	const deleteIncidentRef = queries.DeleteIncidentReference(input)
	const deleteIncident = queries.DeleteIncident(input)

	await sequelize.query(deleteIncidentAppImpactee)
	await sequelize.query(deleteIncidentImpEns)
	await sequelize.query(deleteIncidentRef)
	await sequelize.query(deleteIncident)

	res.sendStatus(200)
}


export async function updateMainCourante(res, input) {


	const deleteIncidentImpEns = queries.DeleteIncidentImpactEnseigne(input)
	const deleteIncidentAppImpactee = queries.DeleteIncidentApplicationImpactee(input)

	await sequelize.query(deleteIncidentImpEns)
	await sequelize.query(deleteIncidentAppImpactee)


	// Insert des modifications effectuées (il faudrait insert à l'id qui a servi pour le delete (si possible))	 
	log("\n" + chalk.yellow("--- DEBUT DE L'UPDATE ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	await sequelize.query(queries.UpdateIncident(input))

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
	res.sendStatus(200)

	// })

}

export async function createAgence(input) {

	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// console.log(input);
	// log("\n"+chalk.yellow(await sequelize.query(queries.CreationIncidentAgence(input))))
	log("\n" + chalk.yellow("Insertion des incidents agence"))
	const createNewIncidentAgence = await sequelize.query(queries.CreationIncidentAgence(input))
	log("\n" + chalk.yellow("création de l'id"))
	const idIncident = createNewIncidentAgence[1].lastID
	const createRef = queries.CreationReferencesAgence(input, idIncident)
	const createImpactEnseigne = queries.CreationImpactEnseignesAgence(input, idIncident)


	// Insertion des références
	log("\n" + chalk.yellow("Insertion des références incidents "))
	await sequelize.query(createRef)

	// Insertion des impacts enseignes
	log("\n" + chalk.yellow("Insertion des ensegnes impactés "))
	await sequelize.query(createImpactEnseigne)

	// Insertion des applications impactées
	log("\n" + chalk.yellow("Insertion des applications impactées"))
		await sequelize.query(queries.CreationApplicationsImpacteesAgence(input.application_impactee, idIncident))
	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))


	// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
	// res.sendStatus(200)

}

export async function updateAgence(res) {

	log("\n" + chalk.yellow("--- DEBUT DE L'INSERTION ---"))

	const updateIncident = queries.UpdateIncidentAgence(res)
	const updateIncidentImpactEnseigne = queries.UpdateIncidentImpactEnseigneAgence(res)


	// Mise à jour des incidents
	log("\n" + chalk.yellow("Mise à jour des incidents"))
	await sequelize.query(updateIncident)

	// Mise à jour des enseignes impactées
	log("\n" + chalk.yellow("Mise à jour des enseignes impactées"))
	await sequelize.query(updateIncidentImpactEnseigne)

	
	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))


	// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
	// res.sendStatus(200)
}

export async function updateMainCouranteAgence(res, input) {


	// Delete des informations à l'id de l'incident sélectionné
	const deleteIncidentAppImpactee = queries.DeleteIncidentApplicationImpactee(input)
	const deleteIncidentImpEns = queries.DeleteIncidentImpactEnseigne(input)
	const deleteIncidentRef = queries.DeleteIncidentReference(input)
	const deleteIncident = queries.DeleteIncident(input)

	await sequelize.query(deleteIncidentAppImpactee)
	await sequelize.query(deleteIncidentImpEns)
	await sequelize.query(deleteIncidentRef)
	await sequelize.query(deleteIncident)

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

	log("\n" + chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))


	// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
	res.sendStatus(200)

}

export async function statOrigineIncidentsMajeurs(res) {
	var test = await sequelize.query(queries.getOrigineIncMaj())
	log(test)
	res.json({})
}

// Functions poour les Statistiques

//Récupération des priorité dans la table incident pour stats
export function statGetPriorite(res){
	sequelize.query("SELECT priorite_id FROM incident;").then(([results]) => {
		res.json(results)
	})
}

export function statGetApplications(res){
	sequelize.query("select application_code_irt, count(application_code_irt) as 'nb_occurence', nom_appli from incident_application_impactee group BY application_code_irt;").then(([results]) => {
		res.json(results)
	})
}
export function statGetMajInc(res){
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
