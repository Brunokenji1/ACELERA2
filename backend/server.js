require('dotenv').config();     //depois a porta vem da chamada process.env.PORT
const app = require('./src/app');
const {testarConexao} = require('./src/config/database') 

const PORT = process.env.PORT   //declaração da porta que esta la no .env

async function iniciar(){
    await testarConexao();  //espera a resposta dessa bomba, senao da ruim dps

    app.listen(PORT, ()=>{
        console.log(`Servidor online, PORTA:${PORT}`);
    })
}

iniciar();  