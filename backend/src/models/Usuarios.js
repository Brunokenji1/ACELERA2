const {DataTypes} = require('sequelize');   // instancia a função de definir tipos da biblioteca sequelize
const {sequelize} = require('../config/database');  // puxa o sequelize instanciado no database.js

const Usuarios = sequelize.define('Usuarios' , {
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
    cpf:{
        typr: DataTypes.STRING(14),
        unique: true,
        allowNull: false,
    },
    telefone:{
        type:DataTypes.STRING(20),
        allowNull: false,
    },
    senha_hash:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo:{
        type:DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'usuario',
        validate:{
            isIn:[['usuario','admin']]
        },
    },
    pontos_totais:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0,
        validate:{
            min:0       //valida se pontos>0
        }
    },
    criado_em:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    
},
{
    tableName: 'usuarios',   //pro sequelize conseguir achar a tabela
    timestamps: false,      //para o sequelize n inventar de tentar mexer nas datas
},
)
module.exports = Usuarios;   