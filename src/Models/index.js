// ---------------------------------------------------------------

// Centralisation des models pour l'attribution des clés étrangère 
// Définition de l'environement pour la connexion à la BDD 

// ------------------------------------------------------------------

const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

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

// -------------  Récupération des models pour créer les clés étrangères / Même si ils ne sont pas utilisés les models doivent être initialisés pour être récupérés ----------------------- 

const incident = require('./IncidentModel.js')(sequelize);
const incident_reference = require('./Incident_referenceModel.js')(sequelize);
const incident_application_impactee = require('./Incident_application_impacteeModel.js')(sequelize);
const application = require('./ApplicationModel.js')(sequelize);
const incident_impact_enseigne = require('./incident_impact_enseigneModel.js')(sequelize);
const Enseigne = require('./EnseigneModel.js')(sequelize);
const cosip = require('./CosipModel.js')(sequelize);
const statuts = require('./Incident_statutModel.js')(sequelize);
const priorites = require('./Incident_prioriteModel.js')(sequelize);
const probleme = require('./ProblemeModel.js')(sequelize);
const problemeDomaine = require('./ProblemeDomaineModel.js')(sequelize);
const problemeSousDomaine = require('./ProblemeSousDomaineModel.js')(sequelize);
const problemeType = require('./ProblemeTypeModel.js')(sequelize);
const problemeWorkOrder = require('./ProblemeWorkOrderModel.js')(sequelize);
const problemeWorkCatAction = require('./ProblemeWorkCatActionModel.js')(sequelize);
const problemeWorkTypeAction = require('./ProblemeWorkOrderTypeActionModel.js')(sequelize);
const problemeWorkStat = require('./ProblemeWorkStatModel.js')(sequelize);
const gravite = require('./GraviteModel.js')(sequelize);
const causeRacine = require('./CauseRacineModel.js')(sequelize);
const incident_entite_responsable = require('./EntiteResponsableModel')(sequelize);
// Hooks (Permet de faire des qaction sur les tables avant ou après la création d'un élément etc... )


// -----------------------  Jointure  Main courante --------------------

// Incident et incident_reference
incident.hasMany(incident_reference, {foreignKey:'incident_id', sourceKey:'id'});
incident_reference.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

// Incident et incident_application_impactee 
incident.hasMany(incident_application_impactee, {foreignKey:'incident_id', sourceKey:'id'});
incident_application_impactee.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

//  Incident impact enseigne et incident
incident.hasMany(incident_impact_enseigne, {foreignKey:'incident_id', sourceKey:'id'});
incident_impact_enseigne.belongsTo(incident, {foreignKey:'incident_id', targetKey:'id'});

// -----------------------------------------------------------------------------

// Incident impact enseinge et enseigne 
Enseigne.hasMany(incident_impact_enseigne, {foreignKey:'enseigne_id', sourceKey:'id'});
incident_impact_enseigne.belongsTo(Enseigne, {foreignKey:'enseigne_id', targetKey:'id'});

// Incident_application_impactee et application 
application.hasMany(incident_application_impactee, {foreignKey:'Application_code_irt', sourceKey:'code_irt'});
incident_application_impactee.belongsTo(application, {foreignKey:'Application_code_irt', targetKey:'code_irt'});

// _________________________ Jointure Cosip _________________
// Incident et Cosip 
incident.hasOne(cosip, {foreignKey:'id', sourceKey:'cosip_id'});
cosip.belongsTo(incident, {foreignKey:'id', targetKey:'cosip_id'});

cosip.hasOne(incident, {foreignKey:'cosip_id', sourceKey:'id'} );
incident.belongsTo(cosip, {foreignKey:'cosip_id', sourceKey:'id'});


module.exports = sequelize