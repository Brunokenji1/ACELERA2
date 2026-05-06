const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Fontes = sequelize.define('Fontes',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    id_tipo_nivel:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    nome:{
        type:DataTypes.STRING(200),
        unique:true,
        allowNull:false,
    },
},
{
    tableName:'fontes',
    timestamps:false
});

module.exports = Fontes;