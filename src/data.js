import * as queries from "./requetes.js"

////////////////////////////////////////
// Initialisation de la base de données.
////////////////////////////////////////
const Sequelize = require("sequelize")
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_toolboxTest.sdb",
	define: {
		timestamps: false
	}
})
////////////////////////////////////////



export function getIncidents(res) {
	sequelize.query(
		"select incident.id, incident.description, incident.cause, incident.origine, incident.observations, incident.plan_action, incident_status.nom as status, " +
		"incident_priorite.priorite, incident_entite_responsable.nom as entite_responsable , incident_couche_si_impactee.nom as couche_si_impactee, " +
		"incident_cause_racine.nom as cause__racine, incident.nombre_occurence, incident.crise_itim, incident.departement_responsable, " +
		"'incident.sous-traitant_responsable' as sous_traitant_responsable, incident.service_metier, incident.famille_service_metier, incident.obsolescence, " +
		"incident.pm_id, incident.probleme_id, incident.import_code_irt, incident.import_probleme_ref, incident.nom_app_impactante, " +
		"changements.reference, changements.urgent, changements.classification " +
		"from incident " +
		"join incident_status on incident_status.id = incident.status_id " +
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
		"select incident.id, incident.description, incident.cause, incident.origine, incident.observations, incident.plan_action, incident_status.nom as status, " +
		"incident_priorite.priorite, incident_entite_responsable.nom as entite_responsable , incident_couche_si_impactee.nom as couche_si_impactee, " +
		"incident_cause_racine.nom as cause__racine, incident.nombre_occurence, incident.crise_itim, incident.departement_responsable, " +
		"'incident.sous-traitant_responsable' as sous_traitant_responsable, incident.service_metier, incident.famille_service_metier, incident.obsolescence, " +
		"incident.pm_id, incident.probleme_id, incident.import_code_irt, incident.import_probleme_ref, incident.nom_app_impactante, " +
		"changements.reference, changements.urgent, changements.classification " +
		"from incident " +
		"join incident_status on incident_status.id = incident.status_id " +
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

export function getIncStatus(res) {
	sequelize.query("select * from incident_status;").then(([results]) => {
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

export function getApp(res, keyword) {
	sequelize.query(queries.Applications(keyword)).then(([results]) => {
		//console.log({data: results})

		res.json({
			data: results
		})
	})
	
}


export function createMainCourante(res, input) {
	var idIncident
	// On insert dans la table incident en premier (clés étrangères obligent)
	console.log(input)

	sequelize.query(
		"insert into incident(description, status_id, priorite_id)" +
		" VALUES(\"" + input.infosIncident.description + "\", " + input.infosIncident.statut + ", " + input.infosIncident.priorite + ");"
	).then(([, metadata]) => {
		//On récupère l'ID de l'incident tout juste crée pour les insertions suivantes
		idIncident = metadata.lastID


		//sequelize.query("insert into incident_application_impactante values(" + idIncident + ", \"" + input.impactsApplicatifs.applicationImpactee.codeIRT + "\", \"" + input.impactsApplicatifs.applicationImpactee.trigramme + "\");")
		//sequelize.query("insert into incident_application_impactee values(" + idIncident + ", \"" + input.impactsApplicatifs.applicationImpactee.codeIRT + "\", \"" + input.impactsApplicatifs.applicationImpactee.trigramme + "\");")

		// On insert toutes les référence de l'incident
		for (const ref of input.references) {
			sequelize.query("insert into incident_reference (reference, incident_id) values(\"" + ref.reference + "\", " + idIncident + ");")
		}

		// // On met les impacts 
		for (const ensImpact of Object.values(input.impactsEnseignes)) {
			if (ensImpact.estImpactee) {
				sequelize.query("insert into incident_impact_enseigne(incident_id, enseigne_id, date_debut, description_impact) values(" + idIncident + ", " + ensImpact.id + ", \"" + input.horodatages.debutIncident + "\", \"" + input.infosIncident.impact + "\");")
			}
		}

		//console.log(input.infosIncident.impact)
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
// }, {})