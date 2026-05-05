// aqui ficara a configuracao do postgresql

require('dotenv').config();     //acessa todos os itens atraves de proceess.env.ITEM
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres', //dizendo pro Sequelize que o banco é o PostgreSQL
    }
)

async function testarConexao(){
    await sequelize.authenticate();
};

module.exports = { sequelize , testarConexao } 