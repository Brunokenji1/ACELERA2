const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Alternativas = sequelize.define('Alternativas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    id_questao:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    ordem:{
        type:DataTypes.CHAR(1),
        allowNull: false,
        validate:{
            isIn:[['A','B','C','D','E']]
        },
    },
    texto:{
        type:DataTypes.TEXT,
        allowNull: false,
    },
    correta:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    },
    explicacao:{
        type:DataTypes.TEXT,
        allowNull: false,
    },
},
{
    tableName:'alternativas',
    timestamps:false,
})

module.exports = Alternativas;