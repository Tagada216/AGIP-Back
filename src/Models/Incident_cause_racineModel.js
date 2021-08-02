const {DataTypes} = require ("sequelize");


module.exports = (sequelize) => {
    return sequelize.define('incident_cause_racine', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
            },
        nom:{
            type: DataTypes.STRING(25)
        }
        
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_cause_racine'
    });
}