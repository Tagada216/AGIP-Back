const {DataTypes} = require ("sequelize");


module.exports = (sequelize) => {
    return sequelize.define('incident_statut', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
            },
        nom:{
            type: DataTypes.STRING(25)
        }
        
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_statut'
    });
}