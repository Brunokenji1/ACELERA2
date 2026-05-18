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
                telefone: usuario.telefone,
                cpf: usuario.cpf,
                foto_url: usuario.foto_url,
                bio: usuario.bio,
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

async function atualizarPerfil(req, res) {  //para poder editar as informações
    try {
        const id = req.usuarioId
        const { nome, telefone, foto_url, bio } = req.body

        const usuario = await Usuarios.findOne({ where: { id } })
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuario não encontrado' })
        }

        await usuario.update({ nome, telefone, foto_url, bio })

        return res.status(200).json({
            mensagem: 'Perfil atualizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                foto_url: usuario.foto_url,
                bio: usuario.bio,
            }
        })
    }
    catch (err) {
        return res.status(500).json({ erro: 'Erro interno' })
    }
}

module.exports = { perfil, ranking, atualizarPerfil }