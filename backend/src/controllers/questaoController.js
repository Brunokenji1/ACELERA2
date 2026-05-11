//autenticação das questoes

const Questoes = require('../models/Questoes');
const Materias = require('../models/Materias');
const Alternativas = require('../models/Alternativas');

async function listarQuestoes(req,res) {
    try{
        const where ={}
        if(req.query.id_materia) where.id_materia = req.query.id_materia
        if(req.query.dificuldade) where.dificuldade = req.query.dificuldade
        
        const todasQuestoes = await Questoes.findAll({
            where,
            order: [['id','ASC']],   //ASC = crescente
            include: [{model: Alternativas}]
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
                model: Alternativas
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

module.exports = {listarQuestoes, buscarQuestoes,listarMaterias}