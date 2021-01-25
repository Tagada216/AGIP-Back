
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
	getIncStatut,
	getEnseignes,
	createMainCourante,
	getMainCourante,
	getApp,
	getFormatedMainCourante,
	updateMainCourante,
	getProbs,
	getReference,
	deleteIncident,
	insertMainCourante,
	insertImpactEnseigne,
	statOrigineIncidentsMajeurs,
	createMainCouranteAgence,
	updateMainCouranteAgence,
	getCosipById,
	AddToCosip,
	getCosipFormated,
	getIdcosip,
	getIncGravite,
	UpdateCosip,
	createAgence,
	updateAgence,
	statGetPriorite,
	statGetApplications,
	statGetMajInc,
	getFormatedAgence
} from "./data"

// Définition du port du serveur
var HTTP_PORT = 5000
// Allumage du server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

app.delete("/api/main-courante", (req, res)=>{
	deleteIncident(res, req.body)
})

app.post("api/main-courante-enseigne", (req, res) => {
	insertImpactEnseigne(res, req.body)
})

app.put("/api/main-courante", (req, res) => {
	updateMainCourante(res, req.body)
})

app.put("/api/main-courante-agence", (req, res) => {
	updateMainCouranteAgence(res, req.body)
})
app.put("/api/update-agence", (req, res) => {
	updateAgence(req.body, res)
})

app.post("/api/create-agence", (req,res) =>{
	createAgence(req.body,res)
})


app.post("/api/main-courante", (req, res) => {
	createMainCourante(res, req.body)
})

app.post("/api/main-courante-agence", (req, res) => {
	createMainCouranteAgence(res, req.body)
})

app.post("/api/insert-main-courante", (req, res) => {
	insertMainCourante(res, req.body)
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

app.get("/api/reference", (req, res) => {
	getReference(res)
})


app.get("/api/applications", (req, res) => {
	getApp(res)
})


app.get("/api/probs", (req, res) => {
	getProbs(res)
})

app.get("/api/agence-isolees/formated", (req, res) => {
	getFormatedAgence(res)
})

/////////////////////////////////////
//Chemins d'obtentions COSIP ///////
////////////////////////////////////

// Récupération de l'ind COSIP dans la table incident 
// Récupération de l'ind COSIP dans la table incident

app.get("/api/id-cosip/:id", (req,res)=>{
	var params = [req.params.id]
	getIdcosip(res, params[0])
})

//Tous les incidents au Cosip 
app.get("/api/cosip", (req, res) => {
	getCosipFormated(res)
})


//Chemin d'obtention d'un seul incident dans le cosip
app.get("/api/cosip/:id", (req,res) => {
	var params = [req.params.id]
	getCosipById(res, params[0])
})
////////////////////////////////////////
//Chemins d'ajout des incidents dans le cosip 
////////////////////////////////////////
app.post("/api/add-cosip/:id", (req, res)=> {
	var params =[req.params.id]
	AddToCosip(res, req.body, params[0])
})

// Update du COSIP 
app.put("/api/update-cosip/:id", (req, res)=> {
	var params =[req.params.id]
	UpdateCosip(res, req.body, params[0])
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

//Toute les gravités 
app.get("/api/incidents/gravite",(req,res)=> {
	getIncGravite(res)
})
//toutes les priorités
app.get("/api/incidents/priorite", (req, res) => {
	getIncPrio(res)
})

//tous les statut
app.get("/api/incidents/statut", (req, res) => {
	getIncStatut(res)
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


//////////////////////
// Truc temporaire pour le rapport COPER
//////////////////////
const file = "V:\\ITIM\\GSI\\TDC\\PROBLEMES\\03-Stockdespbs\\034-ExportITSM\\Programmes_sources\\Fiches_COPER - v2.1.xlsm"

app.get("/api/probs/coper", (req,res) =>{
	res.sendFile(file)
})
//////////////////////




////////////////////////////////////////
//Chemins d'obtention des stats
////////////////////////////////////////
app.get("/api/stat/orig-inc-maj", (req,res) =>{
	statOrigineIncidentsMajeurs(res)
})

app.get("/api/stat/priorites", (req,res) =>{
	statGetPriorite(res)
} )

app.get("/api/stat/applications", (req,res) =>{
	statGetApplications(res)
} )

app.get("/api/stat/majeur", (req,res) => {
	statGetMajInc(res)
})
