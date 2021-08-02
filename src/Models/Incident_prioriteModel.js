const {DataTypes} = require ("sequelize");


module.exports = (sequelize) => {
    return sequelize.define('incident_priorite', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
            },
        priorite:{
            type: DataTypes.STRING(25)
        }
        
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_priorite'
    });
}