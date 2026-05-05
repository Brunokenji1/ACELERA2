const {DataTypes} = require('sequelize');   
const {sequelize} = require('../config/database');

const Materia = sequelize.define('Materia',{
    id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true,    //por ser SERIAL no banco de dados, isso gera um numero automaticamente
    },
    nome:{
        type:DataTypes.STRING(200),
        unique:true,
        allowNull:false,
    }
},
{
    tableName:'materia',
    timestamps:false,
},
)
module.exports = Materia;