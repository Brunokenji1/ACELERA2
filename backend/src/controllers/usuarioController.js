// aqui estao as funcoes para: perfil e ranking

const Usuarios = require('../models/Usuarios')

async function perfil(req, res) {
    try {
        const id = req.usuarioId
        const usuario = await Usuarios.findOne({ where: { id } })
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuario não encontrado' })
        }

        // calcula posição no ranking
        const usuariosAcima = await Usuarios.count({
            where: {
                [require('sequelize').Op.or]: [
                    { pontos_totais: { [require('sequelize').Op.gt]: usuario.pontos_totais } },
                    {
                        pontos_totais: usuario.pontos_totais,
                        id: { [require('sequelize').Op.lt]: usuario.id }    
                    }
                ]
        }
    })  
        const posicao = usuariosAcima + 1

        return res.status(200).json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                cpf: usuario.cpf,
                foto_url: usuario.foto_url,
                bio: usuario.bio,
                pontos_totais: usuario.pontos_totais,
                posicao_ranking: posicao
            }
        })
    } catch(err) {
        return res.status(500).json({ erro: 'Erro interno' })
    }
}

async function ranking(req, res) {
    try {
        const usuarios = await Usuarios.findAll({
            order: [['pontos_totais', 'DESC'], ['id', 'ASC']] //DESC -> decrescente 
        })
        return res.status(200).json({
            ranking: usuarios.map((u, index) => ({  //map pega só o que eu quero
                posicao: index + 1,
                id: u.id,
                nome: u.nome,
                pontos_totais: u.pontos_totais
            }))
        })
    } catch(err) {
        return res.status(500).json({ erro: 'Erro interno' })
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