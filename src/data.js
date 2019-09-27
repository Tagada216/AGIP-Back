import * as queries from "./requetes.js"
import chalk from "chalk"

const log = console.log

////////////////////////////////////////
// Initialisation de la base de données.
////////////////////////////////////////
const Sequelize = require("sequelize")
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_toolboxTestKev.sdb",
	define: {
		timestamps: false
	}
})

// Ajout d'un cache de la liste des application
// Sinon la base met 10 à 30 secondes pour répondre
var appCache
sequelize.query(queries.AllApplications()).then(([results]) => {
	appCache = results
})

var nombreCiFictif 
sequelize.query("Select 'F' || max(CI)+1 as 'nbCiFictif' from (Select replace(code_irt,'F','') as 'CI' from application where code_irt like 'F%')").then(([results]) => {
	nombreCiFictif = results[0].nbCiFictif
})
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

export function getApp(res) {
	res.json(appCache)
}


export async function createMainCourante(res, input) {
	log("\n"+chalk.yellow("--- DEBUT DE L'INSERTION ---"))
	// On insert dans la table incident en premier (clés étrangères obligent)
	const insertResult = await sequelize.query(queries.CreationIncident(input))
	// On récupère l'id d el'incident nouvellement crée
	const idIncident = insertResult[1].lastID

	log(chalk.blue("\n"+"L'id de l'incident nouvellement inseré est ") + chalk.underline.green(idIncident))

	// Insertion des références
	log("\n"+chalk.yellow("Insertion des références"))
	await sequelize.query(queries.CreationReferences(input, idIncident))

	// Insertion des impacts enseignes
	log("\n"+chalk.yellow("Insertion des impacts enseignes"))
	await sequelize.query(queries.CreationImpactEnseignes(input, idIncident))

	// Insertion des applications impactées
	log("\n"+chalk.yellow("Insertion des applications impactées"))
	for (const appImpactee of input.application_impactee) {
		await sequelize.query(queries.CreationApplicationsImpactees(appImpactee, idIncident))
	}

	log("\n"+chalk.green("--- FIN DE L'INSERTION (SUCCES) ---"))
	res.sendStatus(200)
}

export async function updateMainCourante(res, input) {

	//console.log(input)
	console.log(queries.UpdateIncident(input))

	// On prépare l'update des infos principales de l'incident
	const updateInfosPrincipales = queries.UpdateIncident(input)

	// on filtre les references qui n'ont pas d'id en base (les nouvelles references)
	const nouvellesReferences = input.references.filter(ref => ref.reference_id === undefined)

	// On cree la requete si il y a de nouvelles references sinon on met un commentaire dans la requete avec le double tiret "--"
	const insertNouvellesReferences = nouvellesReferences.length == 0 ?
		null :
		queries.CreationReferences({
			references: nouvellesReferences
		}, input.incident_id)

	// On prépare le delete des references
	const referenceToDelete = queries.DeleteReferences(input)
	
	
	//await sequelize.query(updateInfosPrincipales)
	await sequelize.query(referenceToDelete)
	if(insertNouvellesReferences) await sequelize.query(insertNouvellesReferences)



	// const refInputIds = input.references.map(inputRef => "("+inputRef.reference_id+")").join()
	// const refDbids = referenceInDB[0].map(dbRef => dbRef.id)
	// const idsToDelete = refDbids.filter(x => !refInputIds.includes(x))

	// console.log(refInputIds)
	// console.log(refDbids)
	// console.log()
	
	// console.log(idsToDelete)
	

	// //////////////
	// // Update des references
	// //////////////

	
	


	// 	// on insert les nouvelles references précédemment filtrees en base
	// 	// sequelize.query(queries.CreationReferences(nouvellesReferences, input.incident_id)).then((result) => {
	
	// Le "res.sendStatus" est nécessaire pour que le front sache que tout c'est bien passé et qu'il est possible de recharger les données
	res.sendStatus(200)




	// })

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
// }, {})