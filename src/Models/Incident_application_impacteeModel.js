const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('incident_application_impactee', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        incident_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Application_code_irt :{
            type: DataTypes.STRING(25)
        },
        Application_trigramme:{
            type: DataTypes.STRING(10)
        },
        nom_appli :{
            type: DataTypes.TEXT
        }
    },{
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_application_impactee' 
    })
}