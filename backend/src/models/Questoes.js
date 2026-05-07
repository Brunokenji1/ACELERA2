const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Questoes = sequelize.define('Questoes',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_fonte:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    id_materia:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    enunciado:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    dificuldade:{
        type:DataTypes.STRING(10),
        allowNull:false,
        validate:{
            isIn:[['facil','medio','dificil']]
        },
    },
    ano:{
        type:DataTypes.INTEGER,
        validate:{
            min:1970,
            max:2100
        }
    },
    criado_em:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    }
},
{
    tableName:'questoes',
    timestamps:false
});

module.exports = Questoes