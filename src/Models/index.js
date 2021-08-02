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

const incident = require('./IncidentModel.js')(sequelize);
const incident_reference = require('./Incident_referenceModel.js')(sequelize);
const incident_application_impactee = require('./Incident_application_impacteeModel.js')(sequelize);
const application = require('./ApplicationModel.js')(sequelize);
const incident_impact_Enseigne = require('./Incident_impact_enseigneModel.js')(sequelize);
const Enseigne = require('./EnseigneModel.js')(sequelize);
const Cosip = require('./CosipModel.js')(sequelize);



// -----------------------  Jointure  Main courante --------------------

// Incident et incident_reference
incident.hasMany(incident_reference, {foreignKey:'incident_id', sourceKey:'id'});
incident_reference.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

// Incident et incident_application_impactee 
incident.hasMany(incident_application_impactee, {foreignKey:'incident_id', sourceKey:'id'});
incident_application_impactee.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

//  Incident impact enseigne et incident
incident.hasMany(incident_impact_Enseigne, {foreignKey:'incident_id', sourceKey:'id'});
incident_impact_Enseigne.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

// -----------------------------------------------------------------------------

// Incident impact enseinge et enseigne 
Enseigne.hasMany(incident_impact_Enseigne, {foreignKey:'enseigne_id', sourceKey:'id'});
incident_impact_Enseigne.belongsTo(Enseigne, {foreignKey:'enseigne_id', targetKey:'id'});

// Incident_application_impactee et application 
application.hasMany(incident_application_impactee, {foreignKey:'Application_code_irt', sourceKey:'code_irt'});
incident_application_impactee.belongsTo(application, {foreignKey:'Application_code_irt', targetKey:'code_irt'});

// _________________________ Jointure Cosip _________________
// Incident et Cosip 
Cosip.hasOne(incident, {foreignKey:'cosip_id', sourceKey:'id'});
incident.belongsTo(Cosip, {foreignKey:'cosip_id', targetKey:'id'});

module.exports = sequelize