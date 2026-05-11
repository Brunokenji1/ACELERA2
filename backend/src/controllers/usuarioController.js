// aqui estao as funcoes para: perfil e ranking

const Usuarios = require('../models/Usuarios')

async function perfil(req,res) {
    try{
        const id = req.usuarioId
        const usuario = await Usuarios.findOne({ where: {id}})
        if(!usuario){
            return res.status(404).json({err: 'Usuario não encontrado'})
        }
        return res.status(200).json({
            usuario:{
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                pontos_totais: usuario.pontos_totais
            }
        })

    }
    catch(err){
        return res.status(500).json({err: 'Erro interno'})
    }
}

async function ranking(req,res) {
    try{
        const usuario = await Usuarios.findAll({
            order: [['pontos_totais', 'DESC']] //desc = decrescente
        })
        return res.status(200).json({
            ranking: usuario.map(u =>({     //.map() transforma o usuario pegando so os campos q eu quero
                id: u.id,
                nome: u.nome,
                pontos_totais: u.pontos_totais

            }))
        })
    }
    catch(err){
        return res.status(500).json({err: 'Erro interno'})
    }
}

module.exports = { perfil, ranking }