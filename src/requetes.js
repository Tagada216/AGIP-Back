//import { SELECT } from "sequelize/types/lib/query-types";

/*
	Ce fichier compilera à terme toutes les requetes de l'API
Cela permetra de séparer les requètes qui sont très verbeuses des appels à la base de données.

	De plus j'utilise une specificité du javascript : c'est les "Template Strings"
Plus d'information à leurs sujet sont disponible en suivant ce lien : 
https://www.alsacreations.com/astuce/lire/1764-Les-template-strings-en-JavaScript.html

	Dans SQL, les requetes ne sont pas sensibles aux espacements.
Ainsi pour plus de lisibilité je recomande de bien indenter et de passer des lignes.

Par exemple :
	Select t1.c1, t1.c2, t1.c3 ,t2.c1, t2.c2 from t1 join t2 on t1.id = t2.t1id where t1.c1 < 10

Il sera préférable de marquer :
	SELECT t1.c1,
		t1.c2,
		t1.c3,
		t2.c1,
		t2.c2
	FROM t1 JOIN t2 ON t1.id = t2.t1id
	WHERE t1.c1 < 10

*/

export function FormatedMainCourante(id) {
	return `
SELECT incident.id, 
	replace(group_concat(DISTINCT incident_reference.reference),",","/") as 'Référence', 
	strftime("%d/%m/%Y %H:%M:%S", incident_impact_enseigne.date_debut) as 'Date de début', 
	replace(group_concat(DISTINCT enseigne.nom),",","/") as 'Enseigne', 
	coalesce(replace(group_concat(DISTINCT application.nom),","," | "),incident.import_code_irt) as 'Application', 
	incident.description as Description, 
	incident_priorite.priorite as Priorité, 
	incident_statut.nom as Statut, 
	coalesce(strftime("%d/%m/%Y %H:%M:%S",incident_impact_enseigne.date_fin), replace(replace(incident.is_faux_incident, 1, 'Faux incident'), 0, 'Incident en cours')) as 'Date de fin', 
	incident_impact_enseigne.description_impact as 'Impact', 
	incident.description_contournement as 'Contournement', 
	incident.cause as Cause, 
	incident.origine as Origine, 
	incident.action_retablissement as "Action de rétablissement", 
	incident.plan_action as "Plan d'action", 
	strftime("%d/%m/%Y %H:%M:%S", incident_impact_enseigne.date_detection) as 'Détection',
	strftime("%d/%m/%Y %H:%M:%S", incident_impact_enseigne.date_com_tdc) as 'Communication TDC', 
	strftime("%d/%m/%Y %H:%M:%S", incident_impact_enseigne.date_qualif_p01) as 'Qualification P0 P1',
	strftime("%d/%m/%Y %H:%M:%S", incident_impact_enseigne.date_premier_com) as "1ere communication à l'enseigne"
FROM (((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_statut on incident.statut_id = incident_statut.id) 
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id) 
	join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
	left join incident_application_impactee on incident.id = incident_application_impactee.incident_id
	left join application on application.code_irt = incident_application_impactee.Application_code_irt 
		and application.trigramme = incident_application_impactee.Application_trigramme
${(id === undefined ? "" : "WHERE incident.id = "+id)}
GROUP BY incident_reference.incident_id
ORDER BY incident.id asc;
`
}

export function MainCourante(id) {
	return `
	SELECT incident.id, 
	replace(group_concat(DISTINCT incident_reference.id),",","/") as 'reference_id', 
	replace(group_concat(DISTINCT incident_reference.reference),",","/") as 'reference', 
	replace(group_concat(DISTINCT enseigne.id),",","/") as 'id_enseigne', 
	incident_impact_enseigne.date_debut as 'date_debut', 
	incident.description as 'description', incident_priorite.id as 'priorite', 
	incident_statut.id as 'statut', incident_impact_enseigne.date_fin as 'date_fin', 
	incident_impact_enseigne.description_impact as 'description_impact', incident.cause as 'cause', 
	incident.origine as 'origine', incident.action_retablissement as 'action_retablissement',
	incident.plan_action as 'plan_action', 
	incident_impact_enseigne.date_detection as 'date_detection',
	incident_impact_enseigne.date_com_tdc as 'date_communication_tdc', 
	incident_impact_enseigne.date_qualif_p01 as 'date_qualif_p01',
	incident_impact_enseigne.date_premier_com as 'date_premier_com',
	incident.is_faux_incident as 'is_faux_incident',
	incident.is_contournement as 'is_contournement', 
	incident.description_contournement as 'description_contournement',
	replace(group_concat(DISTINCT application.trigramme || '-' || 
		application.code_irt || ' : ' || 
		coalesce(libelle_court, '') || ' (' || 
		coalesce(application.nom, '') || ')'
	),",","|||") as display_name
FROM ((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_statut on incident.statut_id = incident_statut.id) 
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
	join incident_application_impactee on incident.id = incident_application_impactee.incident_id
	join application on application.code_irt = incident_application_impactee.Application_code_irt AND application.trigramme = incident_application_impactee.Application_trigramme
${(id === undefined ? "" : "WHERE incident.id = "+id)}
GROUP BY incident_reference.incident_id
ORDER BY incident.id asc;
`
}

