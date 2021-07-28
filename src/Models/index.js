// ---------------------------------------------------------------

// Centralisation des models pour l'attribution des clés étrangère 
// Définition de l'environement pour la connexion à la BDD 

// ------------------------------------------------------------------

const {Sequelize} = require('sequelize');


require('dotenv').config();

// Initialisation de la connexion SQLITE 
const sequelize = new Sequelize({
	dialect: "sqlite",
	//Local : "C:/Users/A487365/Documents/BDD/TDC_AGIPROS_BDD.sdb"
	// DEV : "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD_Dev.sdb"
	// Master: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_AGIPROS_BDD-Master.sdb"
	storage: process.env.DB_HOST,
	define: {
		timestamps: false
	}
});

// -------------  Définition des clés étrangéres des tables ----------------------- 

const Incident = require('./IncidentModel')(sequelize);
const Incident_Statut = require('./Incident_statutModel')(sequelize);
const Incident_Priorite = require('./Incident_prioriteModel')(sequelize);
const Incident_Cause_Racine = require('./Incident_cause_racineModel')(sequelize);
const Incident_Reference = require('./Incident_referenceModel')(sequelize);
const Incident_application_impactee = require('./Incident_application_impacteeModel')(sequelize);
const application = require('./ApplicationModel')(sequelize);
const IncidentImpactEnseigne = require('./Incident_impact_enseigneModel')(sequelize);
const Enseigne = require('./EnseigneModel')(sequelize);
const Cosip = require('./CosipModel')(sequelize);
// Incident et incident_statut ( hasMany et belogns to correspond à une relation 1,N ) 
Incident_Statut.hasMany(Incident, {foreignKey: 'statut_id', sourceKey: 'id'});
Incident.belongsTo(Incident_Statut, {foreignKey: 'statut_id', targetKey: 'id'});

// Incident et incident_priorite 
Incident_Priorite.hasMany(Incident, {foreignKey: 'priorite_id', sourceKey:'id'});
Incident.belongsTo(Incident_Priorite, {foreignKey: 'priorite_id', targetKey:'id'});

// Incident et incident_cause_racine 

Incident_Cause_Racine.hasMany(Incident, {foreignKey:'cause_racine_id', sourceKey:'id'});
Incident.belongsTo(Incident_Cause_Racine, { foreignKey:'cause_racine_id', targetKey:'id'});

// Incident et incident_reference
Incident.hasMany(Incident_Reference, {foreignKey:'incident_id', sourceKey:'id'});
Incident_Reference.belongsTo(Incident, {foreignKey:'incident_id', targetKey:'id'});

// Incident et incident_application_impactee 
Incident.hasMany(Incident_application_impactee, {foreignKey:'incident_id', sourceKey:'id'});
Incident_application_impactee.belongsTo(Incident, {foreignKey:'incident_id', targetKey:'id'})

// Incident_application_impactee et application 
application.hasMany(Incident_application_impactee, {foreignKey:'Application_code_irt', sourceKey:'code_irt'});
Incident_application_impactee.belongsTo(application, {foreignKey:'Application_code_irt', targetKey:'code_irt'});

application.hasMany(Incident_application_impactee, {foreignKey:'Application_trigramme', sourceKey:'trigramme'});
Incident_application_impactee.belongsTo(application, {foreignKey:'Application_trigramme', targetKey:'trigramme'});

//  Incident impact enseigne et enseinge 
Incident.hasMany(IncidentImpactEnseigne, {foreignKey:'incident_id', sourceKey:'id'});
IncidentImpactEnseigne.belongsTo(Incident, {foreignKey:'incident_id', targetKey:'id'});

// Incident impact enseinge et incident 
Enseigne.hasMany(IncidentImpactEnseigne, {foreignKey:'enseigne_id', sourceKey:'id'});
IncidentImpactEnseigne.belongsTo(Enseigne, {foreignKey:'enseigne_id', targetKey:'id'});

// Incident et Cosip 
Cosip.hasOne(Incident, {foreignKey:'cosip_id', sourceKey:'id'});
Incident.belongsTo(Cosip, {foreignKey:'cosip_id', targetKey:'id'});

module.exports = sequelize