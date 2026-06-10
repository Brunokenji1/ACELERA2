//coração do jogo: criar partidas, entrar, autenticar, buscar, tudo isso ta aqui

const Partidas = require('../models/Partidas');
const UsuarioPartida = require('../models/UsuarioPartida')
const Rodadas = require('../models/Rodadas');
const {validationResult} = require('express-validator');
const {iniciarPartida, buscarRodadaAtual, registrarBuzz, processarResposta, pularRodadaAtual} = require('../services/partidaService')

async function criarPartida (req,res) {
    try{
        const erros = validationResult(req)
        if(!erros.isEmpty()){
            return res.status(400).json({erros: erros.array()})
        }
        const {id_materia, dificuldade, id_fonte, quantidade_questoes} = req.body;
        const id_criador = req.usuarioId;

        const novaPartida = await Partidas.create({
            id_criador,
            id_materia, 
            dificuldade, 
            id_fonte,
            quantidade_questoes: quantidade_questoes || 11,
            status: 'aguardando'
        });
        //definindo o criador da partida como primeiro jogador
        await UsuarioPartida.create({
            id_usuario: id_criador,
            id_partida: novaPartida.id,
            botao_numero: 1
        });
        
        
        return res.status(201).json({partida: novaPartida });
    }
    catch(err){
        return res.status(500).json({ erro: err.message});
    }
}
async function entrarPartida(req,res) {
    try{
        const {id} = req.params;            //id do jogador que hospeda partida
        const id_usuario = 2       //id do convidado

        const partida = await Partidas.findOne({where: {id}})
        if(!partida){
            return res.status(404).json({erro: 'Partida não encontrada' });
        }
        if(partida.status !== 'aguardando'){
            return res.status(400).json({erro: 'Partida não está disponível.'})
        }
        //adicionando o jogador convidado
        await UsuarioPartida.create({
            id_usuario,
            id_partida: partida.id,
            botao_numero:2
        })
    
        //atualizando status da partida para em_andamento:
        await partida.update({status: 'em_andamento', iniciada_em: new Date() });
        return res.status(200).json({partida});
    }
    catch(err){
        return res.status(500).json({erro: 'Erro interno'});
    }
}
//buscar uma partida especifica
async function buscarPartida(req,res){
    try{
        const{id} = req.params;

        const partida = await Partidas.findOne({
            where: {id},
            include:[
                {model: UsuarioPartida}
            ]
        });

        if(!partida){
            return res.status(404).json({erro: 'Partida não encontrada'});
        }
        return res.status(200).json({partida});
    }
    catch(err){
        return res.status(500).json({erro: 'Erro interno'})
    }
}

async function iniciar(req,res) {
    try{
        const {id} = req.params

        const partida = await Partidas.findOne({where: {id}})
        if(!partida){
            return res.status(404).json({erro: 'Partida não encontrada'})
        }
        
        //Real
        /*
        if (partida.status !== 'em_andamento'){
            return res.status(400).json({erro: 'Partida não está em andamento'})
        }*/

        //Teste
        if (partida.status === 'finalizada'){
            return res.status(400).json({
                erro: 'Partida já foi finalizada'
            })
        }
        //-------------------------

        const resultado = await iniciarPartida(id)
        if(resultado.erro) {
            return res.status(400).json({erro: resultado.erro})
        }
        const rodadaAtual = await buscarRodadaAtual(id)
        return res.status(200).json({
            mensagem: 'Partida iniciada',
            rodada_atual: rodadaAtual
        })
    }
    catch(err){
        return res.status(500).json({erro: err.message })
    }
}

// quando o jogador apertar o buzzer
async function buzz(req,res){
    try{
        const {id} = req.params
        const {botao_numero, tempo_buzz_ms} = req.body

        //descobrir o id_usuario pelo botao_numero
        const jogador = await UsuarioPartida.findOne({
            where: {id_partida: id, botao_numero}
        })
        if(!jogador){
            return res.status(404).json({erro: 'Jogador não encontrado'})
        }
        const resultado = await registrarBuzz(id,jogador.id_usuario, tempo_buzz_ms || 0)
        if(resultado.erro){
            return res.status(400).json({erro: resultado.erro})
        }
        return res.status(200).json({
            mensagem: 'Buzz_registrado',
            jogador: jogador.id_usuario,
            ordem_tentativa: resultado.ordem_tentativa,
            id_rodada: resultado.id_rodada
        })
    }
    catch(err){
        return res.status(500).json({erro: 'Erro interno'})
    }
}

    //jogador escolheu uma alternativa
async function responder(req,res){
    try{
        const {id} = req.params
        const {botao_numero, alternativa, id_rodada, tempo_buzz_ms} = req.body

        //achar o id_usuario pelo botao_numero
        const jogador = await UsuarioPartida.findOne({
            where: {id_partida: id, botao_numero}
        })
        
        if(!jogador){
            return res.status(404).json({erro: 'Jogador não encontrado'})
        }

        //descobrir o id_alternativa pela letra e pela rodada:
        const {RodadaDeQuestoes, Alternativas} = require('../models')
        const rdq = await RodadaDeQuestoes.findOne({where: {id_rodada}})
        if(!rdq) {
            return res.status(404).json({erro: 'Rodada não encontrada'})
        }

        const alternativaEscolhida = await Alternativas.findOne({
            where: {id_questao: rdq.id_questao,
            ordem: alternativa}
        })
        if(!alternativaEscolhida) {
            return res.status(404).json({erro: 'Alternativa não encontrada'})
        }

        const resultado = await processarResposta(
            id_rodada,
            jogador.id_usuario,
            alternativaEscolhida.id,
            tempo_buzz_ms || 0,
            0
        )

        if(resultado.erro){
            return res.status(400).json({erro: resultado.erro})
        }
        return res.status(200).json({
            acertou: resultado.acertou,
            vez_jogador: resultado.vez_jogador || null,
            proxima_rodada: resultado.proxima_rodada || null
        })
    }
    catch(err){
        return res.status(500).json({erro: err.message})
    }
}

async function pularRodada(req, res) {
    try {
        const { id } = req.params
        const resultado = await pularRodadaAtual(id)
        if (resultado.erro) return res.status(400).json({ erro: resultado.erro })
        return res.status(200).json(resultado)
    } catch(err) {
        return res.status(500).json({ erro: err.message })
    }
}

module.exports = {criarPartida, buscarPartida, entrarPartida, iniciar, buzz, responder, pularRodada }