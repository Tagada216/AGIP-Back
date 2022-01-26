const {DataTypes} = require ("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('incident_reference', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
            },
        reference:{
            type: DataTypes.STRING(25),
            unique: true
        },
        incident_id:{
            type: DataTypes.INTEGER
        }
        }, {
            timestamps: false,
            freezeTableName: true,
            tableName: 'incident_reference'
    })

}