//coração do jogo: criar partidas, entrar, autenticar, buscar, tudo isso ta aqui

const Partidas = require('../models/Partidas');
const UsuarioPartida = require('../models/UsuarioPartida')
const Rodadas = require('../models/Rodadas');

async function criarPartida (req,res) {
    try{
        const {id_materia, dificuldade, id_fonte} = req.body;
        const id_criador = req.usuarioId;

        const novaPartida = await Partidas.create({
            id_criador,
            id_materia, 
            dificuldade, 
            id_fonte,
            status: 'aguardando'
        });
        //definindo o criador da partida como primeiro jogador
        await UsuarioPartida.create({
            id_usuario: id_criador,
            id_partida: novaPartida.id,
            botao_numero:1 
        });
        return res.status(201).json({partida: novaPartida });
    }
    catch(err){
        return res.status(401).json({ err: 'Erro interno'});
    }
}
async function entrarPartida(req,res) {
    try{
        const {id} = req.params;            //id do jogador que hospeda partida
        const id_usuario = req.usuarioId    //id do jogador que vai entrar

        const partida = await Partidas.findOne({where: {id}})
        if(!partida){
            return res.status(404).json({erro: 'Partida não encontrada' });
        }
        if(partida.status !== 'aguardando'){
            return res.status(400).json({erro: 'Partida não está disponível.'})
        }
        if(partida.id_criador === id_usuario){
            return res.status(400).json({erro: 'Você não pode entrar na sua própria partida'})        
        }
        //adicionando o segundo jogador
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

module.exports = {criarPartida, buscarPartida, entrarPartida}