//autenticação das questoes
const { Questoes, Materias, Alternativas } = require('../models')

async function listarQuestoes(req,res) {
    try{
        const where ={}
        if(req.query.id_materia) where.id_materia = req.query.id_materia
        if(req.query.dificuldade) where.dificuldade = req.query.dificuldade
        
        const todasQuestoes = await Questoes.findAll({
            where,
            order: [['id','ASC']],   //ASC = crescente
            include: [{model: Alternativas, as: 'alternativas'}]
        }) 
        return res.status(200).json({ todasQuestoes});
    }
    catch(err){
        return res.status(401).json({err: 'Erro interno'})
    }
}
async function buscarQuestoes(req,res) {
    try{
        const {id} = req.params;
        const questaoBuscada = await Questoes.findOne({
            where:{
                id
            },
            include:{
                model: Alternativas, as: 'alternativas'
            }})
        if(!questaoBuscada){
            return res.status(404).json({erro: 'Questão não encontrada'})
        }
        return res.status(200).json({questaoBuscada})
        
    }
    catch(err){
        return res.status(401).json({err: 'Erro interno'})
    }
    
}
async function listarMaterias(req, res) {
    try {
        const todasMaterias = await Materias.findAll()
        return res.status(200).json({ todasMaterias })
    } catch(err) {
        return res.status(500).json({ erro: 'Erro interno' })
    }
}
async function responderQuestao(req, res) {
    try {
        const { id } = req.params          // id da questão
        const { id_alternativa } = req.body
        const id_usuario = req.usuarioId

        // verifica se a questão existe
        const questao = await Questoes.findOne({ where: { id } })
        if (!questao) {
            return res.status(404).json({ erro: 'Questão não encontrada' })
        }

        // verifica se a alternativa pertence à questão
        const alternativa = await Alternativas.findOne({
            where: { id: id_alternativa, id_questao: id }
        })
        if (!alternativa) {
            return res.status(404).json({ erro: 'Alternativa não encontrada' })
        }

        const acertou = alternativa.correta

        // registra a tentativa
        const { Tentativas } = require('../models')
        const pontos = acertou ? questao.pontuacao : 0

        await Tentativas.create({
            id_alternativa,
            id_usuario,
            modo: 'solo',
            acertou,
            pontos_ganhos: pontos,
            tempo_resposta_ms: 0,
            ordem_tentativa: 1,
            tempo_buzz_ms: 0,
        })

        // se acertou, incrementa pontos totais
        if (acertou) {
            const { Usuarios } = require('../models')
            await Usuarios.increment('pontos_totais', {
                by: pontos,
                where: { id: id_usuario }
            })
        }

        return res.status(200).json({
            acertou,
            alternativa_correta: acertou ? null : await Alternativas.findOne({
                where: { id_questao: id, correta: true }
            })
        })

    } catch (err) {
        return res.status(500).json({ erro: 'Erro interno' })
    }
}

module.exports = {listarQuestoes, buscarQuestoes,listarMaterias, responderQuestao}