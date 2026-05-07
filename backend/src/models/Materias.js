const {DataTypes} = require('sequelize');   
const {sequelize} = require('../config/database');

const Materias = sequelize.define('Materias',{
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
    tableName:'materias',
    timestamps:false,
},
)
module.exports = Materias;