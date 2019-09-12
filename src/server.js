// Creation de l'application Express
var express = require("express")
var bodyParser = require("body-parser")
var cors = require("cors")
var app = express()
// var db = require("./database.js")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Import de toutes les fonctions de gestion de la base de données (Select/Insert/...)
import {
	getIncidents,
	getIncident,
	getIncImpactLayer,
	getIncPrio,
	getIncRespEntity,
	getIncRootCause,
	getIncStatus,
	getEnseignes,
	createMainCourante,
	getMainCourante,
	getApp,
	getFormatedMainCourante
} from "./data"


// Définition du port du serveur
var HTTP_PORT = 5000
// Allumage du server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})



app.post("/api/main-courante", (req, res) => {
	createMainCourante(res, req.body)
})


app.get("/api/main-courante", (req, res) => {
	getMainCourante(res)
})

app.get("/api/main-courante/formated", (req, res) => {
	getFormatedMainCourante(res)
})

app.get("/api/main-courante/:id", (req, res) => {
	var params = [req.params.id]
	getMainCourante(res, params[0])
})


app.get("/api/applications", (req, res) => {
	console.log(req.query)
	getApp(res, req.query.keyword)
})



////////////////////////////////////////
//Chemins d'obtention des incidents
////////////////////////////////////////

//Tous les incidents
app.get("/api/incident", (req, res) => {
	getIncidents(res)
})

//Un seul incident
app.get("/api/incident/:id", (req, res) => {
	var params = [req.params.id]
	getIncident(params[0], res)
})
////////////////////////////////////////




////////////////////////////////////////
//Chemins d'obtention des "types énumérées"
////////////////////////////////////////

//toutes les priorités
app.get("/api/incidents/priorite", (req, res) => {
	getIncPrio(res)
})

//tous les statut
app.get("/api/incidents/status", (req, res) => {
	getIncStatus(res)
})

//toutes les couches du SI
app.get("/api/incidents/couche-si", (req, res) => {
	getIncImpactLayer(res)
})

//toutes les entités du SI
app.get("/api/incidents/entite", (req, res) => {
	getIncRespEntity(res)
})

//toutes les causes racines possibles
app.get("/api/incidents/cause-racine", (req, res) => {
	getIncRootCause(res)
})

//toutes les enseignes du SI
app.get("/api/enseignes/", (req, res) => {
	getEnseignes(res)
})
////////////////////////////////////////





// app.get("/api/incident/:id", (req, res, next) => {
//     var sql = "select * from incident where id = ?"
//     var refSql = "select * from incident_reference"
//     var params = [req.params.id]
//     db.get(sql, params, (err, incident) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           return;
//         }
//         db.get
//         res.json(JSON.parse(JSON.stringify(incident).replace(/\u0092/g,"'")))
//       });
// });


// Root endpoint
// app.get("/", (req, res) => {
// 	getIncidents()
// 	Changement.findAll().then(changements => {
// 		// console.log(JSON.stringify(changements));

// 		res.json(
// 			changements
// 		)

// 	})
// })

// Changement.findAll().then(changements =>{
// 	console.log(JSON.stringify(changements));
// })


// // Insert here other API endpoints

// // Default response for any other request
// app.use(function(req, res){
//     res.status(404);
// });

// Mon commentaire