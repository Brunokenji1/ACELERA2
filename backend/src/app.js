//aqui ficara as instuções/rotas da API

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express()

//app.use(algumaCoisa); ativa um middleware
app.use(helmet())           //adiciona cabecalho de seguranã http automatico.
app.use(cors())             //conexao com frontend
app.use(express.json())     //permite a leitura dos json que o frontend manda (todas as informações chegam como json)


module.exports = {app, express}