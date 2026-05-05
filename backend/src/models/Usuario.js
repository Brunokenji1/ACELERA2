const {DataTypes} = require('sequelize');   // instancia a função de definir tipos da biblioteca sequelize
const {sequelize} = require('../config/database');  // puxa o sequelize instanciado no database.js

const Usuario = sequelize.define('Usuario' , {
    id: {
    type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    data_nascimento:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(250),
        unique:true,
        allowNull: false,
    },
    senha_hash:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pontos_totais:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    criado_em:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    
},
{
    tableName: 'usuario',   //pro sequelize conseguir achar a tabela
    timestamps: false,      //para o sequelize n inventar de tentar mexer nas datas
},
)
module.exports = Usuario;   