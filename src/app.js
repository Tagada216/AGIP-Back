// --------------------------------------------------------------

// Connexion sequelize à la BDD et récupération des routes 

// --------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./Models/index.js');
const jwt = require("jsonwebtoken")
const config = require("./config")
const tokenList = {}



// Connexion A la base de données 
sequelize.authenticate()
.then(() => {
 console.log('Database connection OK!');
})
// Si c'est pas bon
.catch(err => {
 console.log('Unable to connect to the database:');
 console.log(err.message);
 process.exit();
});

// Initialisation d'express 
const app  = express();

// Eviter les erreurs CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());



//--------------------- Définitions des routes globals-------------------------------
// Enseigne 
const EnseigneRoutes = require('./Routes/EnseigneRoutes');
app.use('/api/enseigne', EnseigneRoutes);
// Statut 
const StatutRoutes = require('./Routes/StatutRoutes');
app.use('/api/incident/statut', StatutRoutes);

// Priorite 
const PrioriteRoutes = require('./Routes/PrioriteRoutes');
app.use('/api/incident/priorite', PrioriteRoutes);

// ----- Main Courante ----- 
const MainCouranteRoutes = require('./Routes/MainCouranteRoutes');
app.use('/api/incident', MainCouranteRoutes );

// Applications 
const applicationRoutes = require('./Routes/ApplicationRoutes');
app.use('/api/applications', applicationRoutes);

// Références 
const referenceRoutes = require('./Routes/ReferenceRoutes');
app.use('/api/reference', referenceRoutes);

// Incidents impact enseigne 
const incidentImpactEnseigne = require('./Routes/Incident_impact_enseigne');
app.use('/api/impact/enseigne', incidentImpactEnseigne);

// Cosip 
const cosip = require('./Routes/CosipRoutes');
app.use('/api/cosip', cosip);

//Gravite 
const gravite = require('./Routes/GraviteRoutes');
app.use('/api/gravite', gravite);

//Cause racine 
const cause = require('./Routes/CauseRacineRoutes');
app.use('/api/cause-racine', cause);

//Entite Responsable 
const entiteResp = require('./Routes/EntiteResposableRoutes');
app.use('/api/entite-responsable', entiteResp);

module.exports = app; 