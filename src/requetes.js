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
	Select t1.c1, t1.c2, t1.c3 ,t2.c1, t2.c2 from t1 join t2 on t1.id = t2.id where t1.c1 < 10

Il sera préférable de marquer :
	SELECT t1.c1,
		t1.c2,
		t1.c3,
		t2.c1,
		t2.c2
	FROM t1 JOIN t2 ON t1.id = t2.id
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
ORDER BY incident.id desc;
`
}
//Code préseant avant la correction de l'incrémentation du code tigramme. 

/*replace(group_concat(DISTINCT application.trigramme || '-' || 
application.code_irt || ' : ' || 
coalesce(libelle_court, '') || ' (' || 
coalesce(application.nom, '') || ')'
),",","|||") as 'display_name'*/

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
	incident.cosip_id,
	incident.description_contournement as 'description_contournement',
	replace(group_concat(DISTINCT application.nom ),",","|||") as 'display_name'
FROM ((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_statut on incident.statut_id = incident_statut.id) 
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
	left join incident_application_impactee on incident.id = incident_application_impactee.incident_id
	left join application on application.code_irt = incident_application_impactee.Application_code_irt AND application.trigramme = incident_application_impactee.Application_trigramme
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


export function AllReferences() {
	return `
SELECT reference, incident_id
FROM incident_reference
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


