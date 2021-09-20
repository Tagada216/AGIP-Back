const {DataTypes} = require('sequelize');


module.exports = (sequelize) => {
    return sequelize.define('probleme_work_order_status', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    },{
        timestamps: false,
        freezeTableName: true,
        tableName: 'probleme_work_order_status'
    })
}