var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./test.db');

db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();



// var app = require('express')();
// var bodyParser = require('body-parser');
// // normally you'd just do require('express-openapi'), but this is for test purposes.
// var openapi = require('express-openapi');
// var path = require('path');
// var cors = require('cors');

// app.use(cors());
// app.use(bodyParser.json());

// openapi.initialize({
//   apiDoc: require('./api-doc.js'),
//   app: app,
//   paths: path.resolve(__dirname, 'api-routes')
// });

// app.use(function(err, req, res, next) {
//   res.status(err.status).json(err);
// });

// module.exports = app;

// var port = parseInt(process.argv[2], 10);
// console.log(port);

// if (port) {
//   app.listen(port);
// }


// ./app.js
// import express from 'express';
// import { initialize } from 'express-openapi';
// import v1WorldsService from './api-v1/services/worldsService';
// import v1ApiDoc from './api-v1/api-doc';
 
// const app = express();
// initialize({
//   app,
//   apiDoc: v1ApiDoc,
//   dependencies: {
//     worldsService: v1WorldsService
//   },
//   paths: './api-v1/paths'
// });
 
// app.listen(3000);


 