export function Applications(keyword) {
	return `
SELECT application.trigramme || '-' || application.code_irt || ' : ' || coalesce(libelle_court, '') || ' (' || coalesce(nom, '') || ')' || coalesce('[' || nom_usage || ']', '')  as 'display_name'
FROM application left join application_alias
	on application.code_irt = application_alias.code_irt 
	and application.trigramme = application_alias.trigramme
WHERE application.code_irt like "%${keyword}%"
	or application.trigramme like "%${keyword}%"
	or libelle_court like "%${keyword}%"
	or nom like "%${keyword}%"
	or nom_usage like "%${keyword}%";
`
}

export function AllApplications() {
	return `
SELECT 
	coalesce(application.trigramme,'') as trigramme, 
	coalesce(application.code_irt,'') as code_irt,
	coalesce(libelle_court,'') as libelle_court, 
	coalesce(nom,'') as nom, 
	coalesce(nom_usage,'') as nom_usage,
	application.trigramme || '-' || 
		application.code_irt || ' : ' || 
		coalesce(libelle_court, '') || ' (' || 
		coalesce(nom, '') || ')' || 
		coalesce('[' || nom_usage || ']', '')  as display_name,
	CPT
FROM (application LEFT JOIN application_alias
	ON application.code_irt = application_alias.code_irt 
	AND application.trigramme = application_alias.trigramme)
	LEFT JOIN (
		SELECT application_trigramme as 'TRG', application_code_irt as 'IRT', count(*) as 'CPT' from incident_application_impactee 
		GROUP BY application_trigramme, application_code_irt
	) ON application.trigramme = TRG and application.code_irt = IRT
ORDER BY cpt DESC
`
}

////////////////////////////////////
///////////// AJOUT ////////////////
////////////////////////////////////

export function CreationIncident(input) {
	return `
INSERT INTO incident(
	description, 
	statut_id, 
	priorite_id, 
	is_contournement,
	description_contournement,
	is_faux_incident)
VALUES(
	"${input.description}",
	${input.statut_id},
	${input.priorite_id},
	${input.is_contournement ? 1 : 0},
	"${input.description_contournement}",
	${input.is_faux_incident ? 1 : 0});
`
}

export function CreationReferences(input, idIncident) {
	return `
INSERT INTO incident_reference (
	reference, 
	incident_id)
VALUES
	${input.references.map(ref => `("${ref.reference}", ${idIncident})`).join(",\n\t")};
`
}

export function CreationImpactEnseignes(input, idIncident) {
	const valuesString = input.enseigne_impactee
		.map(
			enseigne => `(${idIncident},${enseigne},"${input.description_impact}","${input.date_debut}", ${input.is_faux_incident || (input.date_fin == null) ? "NULL" : "\""+input.date_fin+"\""})`)
		.join(",\n\t")

	return `
INSERT INTO incident_impact_enseigne (
	incident_id,
	enseigne_id,
	description_impact,
	date_debut,
	date_fin)
VALUES
	${valuesString};
`
}

