const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const TipoNivel = sequelize.define('TipoNivel',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    nome:{
        type:DataTypes.STRING(200),
        unique: true,
        allowNull: false,
    },
},
{
    tableName: 'tipo_nivel',
    timestamps: false,
});

module.exports = TipoNivel