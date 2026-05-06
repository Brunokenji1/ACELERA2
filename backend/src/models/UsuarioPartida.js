const {DataTypes} = require('sequelize');
const{sequelize} = require('../config/database');

const UsuarioPartida = sequelize.define('UsuarioPartida',{
    id_usuario:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
    },
    id_partida:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,

    },
    botao_numero:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1,
            max:8
        }
        
    },
    pontos_partida:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        validate:{
            min:0
        }
    },
    ganhou:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    },
},
{
    tableName:'usuario_partida',
    timestamps: false
});

module.exports = UsuarioPartida;