/*
	Pour cette requete il peut sembler bizar dans le "else" d'insérer une entrée qui n'est pas sensé exister.
	Cepandant cela est contré par un trigger crée dans la BDD qui crée l'application dans la table "application".
	Ainsi, les clés étrangères sont réspectés
	Qu'est-ce qu'un trigger : https://openclassrooms.com/fr/courses/1959476-administrez-vos-bases-de-donnees-avec-mysql/1973090-triggers
	Doc SQLITE et trigger : https://sqlite.org/lang_createtrigger.html
*/
export function CreationApplicationsImpactees(application, idIncident){
	console.log(application)
	if (application.trigramme !== undefined && application.code_irt !== undefined){
		return `
INSERT INTO incident_application_impactee
VALUES(
	${idIncident}, 
	"${application.code_irt}", 
	"${application.trigramme}",
	NULL);	
`	
	}
	else
		return `
INSERT INTO incident_application_impactee
	SELECT ${idIncident}, 'F' || (max(CAST(CI AS INTEGER))+1), "FFF", "${application.display_name}" 
	FROM (SELECT replace(code_irt,'F','') AS 'CI' FROM application WHERE code_irt LIKE 'F%')
`
}

///////////////////////////////////////
/////////////// UPDATE ////////////////
///////////////////////////////////////

export function UpdateIncident(input) {
	return `
UPDATE incident
SET 
	description = "${input.description}", 
	statut_id=${input.statut_id}, 
	priorite_id=${input.priorite_id}, 
	description_contournement="${input.description_contournement}", 
	cause="${input.cause}", 
	origine="${input.origine}", 
	plan_action="${input.plan_action}", 
	action_retablissement="${input.action_retablissement}", 
	is_contournement=${input.is_contournement ? 1 : 0}, 
	is_faux_incident=${input.is_faux_incident ? 1 : 0}
WHERE id=${input.incident_id};
`
}

export function GetReferences(idIncident) {
	return `
SELECT incident_reference.id
FROM incident_reference
WHERE incident_reference.incident_id = ${idIncident}
`
}

export function DeleteReferences(input) {
	// On filtre les références ayant un ID en base et on regarde si il n'y a aucune valeur dans le tableau
	const isNoOtherValues = input.references.filter(ref => ref.reference_id !== undefined).length == 0
	return `
DELETE
FROM incident_reference
WHERE incident_reference.incident_id = ${input.incident_id} AND incident_reference.id not in (
	VALUES(-1)${isNoOtherValues ? "" : ","} ${input.references.filter(ref => ref.reference_id !== undefined).map(inputRef => "("+inputRef.reference_id+")").join()});
`
}

export function UpdateImpactEnseignes(input, checkbox, datepicker) {
	return `
UPDATE incident_impact_enseigne
SET enseigne_id=${checkbox.enseigne_id}, description_impact="${input.description_impact}", date_debut=${datepicker.date_debut}, date_fin=${datepicker.date_fin},
date_detection=${datepicker.date_detection}, date_com_tdc=${datepicker.date_com_tdc}, date_qualif_p01=${datepicker.date_qualif_p01}, date_premier_com=${datepicker.date_premier_com}
WHERE incident_id=(SELECT incident_id FROM incident_impact_enseigne)
`
}





///////////////////////////////////////
/////////////// Problèmes /////////////
///////////////////////////////////////


export function getProbs(){
	return `
SELECT probs.ref as 'Référence',
	probs.titre as 'Titre',
	probs.date_ouverture as "Date d'ouverture",
	probs.statut as 'Statut',
	probs.date_fin_previsionnelle as 'Date de fin prévisionelle',
	probs.date_cloture as 'Date de cloture',
	probs.code_irt as "Code IRT de l'application",
	probs.enseigne_impactees as 'Enseignes',
	probs.branche_rpa as 'Branche du RPA',
	probs.service_rpa as 'Service du RPA',
	probs.groupe_affectation_rpa_jump as "Groupe d'affectation JUMP du RPA ",
	probs.priorite_incident as "Priorité de l'incident",
	probs.risque_reproduction as 'Risque de reproduction',
	probs.priorite_probleme_ouverture as "Priorité du problème à l'ouverture",
	probs.resume as 'Résumé',
	probs.impacts as 'Impacts',
	probs.cause as "Cause de l'incident",
	probs.origine as "Origine de l'incident",
	probs.plan_action as "Plan d'action",
	probs.plan_action_realise as "Etat du plan d'action",
	probs.problem_manager as "Problem Manager",
	probs.echeance as "Date d'échéance",
	probs.descritpion as 'Description',
	probs.description_costrat as 'Description COPIL/COSTRAT',
	probs.action_costrat as 'Action COPIL/COSTRAT',
	probs.couche_si as 'Couche du SI impactée',
	probs.application,
	probs.impact_itsm,
	probs.cause_itsm
From probs;
`
}