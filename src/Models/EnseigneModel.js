const {DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    return sequelize.define('enseigne', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }, 
        nom:{
            type: DataTypes.TEXT
        },
        is_deprecated:{
            type: DataTypes.BOOLEAN
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'enseigne'
    })
}