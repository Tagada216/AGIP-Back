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

export function FormatedMainCourante(id){ return `
SELECT incident.id, replace(group_concat(DISTINCT incident_reference.reference),",","/") as 'Référence', 
    incident_impact_enseigne.date_debut as 'Date de début', 
	replace(group_concat(DISTINCT enseigne.nom),",","/") as 'Enseigne', incident.description as Description, incident_priorite.priorite as Priorité, 
	incident_status.nom as Statut, incident_impact_enseigne.date_fin as 'Date de fin', incident_impact_enseigne.description_impact as 'Impact', incident.desc_contournement as 'Contournement', incident.cause as Cause, incident.origine as Origine, 
	incident.action_retablissement as "Action de rétablissement", incident.plan_action as "Plan d'action", incident_impact_enseigne.date_detection as 'Détection',
	incident_impact_enseigne.date_com_tdc as 'Communication TDC', incident_impact_enseigne.date_qualif_p01 as 'Qualification P0 P1',
	incident_impact_enseigne.date_premier_com as "1ere communication à l'enseigne"
FROM ((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_status on incident.status_id = incident_status.id) 
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
${(id === undefined ? "" : "WHERE incident.id = "+id)}
GROUP BY incident_reference.incident_id
ORDER BY incident.id asc;
`
}

export function MainCourante(id){ return `
SELECT incident.id, 
	replace(group_concat(DISTINCT incident_reference.id),",","/") as 'reference_id', 
	replace(group_concat(DISTINCT incident_reference.reference),",","/") as 'reference', 
	replace(group_concat(DISTINCT enseigne.id),",","/") as 'id_enseigne', 
	incident_impact_enseigne.date_debut as 'date_debut', 
	incident.description as 'description', incident_priorite.id as 'priorite', 
	incident_status.id as 'status', incident_impact_enseigne.date_fin as 'date_fin', 
	incident_impact_enseigne.description_impact as 'impact', incident.cause as 'cause', 
	incident.origine as 'origine', incident.action_retablissement as 'action_retablissement',
	incident.plan_action as 'plan_action', 
	incident_impact_enseigne.date_detection as 'date_detection',
	incident_impact_enseigne.date_com_tdc as 'date_communication_tdc', 
	incident_impact_enseigne.date_qualif_p01 as 'date_qualif_p01',
	incident_impact_enseigne.date_premier_com as 'date_premier_com'
FROM ((((incident_reference join incident on incident.id = incident_reference.incident_id) 
	join incident_status on incident.status_id = incident_status.id) 
	join incident_priorite on incident.priorite_id = incident_priorite.id)
	join incident_impact_enseigne on incident.id = incident_impact_enseigne.incident_id join enseigne on enseigne.id = incident_impact_enseigne.enseigne_id)
${(id === undefined ? "" : "WHERE incident.id = "+id)}
GROUP BY incident_reference.incident_id
ORDER BY incident.id asc;
`
}

export function Applications(keyword){ return `
SELECT application.trigramme || '-' || application.code_irt || ' : ' || coalesce(libelle_court, '') || ' (' || coalesce(nom, '') || ')' || coalesce('[' || nom_usage || ']', '')  as 'keyword'
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