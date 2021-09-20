const {DataTypes} = require('sequelize');


module.exports = (sequelize) => {
    return sequelize.define('probleme_work_order', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        reference_work_order: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        titre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date_echeance: {
            type: DataTypes.DATE,
            allowNull: false
        },
        equipe_responsable: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        probleme_work_order_categorie_action: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        probleme_work_order_type_action_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        probleme_work_order_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'probleme_work_order'
    })
}