const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('application', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nom:{
            type: DataTypes.TEXT
        },
        libelle_court:{
            type:DataTypes.STRING(100),
            allowNull: true
        },
        trigramme:{
            type: DataTypes.STRING(25),
            unique: false
        },
        code_irt:{
            type: DataTypes.STRING(25),
            unique: false
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'application'
    });
}