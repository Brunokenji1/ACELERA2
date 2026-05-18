require('dotenv').config();     //depois a porta vem da chamada process.env.PORT
const http = require('http');
const app = require('./src/app');
const {testarConexao} = require('./src/config/database');

const PORT = process.env.PORT   //declaração da porta que esta la no .env

async function iniciar(){
    await testarConexao();  //esperar a resposta para iniciar o servidor
    
    //criando servidor http a partir do app do express
    const servidor = http.createServer(app)

    servidor.listen(PORT, () =>{
        console.log(`Servidor online na PORTA: ${PORT}`)
    })

}

iniciar();  