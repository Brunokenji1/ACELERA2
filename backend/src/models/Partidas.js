const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Partidas = sequelize.define('Partidas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_criador:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    id_materia:{
        type:DataTypes.INTEGER,
    },
    id_fonte:{
        type:DataTypes.INTEGER,
    },
    dificuldade:{
        type:DataTypes.STRING(10),
        validate:{      
            isIn:[['facil', 'medio', 'dificil']]    //duplo array memo
        },
    },
    status:{
        type:DataTypes.STRING(20),
        defaultValue: 'aguardando',
        validate:{
            isIn:[['aguardando','em_andamento','finalizada']]
        },
},
    criado_em:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW,
    },
    iniciada_em:{
        type:DataTypes.DATE,
    },
    finalizada_em:{
        type:DataTypes.DATE,
    },
},
{
    tableName:'partidas',
    timestamps:false,
})

module.exports = Partidas;