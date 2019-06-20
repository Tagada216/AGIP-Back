var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_toolbox.sdb"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
    }
});


module.exports = db

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "V:/ITIM/GSI/TDC/PROBLEMES/07-ToolBoxTDC/BDD/TDC_toolboxTest.sdb"
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const RefIncident = sequelize.define('incident_reference', {
    // attributes
    reference: {
        type: Sequelize.STRING
        // allowNull defaults to true
    },
    incident_id: {
        type: Sequelize.INTEGER
        // allowNull defaults to true
    }
}, {
    // options
    freezeTableName: true
});

RefIncident.findAll().then(refs => {
    console.log("All users:", JSON.stringify(refs, null, 4));
});