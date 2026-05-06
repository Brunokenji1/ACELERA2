const {DataTypes} = require('sequelize');
const{sequelize} = require('../config/database');

const RodadaDeQuestoes = sequelize.define('RodadaDeQuestoes',{
    id_rodada:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
    },
    id_questao:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
    },
    ordem:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    id_participante_1:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    id_participante_2:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    status:{
        type:DataTypes.STRING(20),
        allowNull:false,
        defaultValue:'aguardando_buzz',
        validate:{
            isIn:[['aguardando_buzz','aguardando_resposta','finalizada']]
        }
    },
    iniciado_em:{
        type:DataTypes.DATE
    },
    finalizada_em:{
        type:DataTypes.DATE
    },
},
{
    tableName:'rodada_de_questoes',
    timestamps:false
});

module.exports = RodadaDeQuestoes;