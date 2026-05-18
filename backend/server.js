require('dotenv').config();     //depois a porta vem da chamada process.env.PORT
const http = require('http');
const app = require('./src/app');
const {testarConexao} = require('./src/config/database');
const {inicializarSocket} = require('./src/socket');

const PORT = process.env.PORT   //declaração da porta que esta la no .env

async function iniciar(){
    await testarConexao();  //espera a resposta dessa bomba, senao da ruim dps
    
    //criando servidor http a partir do app do express
    const servidor = http.createServer(app)
    //iniciando o socket no mesmo servidor do express
    inicializarSocket(servidor)

    servidor.listen(PORT, () =>{
        console.log(`Servidor online na PORTA: ${PORT}`)
    })

}

iniciar();  