const {DataTypes} = require('sequelize');


module.exports = (sequelize) => {
    return sequelize.define('probleme', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        reference_probleme: {
            type: DataTypes.STRING(45)
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        domaine_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(45)
        },
        priorite: {
            type: DataTypes.STRING(45)
        },
        titre: {
            type: DataTypes.STRING(100)
        },
        entite_responsable: {
            type: DataTypes.STRING(100)
        },
        nom_responsable_probleme: {
            type: DataTypes.STRING(100)
        },
        date_ouverture: {
            type: DataTypes.DATE
        },
        date_resolution: {
            type: DataTypes.DATE
        },
        date_fermeture: {
            type: DataTypes.DATE
        },
        titre: {
            type: DataTypes.TEXT
        },
        groupe_probleme_manager: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.TEXT
        },
        plan_action: {
            type: DataTypes.TEXT
        },
        cause_racine: {
            type: DataTypes.TEXT
        },
    },{
        timestamps: false,
        freezeTableName: true,
        tableName: 'probleme'
    })
}