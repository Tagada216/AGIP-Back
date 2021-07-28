const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('application', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        nom:{
            type: DataTypes.TEXT
        },
        libelle_court:{
            type:DataTypes.STRING(100)
        },
        trigramme:{
            type: DataTypes.STRING(25)
        },
        code_irt:{
            type: DataTypes.STRING(25)
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'application'
    });
}