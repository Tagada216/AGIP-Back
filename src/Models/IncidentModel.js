const {DataTypes} = require ("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('incident',{
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
            },
        is_imported:{
            type: DataTypes.BOOLEAN
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        cause: {
            type:DataTypes.TEXT
        },
        origine: {
            type:DataTypes.TEXT
        },
        observations: {
            type:DataTypes.TEXT
        },
        plan_action: {
            type:DataTypes.TEXT
        },
        nombre_occurence: {
            type:DataTypes.TEXT
        },
        departement_responsable :{
            type: DataTypes.STRING(100)
        },
        sous_traitant_responsable:{
            type: DataTypes.STRING(100)
        },
        service_metier:{
            type: DataTypes.STRING(100)
        },
        famille_service_metier:{
            type:DataTypes.STRING(100)
        },
        obsolescence:{
            type:DataTypes.BOOLEAN
        },
        import_code_irt:{
            type:DataTypes.STRING(45)
        },
        import_probleme_ref:{
            type:DataTypes.STRING(45)
        },
        nom_app_impactante:{
            type: DataTypes.STRING(100)
        },
        is_contournement: {
            type: DataTypes.BOOLEAN
        },
        description_contournement :{
            type: DataTypes.TEXT
        },
        action_retablissement: {
            type: DataTypes.TEXT
        },
        is_faux_incident:{
            type: DataTypes.BOOLEAN
        },
        is_agence:{
            type: DataTypes.BOOLEAN
        },
        crise_ITIM :{
            type: DataTypes.BOOLEAN
        },
        statut_id :{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        priorite_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cause_racine_id:{
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'incident'
    });
}