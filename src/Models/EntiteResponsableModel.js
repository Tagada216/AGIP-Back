const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('incident_entite_responsable',{
        id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true
        },
        nom:{
            type: DataTypes.STRING(50)
        }
    },{
        timestamps: false,
        frezeTableName: true,
        tableName: 'incident_entite_responsable'
    })
}