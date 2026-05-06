const {DataTypes} = require('sequelize');
const{sequelize} = require('../config/database');

const Tentativas = sequelize.define('Tentativas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    id_alternativa:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    id_usuario:{
        type:DataTypes.INTEGER,
        allowNull:false,
        
    },
    id_rodada:{
        type:DataTypes.INTEGER,
    },
    modo:{
        type:DataTypes.STRING(15),
        allowNull:false,
        validate:{
            isIn:[['solo','multiplayer']]
        }
    },
    acertou:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
    },
    pontos_ganhos:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        validate:{
            min:0
        }
    },
    tempo_resposta_ms:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0
        }
    },
    respondido_em:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW,
    },
    ordem_tentativa:{
        type:DataTypes.INTEGER,
        validate:{
            isIn:[[1,2]]
        }
    },
    tempo_buzz_ms:{
        type:DataTypes.INTEGER,
        validate:{
            min:0
        }
    },
},
{
    tableName:'tentativas',
    timestamps:false
});

module.exports = Tentativas;