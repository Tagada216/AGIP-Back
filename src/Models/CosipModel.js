const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('cosip', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        is_cosip:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        other_entite_responsable:{
            type: DataTypes.STRING(100)
        },
        plan_action :{
            type: DataTypes.TEXT
        },
        cause_racine_id:{
            type: DataTypes.INTEGER
        },
        comment: {
            type: DataTypes.TEXT
        },
        cosip_resume :{
            type: DataTypes.TEXT
        },
        semaine_cosip:{
            type: DataTypes.STRING(25)
        }
    },{
        timestamps: false,
        freezeTableName: true,
        tableName: 'cosip'
    })
}