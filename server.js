// Create express app
var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")

app.use(cors())

// Server port
var HTTP_PORT = 5000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/incident", (req, res, next) => {
    var sql = "select id, description, cause, origine from incident limit 60"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(JSON.parse(JSON.stringify(rows).replace(/\u0092/g,"'")))
      });
});


app.get("/api/incident/:id", (req, res, next) => {
    var sql = "select * from incident where id = ?"
    var refSql = "select * from incident_reference"
    var params = [req.params.id]
    db.get(sql, params, (err, incident) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        db.get
        res.json(JSON.parse(JSON.stringify(incident).replace(/\u0092/g,"'")))
      });
});


// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});