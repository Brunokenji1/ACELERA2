//aqui ficara as instuções/rotas da API
const routes = require('./routes');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { errHandler, notFound} = require('./middlewares/errorHandler');

const app = express()

//app.use(algumaCoisa); ativa um middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))           //adiciona cabecalho de seguranã http automatico.
app.use(cors())             //conexao com frontend
app.use(express.json())     //permite a leitura dos json que o frontend manda (todas as informações chegam como json)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))  //serve as fotos de perfil
app.use('/api',routes)      //pega as rotas
app.use(notFound)         //caso a rota buscada nao exista, só utiliza quando precisar, por isso n tem ()
app.use(errHandler)         //captura de erros nas autenticações, só utiliza quando precisar, por isso n tem ()

module.exports = app