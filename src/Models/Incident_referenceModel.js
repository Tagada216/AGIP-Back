const {DataTypes} = require ("sequelize");


module.exports = (sequelize) => {
    return sequelize.define('incident_reference', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
            },
        reference:{
            type: DataTypes.STRING(25)
        },
        incident_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_reference'
    });
}