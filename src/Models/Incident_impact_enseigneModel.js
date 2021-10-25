const {DataTypes} = require ('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('incident_impact_enseigne', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        incident_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gravite_id:{
            type: DataTypes.INTEGER,
        },
        description_impact:{
            type: DataTypes.TEXT
        },
        date_debut: {
            type: DataTypes.DATE
        },
        date_fin: {
            type: DataTypes.DATE
        },
        date_fin_com: {
            type: DataTypes.DATE
        },
        date_detection: {
            type: DataTypes.DATE
        },
        date_com_tdc: {
            type: DataTypes.DATE
        },
        date_qualif_p01: {
            type: DataTypes.DATE
        },
        date_premier_com:{
            type: DataTypes.DATE
        },
        date_solution: {
            type: DataTypes.DATE
        },
        date_retablissement: {
            type: DataTypes.DATE
        },
        jh_perdu :{
            type: DataTypes.DECIMAL
        },
        nombre_utilisateurs:{
            type : DataTypes.DECIMAL
        },
        taux_indispo_reseau:{
            type : DataTypes.DECIMAL
        },
        duree_indispo_reseau :{
            type: DataTypes.TIME
        },
        logiteInet_cust:{
            type: DataTypes.TIME
        },
        chiffre_cust :{
            type: DataTypes.TIME
        },
        dab_cust:{
            type: DataTypes.TIME
        },
        progeliance_cust:{
            type: DataTypes.TIME
        },
        net_EIPRO_cust :{
            type: DataTypes.TIME
        },
        etece_cust :{
            type: DataTypes.TIME
        },
        enseigne_id : {
            type: DataTypes.INTEGER
        },
        gravite_id :{
            type: DataTypes.INTEGER
        }
    },{
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident_impact_enseigne'
    });
}