export function CreationIncidentAgence(input) {
	return `
INSERT INTO incident(
	description,
	cause,
	statut_id, 
	priorite_id, 
	is_contournement,
	description_contournement,
	is_faux_incident)
VALUES(
	"${input.description}",
	"${input.cause}",
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


export function CreationReferencesAgence(input, idIncident) {
	return `
INSERT INTO incident_reference (
	reference, 
	incident_id)
VALUES(
	"${input.references}",
	${idIncident});
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


export function CreationImpactEnseignesAgence(input, idIncident) {
	return `
INSERT INTO incident_impact_enseigne (
	incident_id,
	enseigne_id,
	description_impact,
	date_debut,
	date_fin)
VALUES(
	${idIncident},
	${input.enseigne_impactee},
	"${input.description_impact}",
	"${input.date_debut}",
	${input.is_faux_incident || (input.date_fin == null) ? "NULL" : "\""+input.date_fin+"\""}
);
`
}


export function CreationIncidentMainCourante(input) {
	return `
INSERT INTO incident(
	description, 
	statut_id, 
	priorite_id, 
	is_contournement,
	description_contournement,
	is_faux_incident,
	cause,
	origine,
	plan_action,
	action_retablissement,
	cosip_id)
VALUES(
	"${input.description}",
	${input.statut_id},
	${input.priorite_id},
	${input.is_contournement ? 1 : 0},
	"${input.description_contournement}",
	${input.is_faux_incident ? 1 : 0},
	"${input.cause}",
	"${input.origine}",
	"${input.plan_action}",
	"${input.action_retablissement}",
	${input.cosip_id});
`
}


export function CreationImpactEnseignesMainCourante(input, idIncident) {
	const valuesString = input.enseigne_impactee
		.map(
			enseigne => `(${idIncident},${enseigne},"${input.description_impact}","${input.date_debut}","${input.date_detection}","${input.date_communication_TDC}","${input.date_qualification_p01}","${input.date_premiere_com}", ${input.is_faux_incident || (input.date_fin == null) ? "NULL" : "\""+input.date_fin+"\""})`)
		.join(",\n\t")

	return `
INSERT INTO incident_impact_enseigne (
	incident_id,
	enseigne_id,
	description_impact,
	date_debut,
	date_detection,
	date_com_tdc,
	date_qualif_p01,
	date_premier_com,
	date_fin)
VALUES
	${valuesString};
`
}


export function CreationImpactEnseignesMainCouranteAgence(input, idIncident) {
	return `
INSERT INTO incident_impact_enseigne (
	incident_id,
	enseigne_id,
	description_impact,
	date_debut,
	date_detection,
	date_com_tdc,
	date_qualif_p01,
	date_premier_com,
	date_fin)
VALUES(
	${idIncident},
	${input.enseigne_impactee},
	"${input.description_impact}",
	"${input.date_debut}",
	"${input.date_detection}",
	"${input.date_communication_TDC}",
	"${input.date_qualification_p01}",
	"${input.date_premiere_com}",
	${input.is_faux_incident || (input.date_fin == null) ? "NULL" : "\""+input.date_fin+"\""}
);
`
}


/*
	Pour cette requete il peut sembler bizare dans le "else" d'insérer une entrée qui n'est pas sensé exister.
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


export function DeleteIncidentApplicationImpactee(input)
{
	return `
DELETE FROM incident_application_impactee
WHERE incident_id=${input.incident_id};
`
}


export function DeleteIncidentImpactEnseigne(input)
{
	return `
DELETE FROM incident_impact_enseigne
WHERE incident_id=${input.incident_id};
`
}


export function DeleteIncidentReference(input){
	return `
DELETE FROM incident_reference
WHERE incident_id=${input.incident_id};	
`
}


export function DeleteIncident(input){
	return `
DELETE FROM incident
WHERE id=${input.incident_id};	
`
}


///////////////////////////////////////
/////////////// UPDATE ////////////////
///////////////////////////////////////


export function UpdateIncident(input) {
	return `
UPDATE incident
SET
	statut_id=${input.statut_id},
	priorite_id=${input.priorite_id},
	is_contournement=${input.is_contournement ? 1 : 0},
	is_faux_incident=${input.is_faux_incident ? 1 : 0},
	description="${input.description}",
	description_contournement="${input.description_contournement}",
	cause="${input.cause}",
	origine="${input.origine}",
	plan_action="${input.plan_action}",
	action_retablissement="${input.action_retablissement}"
WHERE id=${input.incident_id};
`
}
export function UpdateDeleteReferences(input){
	return`
	DELETE
	FROM incident_reference
	WHERE incident_id= "${input.incident_id}";
	`
}
export function UpdateReferences(input) {
	return `
	INSERT INTO incident_reference (
		reference, 
		incident_id)
	VALUES
		${input.references.map(ref => `("${ref.reference}", ${input.incident_id})`).join(",\n\t")};
`
}
export function UpdateCreationApplicationsImpactees(application, incidentId){
	console.log(application)
	if (application.trigramme !== undefined && application.code_irt !== undefined){
		return `
INSERT INTO incident_application_impactee
VALUES(
	${incidentId}, 
	"${application.code_irt}", 
	"${application.trigramme}",
	NULL);	
`	
	}
	else
		return `
INSERT INTO incident_application_impactee
	SELECT ${incidentId}, 'F' || (max(CAST(CI AS INTEGER))+1), "FFF", "${application.display_name}" 
	FROM (SELECT replace(code_irt,'F','') AS 'CI' FROM application WHERE code_irt LIKE 'F%')
`
}
export function UpdateIncidentImpactEnseigne(input) {
	return `
UPDATE incident_impact_enseigne
SET 
	description_impact="${input.description_impact}",
	date_debut="${input.date_debut}",
	date_fin="${input.date_fin}",
	date_detection="${input.date_detection}",
	date_com_tdc="${input.date_communication_TDC}",
	date_qualif_p01="${input.date_qualification_p01}",
	date_premier_com="${input.date_premiere_com}"
WHERE incident_id=${input.incident_id};	
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
/////////////// COSIP /////////////
///////////////////////////////////////
//get is cosip 
export function getIdcosip(input){
	return `
SELECT incident.cosip_id
FROM incident
WHERE id ="${input}"
	`
}
//Création d'un incident au cosip 
export function CreationCosip(input) {
	return `
INSERT INTO cosip (
	entite_responsable,
	titre,
	plan_action,
	cause_racine,
	classification_id,
	gravite_id
	)
VALUES(
	"${input.entite_responsable}",
	"${input.titre}",
	"${input.plan_action}",
	"${input.cause_racine}",
	"${input.classification_id}",
	"${input.gravite_id}"
);
`
}

export function CosiptoIncident(input, idCosip){
	return `
	UPDATE incident
	SET
		cosip_id="${idCosip}",
		statut_id="${input.statut_id}",
		priorite_id="${input.priorite_id}",
		is_contournement="${input.is_contournement ? 1 : 0}",
		is_faux_incident="${input.is_faux_incident ? 1 : 0}",
		description="${input.description}",
		description_contournement="${input.description_contournement}",
		cause="${input.cause}",
		origine="${input.origine}",
		plan_action="${input.plan_action}",
		action_retablissement="${input.action_retablissement}"
	WHERE id ="${input.incident_id}"
	`
}

export function AddImpactEnseignesCosip(input){
	return `
	UPDATE incident_impact_enseigne
	SET
		description_impact="${input.description_impact}",
		date_debut="${input.date_debut}",
		date_fin="${input.date_fin}",
		date_detection="${input.date_detection}",
		date_com_tdc="${input.date_communication_TDC}",
		date_qualif_p01="${input.date_qualification_p01}",
		date_premier_com="${input.date_premiere_com}"
WHERE incident_id="${input.incident_id}";	
	`
}

/////// UPDATE /////////////
////////////////////////

export function UpdateCosip(input){
	return `
	UPDATE cosip
	SET 
		entite_responsable="${input.entite_responsable}",
		titre="${input.titre}",
		plan_action="${input.plan_action}",
		cause_racine="${input.cause_racine}",
		classification_id="${input.classification_id}",
		gravite_id="${input.gravite_id}"
	WHERE id ="${input.cosip_id}"
	`
}
export function UpdateCosiptoIncident(input){
	return `
	UPDATE incident
	SET
		cosip_id="${input.cosip_id}",
		statut_id="${input.statut_id}",
		priorite_id="${input.priorite_id}",
		is_contournement="${input.is_contournement ? 1 : 0}",
		is_faux_incident="${input.is_faux_incident ? 1 : 0}",
		description="${input.description}",
		description_contournement="${input.description_contournement}",
		cause="${input.cause}",
		origine="${input.origine}",
		plan_action="${input.plan_action}",
		action_retablissement="${input.action_retablissement}"
	WHERE id ="${input.incident_id}"
	`
}

//Fin d'ajout

/// Requêtes de récupération  COSIP 
export function getCosipById(id){
	return `
SELECT 
incident.cosip_id,
incident.id,
replace (group_concat (DISTINCT incident_reference.reference),",","/") as 'reference',
replace(group_concat(DISTINCT incident_reference.id),",","/") as 'reference_id',
incident.statut_id,
incident_impact_enseigne.date_debut, 
cosip.titre,
replace (group_concat (DISTINCT incident_impact_enseigne.enseigne_id),",","/") as 'enseigne_id',
replace (group_concat (DISTINCT enseigne.nom),",","/") as 'enseigne_nom', 
incident_statut.nom,
replace (group_concat (DISTINCT incident_application_impactee.Application_code_irt),",","/") as 'code_irt' ,
replace (group_concat (DISTINCT incident_application_impactee.nom_appli),","," | ") as 'application',
incident.description, 
incident_priorite.priorite,
incident.priorite_id,
incident_impact_enseigne.description_impact,
incident.crise_itim,
incident.cause,
incident.origine,
cosip.plan_action,
cosip.cause_racine,
cosip.classification_id,
cosip.gravite_id,
cosip.entite_responsable,
incident.action_retablissement,
incident_impact_enseigne.date_detection,
incident_impact_enseigne.date_premier_com,
incident_impact_enseigne.date_fin,
incident_entite_responsable.nom as 'responsable_nom'
FROM incident
INNER JOIN incident_reference ON incident.id=incident_reference.incident_id
INNER JOIN incident_statut ON incident.statut_id=incident_statut.id
INNER JOIN incident_impact_enseigne ON incident.id=incident_impact_enseigne.incident_id
INNER JOIN cosip ON incident.cosip_id=cosip.id
join incident_entite_responsable on incident_entite_responsable.id=incident.entite_responsable_id
INNER JOIN enseigne ON incident_impact_enseigne.enseigne_id=enseigne.id
INNER JOIN incident_application_impactee ON incident.id=incident_application_impactee.incident_id
INNER JOIN incident_priorite ON incident.priorite_id=incident_priorite.id
WHERE incident.id = '${id}';
`
}

export function getCosipFormated(){
	return `
	SELECT incident.id,  
	incident_classification.nom as "Majeur / Significatif",
	replace(group_concat(DISTINCT incident_reference.reference),",","/") as 'reference', 
	incident_impact_enseigne.date_debut as 'date_debut', 
	cosip.titre as Titre,
	replace (group_concat (DISTINCT enseigne.nom),",","/") as 'Enseigne(s)',
	replace(group_concat(DISTINCT application.nom ),","," | ") as 'Application(s)',
	incident.description as "Résumé de l'incident" ,
	incident_priorite.priorite as 'priorité',
	incident_impact_enseigne.date_fin as 'date de fin',
	incident_impact_enseigne.description_impact as "Impact", 
	incident_gravite.nom as "Gravité avérée",
	incident.crise_itim as 'crise ITIM ? ',
	incident.cause as 'cause',
	incident.origine as 'origine',
	incident.action_retablissement as 'Action de rétablissement',
	cosip.plan_action as "Plan d'action",
	cosip.cause_racine as 'Cause Racine',
	incident.description as 'description',  
	incident_statut.id as 'statut',   
	incident.plan_action as 'plan_action', 
	incident_impact_enseigne.date_detection as 'Date detection',
	incident_impact_enseigne.date_com_tdc as 'Date communication tdc', 
	incident_impact_enseigne.date_qualif_p01 as 'Date qualif_p01',
	incident_impact_enseigne.date_premier_com as 'Date premier com',
	incident.description_contournement as 'Description contournement',
	cosip.entite_responsable as 'Entite Responsable'
FROM ((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_statut on incident.statut_id = incident_statut.id) 
	join cosip on incident.cosip_id = cosip.id
	join incident_classification on cosip.classification_id=incident_classification.id
	join incident_gravite on cosip.gravite_id=incident_gravite.id
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
	left join incident_application_impactee on incident.id = incident_application_impactee.incident_id
	left join application on application.code_irt = incident_application_impactee.Application_code_irt AND application.trigramme = incident_application_impactee.Application_trigramme
GROUP BY incident_reference.incident_id
ORDER BY incident.id asc;
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

////////////////////////////
/////////AJOUT/////////////
//////////////////////////



///////////////////////////////////////
/////////////// Stats /////////////////
///////////////////////////////////////
export function getOrigineIncMaj(){
	return `
SELECT inc_par_mois, nom, count(nom) as nombre
FROM (
	SELECT date(incident_impact_enseigne.date_debut, 'start of month') as inc_par_mois, incident_entite_responsable.nom
	FROM incident
		JOIN incident_entite_responsable ON incident.entite_responsable_id = incident_entite_responsable.id
		JOIN incident_impact_enseigne ON incident.id = incident_impact_enseigne.incident_id
		JOIN enseigne ON incident_impact_enseigne.enseigne_id = enseigne.id
	WHERE enseigne.nom = 'BDDF' AND incident_impact_enseigne.gravite_averee = 'Elevé' AND date(incident_impact_enseigne.date_debut) > date('now', '-12 month')
)
GROUP BY inc_par_mois, nom	
`
}