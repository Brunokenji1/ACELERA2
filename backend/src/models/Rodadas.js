const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Rodadas = sequelize.define('Rodadas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    id_partida:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    nome:{
        type:DataTypes.STRING(200),
    },
    descricao:{
        type:DataTypes.STRING(300),
    },
    ordem:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    status:{
        type:DataTypes.STRING(20),
        allowNull:false,
        defaultValue:'aguardando',
        validate:{
            isIn:[['aguardando','em_andamento','finalizada']]
        }
    },
    iniciado_em:{
        type:DataTypes.DATE
    },
    finalizada_em:{
        type:DataTypes.DATE,
    },
},
{
    tableName: 'rodadas',
    timestamps: false
});

module.exports = Rodadas;